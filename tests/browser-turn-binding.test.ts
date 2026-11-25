import { afterAll, beforeAll, expect, test } from "bun:test";
import { chromium, type Browser, type Locator, type Page } from "playwright-core";
import { ChatGptBrowserWorker, ChatGptBrowserDiagnostics } from "../src/adapters/chatgpt-web/browser-worker";
import { chatGptHtmlToMarkdown, ChatGptMarkdownBuffer } from "../src/adapters/chatgpt-web/markdown";
import { readFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { matchesSubmission, shellBinding } from "./ownership-probe";

// Own the Edge process at suite scope: process shutdown can outlast a case's
// assertion budget. Every case still gets fresh contexts, closed in its finally.
let browser: Browser;
beforeAll(async () => {
  if (!process.env.CHATGPT_DOM_TEST_BROWSER) return;
  browser = await chromium.launch({ executablePath: process.env.CHATGPT_DOM_TEST_BROWSER, headless: true });
}, 15_000);

afterAll(async () => {
  if (browser) await browser.close();
}, 15_000);

async function closeTestContexts(): Promise<void> {
  for (const context of browser.contexts()) await context.close();
}

for (const scenario of ["history", "accepted-rekey", "history-users-only", "later-user", "duplicate-own", "user-first", "during-expansion"] as const) {
  test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)(
    ({ history: "remounted own turn accepts previously unseen virtualized history",
      "accepted-rekey": "a remounted accepted user with a changed key still requires ownership proof",
      "history-users-only": "historical user remounts do not fail the replacement predicate",
      "later-user": "a competing later user still aborts a detached response",
      "duplicate-own": "duplicate ownership cannot be mistaken for remounted history",
      "user-first": "a verified user may remount before its answer without resubmission",
      "during-expansion": "a competing turn inserted during expansion still aborts" })[scenario], async () => {
      try {
        const page = await browser.newPage();
        const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
        const token = "turn_0123456789abcdef0123456789abcdef";
        const prompt = `Long request\n${"context\n".repeat(2000)}${token}`;
        const group = (key: string, text: string, answer = true) => `<div data-turn-key="${key}">
          <div data-user-message-bubble><div data-search-result-target style="white-space:pre-wrap">${text}</div></div>
          ${answer ? '<div data-conversation-role="assistant">Answer</div>' : ""}</div>`;
        await page.setContent('<main></main><form><div id="composer" contenteditable="true">Draft</div><button id="send" type="button" data-testid="send-button">Send</button></form>');
        worker.activeComposer = async () => page.locator('#composer');
        await page.locator('#send').evaluate(button => {
          (globalThis as any).sendCount = 0;
          button.addEventListener('click', () => {
            (globalThis as any).sendCount++;
            document.querySelector('main')!.innerHTML = '<div data-turn-key="pending"><span hidden data-chatgpt-agent-turn-start></span></div><button data-testid="stop-button">Stop</button>';
          });
        });
        const baseline = await worker.captureSubmissionBaseline(page, prompt, [], token);
        // An owner-less shell is no evidence by itself; the running generation acknowledges Send.
        expect(await worker.sendAttachedPrompt(page, baseline)).toBe("generation_running");
        expect(await worker.currentSubmissionEvidence(page, baseline)).toBe("generation_running");
        expect(baseline.acceptedUserIdentity).toBeUndefined();
        if (scenario === "accepted-rekey") baseline.acceptedUserIdentity = "group:user:pending";
        const binding = shellBinding(page);
        const history = scenario === "accepted-rekey" ? "" : group("unseen-old-1", "Earlier question", scenario !== "history-users-only") + group("unseen-old-2", "Older question", scenario !== "history-users-only");
        let html = history + group("persisted", prompt, scenario !== "user-first");
        if (scenario === "later-user") html += group("competitor", "Real second message");
        if (scenario === "duplicate-own") html = group("duplicate", prompt) + html;
        await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, html);
        if (scenario === "during-expansion") {
          await page.locator('[data-turn-key="persisted"] [data-user-message-bubble]').evaluate((bubble, prompt) => {
            bubble.querySelector('[data-search-result-target]')!.textContent = 'Preview';
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('data-thread-find-skip', 'true');
            button.setAttribute('data-markdown-copy', 'exclude');
            button.textContent = 'Show more';
            button.onclick = () => {
              const open = button.getAttribute('aria-expanded') === 'false';
              button.setAttribute('aria-expanded', String(open));
              bubble.querySelector('[data-search-result-target]')!.textContent = open ? prompt : 'Preview';
              if (open) document.querySelector('main')!.insertAdjacentHTML('beforeend', '<div data-turn-key="racing"><div data-user-message-bubble>Competing</div></div>');
            };
            bubble.append(button);
          }, prompt);
        }
        let resendCalls = 0;
        worker.sendAttachedPrompt = async () => { resendCalls++; throw new Error("Reconcile must not resubmit"); };
        const result = worker.reconcileAssistantTurnBinding(page, baseline, binding);
        if (scenario === "history" || scenario === "history-users-only" || scenario === "accepted-rekey") expect((await result).identity).toBe("group:assistant:persisted");
        else if (scenario === "user-first") {
          expect(await result).toBe(binding);
          await page.locator('[data-turn-key="persisted"]').evaluate(node => node.insertAdjacentHTML('beforeend', '<div data-conversation-role="assistant">Done</div>'));
          expect((await worker.reconcileAssistantTurnBinding(page, baseline, binding)).identity).toBe("group:assistant:persisted");
        } else if (scenario === "duplicate-own") {
          expect(await result).toBe(binding);
        } else {
          const error = await result.catch((error: Error) => error);
          expect(error).toBeInstanceOf(Error);
          expect(error.bindingEvidence).toMatchObject({ ownerFound: true, tokenMode: true, laterUserCount: 1 });
          // Exercise the actual disk diagnostic path with a synthetic offline page.
          const root = join(process.cwd(), ".maintenance-reports");
          mkdirSync(root, { recursive: true });
          const directory = mkdtempSync(join(root, "binding-diagnostic-"));
          try {
            const diagnostics = new ChatGptBrowserDiagnostics("binding-fixture", directory, "Fixture");
            await diagnostics.capture(page, "turn-failed", error);
            const trace = join(directory, readdirSync(directory).find(name => name.startsWith("binding-fixture-"))!);
            const json = JSON.parse(readFileSync(join(trace, "01-turn-failed.json"), "utf8"));
            expect(json.bindingEvidence).toEqual(error.bindingEvidence);
          } finally { rmSync(directory, { recursive: true, force: true }); }
          const serialized = JSON.stringify(error.bindingEvidence);
          for (const secret of [token, prompt, "unseen-old", "persisted", "competitor"]) expect(serialized).not.toContain(secret);
        }
        expect(resendCalls).toBe(0);
        expect(await page.locator('#composer').innerText()).toBe("Draft");
      } finally { await closeTestContexts(); }
    }, 20_000);
}

// 2026-11-08, #948: scrolling a real retained ChatGPT conversation removed whole
// data-turn-key groups. Returning to them reported three new user turns without Send.
test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("scrolling previously observed history cannot acknowledge Send after helper replacement", async () => {
  try {
    const page = await browser.newPage();
    const group = (id: string, text = id) => `<div data-turn-key="${id}"><div data-user-message-bubble><div data-search-result-target>${text}</div></div><div data-conversation-role="assistant">Answer</div></div>`;
    const old = ["old-top", "old-middle", "old-bottom"].map(id => group(id)).join("");
    await page.setContent(`<main>${old}</main>`);
    const first = Object.create(ChatGptBrowserWorker.prototype) as any;
    await first.submissionDomState(page);
    // The old groups were observed by a previous helper, then scrolled out of the DOM.
    await page.locator("main").evaluate(node => { node.replaceChildren(); });
    const second = Object.create(ChatGptBrowserWorker.prototype) as any;
    const baseline = await second.captureSubmissionBaseline(page, "Next request");
    await page.locator("main").evaluate((node, html) => { node.innerHTML = html; }, old);
    expect(await second.currentSubmissionEvidence(page, baseline)).toBeUndefined();
    // The same unchanged observation must also work through the DOM cache.
    expect(await second.currentSubmissionEvidence(page, baseline)).toBeUndefined();

    await page.locator("main").evaluate((node, html) => node.insertAdjacentHTML("beforeend", html), group("new-request", "Next request"));
    // Only the exact submitted text, as the last user, proves ownership without a token.
    expect(await second.currentSubmissionEvidence(page, baseline)).toBe("user_turn");
    expect(baseline.acceptedUserIdentity).toBe("group:user:new-request");
    const binding = await second.waitForNewAssistantTurn(page, baseline, Date.now() + 2000);
    expect(binding.identity).toBe("group:assistant:new-request");
    // Observing a competing post-baseline turn must never add it to that baseline.
    await page.locator("main").evaluate((node, html) => node.insertAdjacentHTML("beforeend", html), group("competing-request"));
    // Bun's `.rejects` drains the loop synchronously and starves Playwright round trips; catch instead.
    const competing = await second.currentSubmissionEvidence(page, baseline).catch((error: Error) => error);
    expect(competing).toBeInstanceOf(Error);
    expect((competing as Error).message).toContain("another user turn");
    expect(baseline.acceptedUserIdentity).toBe("group:user:new-request");

    await page.goto("about:blank");
    await page.setContent("<main></main>");
    const fresh = await second.captureSubmissionBaseline(page, "Next request");
    await page.locator("main").evaluate((node, html) => { node.innerHTML = html; }, old);
    // Remounted history carries no proof for this Send: wait, never acknowledge or abort.
    expect(await second.currentSubmissionEvidence(page, fresh)).toBeUndefined();
    expect(fresh.acceptedUserIdentity).toBeUndefined();
  } finally { await closeTestContexts(); }
}, 15_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("CodeMirror language invalidates the response cache and incomplete code is not delivered", async () => {
  try {
    const page = await browser.newPage();
    await page.setContent(readFileSync(new URL("./fixtures/chatgpt-codemirror-reply-2026-10-11.html", import.meta.url), "utf8"));
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const cache = {};
    const observe = () => worker.responseDomSnapshot(page.locator("#turn"), cache);
    expect(chatGptHtmlToMarkdown((await observe()).fullHtml)).toContain("```python\nprint(1)\n```");
    await page.locator(".cm-content").evaluate(editor => editor.setAttribute("data-language", "text"));
    expect(chatGptHtmlToMarkdown((await observe()).fullHtml)).toContain("```text\nprint(1)\n```");
    await page.locator(".cm-content").evaluate(editor => {
      const gap = document.createElement("div");
      gap.style.height = "200px";
      editor.appendChild(gap);
    });
    await expect(observe()).rejects.toThrow("one complete set of code lines");
  } finally { await closeTestContexts(); }
});

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("paragraph identity survives file preview movement in both response layouts", async () => {
  try {
    for (const root of ['class="markdown"', 'data-markdown-text-style="assistant-message"']) {
      const page = await browser.newPage();
      await page.setContent(`<section id="turn"><div data-content-search-unit-key="answer">
        <h4 data-conversation-role="assistant"></h4><div id="answer" ${root}>
        <p>Report saved:</p><p id="file">report.md</p><p id="tail">Done.</p>
      </div></div><button aria-label="Copy"></button></section>`);
      const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
      const cache = {};
      const observe = () => worker.responseDomSnapshot(page.locator("#turn"), cache);
      const before = await observe();
      const buffer = new ChatGptMarkdownBuffer(undefined, 0);
      expect(buffer.observe(before.markdownSegments, 0)).toBe("Report saved:\n\nreport.md");
      await page.locator("#file").evaluate(file => { file.parentElement!.parentElement!.appendChild(file); });
      const moved = await observe();
      expect(moved.markdownSegments.at(-1).key).toBe(before.markdownSegments.at(-1).key);
      expect(buffer.observe(moved.markdownSegments, 1)).toBe("");
      await page.locator("#answer").evaluate(answer => { answer.innerHTML = answer.innerHTML; });
      buffer.observe((await observe()).markdownSegments, 2);
      expect(buffer.finish().markdown).toBe("Report saved:\n\nreport.md\n\nDone.");
      await page.locator("#tail").evaluate(tail => { tail.textContent = "A changed answer."; });
      buffer.observe((await observe()).markdownSegments, 3);
      expect(() => buffer.finish()).toThrow();
      await page.close();
    }
  } finally { await closeTestContexts(); }
}, 15_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("activity tone and collapsed content invalidate the response cache", async () => {
  try {
    const page = await browser.newPage();
    await page.setContent(readFileSync(new URL("./fixtures/chatgpt-activity-summaries.html", import.meta.url), "utf8"));
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const cache = {};
    const turn = page.locator("#turn");
    const observe = () => worker.responseDomSnapshot(turn, cache);
    const first = await observe();
    expect(first.traceBlocks.filter((block: any) => block.kind === "status")).toHaveLength(10);
    expect((await observe()).traceBlocks).toEqual(first.traceBlocks);
    const summary = page.locator('[data-markdown-text-style="assistant-message"]')
      .filter({ has: page.getByText("status 1", { exact: true }) });
    await summary.evaluate(node => node.setAttribute("data-markdown-text-tone", "primary"));
    expect((await observe()).traceBlocks.find((block: any) => block.text === "status 1")?.kind).toBe("commentary");
    await summary.evaluate(node => node.setAttribute("data-markdown-text-tone", "tertiary"));
    expect((await observe()).traceBlocks.find((block: any) => block.text === "status 1")?.kind).toBe("status");
    await summary.evaluate(node => { node.parentElement!.hidden = true; });
    const collapsed = await observe();
    expect(collapsed.traceBlocks.some((block: any) => block.kind === "status" || block.kind === "commentary")).toBeFalse();
    expect(collapsed.visibleText).toBe("answer 1");
    await summary.evaluate(node => { node.parentElement!.hidden = false; });
    expect((await observe()).traceBlocks).toEqual(first.traceBlocks);
  } finally { await closeTestContexts(); }
}, 15_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("preserves the accepted user identity across Activity's temporary fallback group", async () => {
  try {
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const prompt = "Read first.txt.\nReturn its contents.";
    worker.config = { appName: "Codex Native" };
    // Captured on the installed launcher: the user group appears at Send, disappears
    // during Activity, then returns with the same ID and a rich-text user bubble.
    const user = '<div data-user-message-bubble><div data-search-result-target><p><span data-prompt-link-href="app://test">Codex Native</span> Read first.txt.<br>Return its contents.</p></div></div>';
    const answer = '<div data-content-search-unit-key="fallback-turn-0:2:assistant"><div data-conversation-role="assistant"></div><div data-markdown-text-style="assistant-message"><p>FIRST fixture-marker</p></div></div><div class="turn-action-controls"><button>Copy</button></div>';
    for (const scenario of ["same-user", "different-user", "competing-turn", "old-group-remains", "unfinished", "streaming"] as const) {
      const page = await browser.newPage();
      await page.setContent('<main></main>');
      const baseline = await worker.captureSubmissionBaseline(page, prompt);
      await page.locator("main").evaluate((node, html) => { node.innerHTML = html; }, `<div data-turn-key="submitted">${user}</div>`);
      expect(await worker.currentSubmissionEvidence(page, baseline)).toBe("user_turn");
      await page.locator("main").evaluate(node => { node.innerHTML = '<div data-turn-key="fallback-turn-0"><span hidden data-chatgpt-agent-turn-start></span></div>'; });
      // First binding never takes an owner-less shell; the detached binding starts from it.
      const binding = shellBinding(page, "fallback-turn-0");
      const key = scenario === "different-user" ? "unrelated" : "submitted";
      const renderedUser = scenario === "different-user"
        ? `<div data-user-message-bubble><div data-search-result-target style="white-space:pre-wrap">${prompt}</div></div>`
        : user;
      const response = scenario === "unfinished" ? '<span hidden data-chatgpt-agent-turn-start></span>'
        : scenario === "streaming" ? answer.replace('<div class="turn-action-controls"><button>Copy</button></div>', "") : answer;
      let replacement = `<div data-turn-key="${key}">${renderedUser}${response}</div>`;
      if (scenario === "competing-turn") replacement += `<div data-turn-key="other">${user}</div>`;
      if (scenario === "old-group-remains") replacement += '<div data-turn-key="fallback-turn-0"></div>';
      await page.locator("main").evaluate((node, html) => { node.innerHTML = html; }, replacement);
      const result = worker.reconcileAssistantTurnBinding(page, baseline, binding);
      if (["same-user", "different-user", "old-group-remains", "unfinished", "streaming"].includes(scenario)) {
        expect((await result).identity).toBe(`group:assistant:${key}`);
      } else {
        await expect(result).rejects.toThrow("another user turn");
      }
      await page.close();
    }
  } finally { await closeTestContexts(); }
}, 15_000);

// Execute the real observation/rebinding code against the reported renderer transition.
// No account, network requests, or model submissions are used.
for (const scenario of ["matching", "history", "foreign", "prefix-only", "changed-spaces", "changed-edges", "two-turns", "old-group-remains", "unfinished", "user-first", "no-prompt", "same-key"] as const) {
test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)(`an exchange rekeys only with the exact submitted prompt and no competing turn: ${scenario}`, async () => {
  try {
    const worker = Object.create(ChatGptBrowserWorker.prototype) as {
      captureSubmissionBaseline(page: Page, submittedText?: string, stages?: unknown[], token?: string): Promise<unknown>;
      waitForNewAssistantTurn(page: Page, baseline: unknown, deadline: number): Promise<Binding>;
      reconcileAssistantTurnBinding(page: Page, baseline: unknown, binding: Binding): Promise<Binding>;
    };
    type Binding = { identity: string; locator: Locator };
    const token = "turn_0123456789abcdef0123456789abcdef";
    const prompt = "Explain one thing.\nKeep  two spaces." + (scenario === "matching" || scenario === "history" || scenario === "user-first" ? "\n" + token : "");
    const group = (key: string, text?: string, complete = false) => `<div data-turn-key="${key}">
      ${text === undefined ? "" : `<div data-user-message-bubble><div data-search-result-target style="white-space:pre-wrap">${text}</div><span aria-hidden="true">\u200b</span><button>Show more</button></div>`}
      <div data-content-search-unit-key="${key}:assistant"><div data-conversation-role="assistant"></div>
      <div data-markdown-text-style="assistant-message"><p>Answer.</p></div></div>
      ${complete ? '<div class="turn-action-controls"><button>Copy</button></div>' : ""}</div>`;
      const page = await browser.newPage();
      const history = scenario === "history" ? group("earlier", "Earlier request", true) : "";
      await page.setContent(`<main>${history}</main>`);
      const baseline = await worker.captureSubmissionBaseline(page, scenario === "no-prompt" ? undefined : prompt, [], prompt.includes(token) ? token : undefined);
      await page.locator("main").evaluate((node, html) => { node.innerHTML = html; }, history + group("optimistic"));
      const binding = shellBinding(page, "optimistic");
      const text = scenario === "foreign" ? "Different task."
        : scenario === "prefix-only" ? prompt + " Another request."
        : scenario === "changed-spaces" ? prompt.replace("  ", " ")
        : scenario === "changed-edges" ? " " + prompt : prompt;
      let html = history + group(scenario === "same-key" ? "optimistic" : "persisted", text, scenario !== "unfinished");
      if (scenario === "two-turns") html += group("foreign", prompt, true);
      if (scenario === "old-group-remains") html += '<div data-turn-key="optimistic"><div data-user-message-bubble>Earlier</div></div>';
      if (scenario === "user-first") {
        // The confirmed user bubble can remount before its assistant node.
        await page.locator("main").evaluate((node, submitted) => {
          node.innerHTML = '<div data-turn-key="persisted"><div data-user-message-bubble><div data-search-result-target></div></div></div>';
          node.querySelector("[data-search-result-target]")!.textContent = submitted;
        }, prompt);
        expect(await worker.reconcileAssistantTurnBinding(page, baseline, binding)).toBe(binding);
      }
      await page.locator("main").evaluate((node, next) => { node.innerHTML = next; }, html);
      const result = worker.reconcileAssistantTurnBinding(page, baseline, binding);
      if (scenario === "matching" || scenario === "history" || scenario === "same-key" || scenario === "user-first" || scenario === "unfinished") {
        const rebound = await result;
        expect(rebound.identity).toBe(`group:assistant:${scenario === "same-key" ? "optimistic" : "persisted"}`);
        expect(await rebound.locator.count()).toBe(1);
      } else if (["foreign", "prefix-only", "changed-spaces", "changed-edges", "old-group-remains", "two-turns", "no-prompt"].includes(scenario)) {
        expect(await result).toBe(binding);
      } else {
        await expect(result).rejects.toThrow();
      }
      await page.close();
  } finally { await closeTestContexts(); }
}, 45_000);
}

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("collapsed plugin messages rebind only after their complete text is verified", async () => {
  try {
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    worker.config = { appName: "Clew review" };
    const prompt = "Verify the entire message.\n\n" + "alpha  beta\n".repeat(1_000) + "END_MARKER";
    // Structure captured in the DEV launcher on 2026-10-15. The user content is
    // removed from the DOM when collapsed; the plugin and blank-line spans are real.
    const render = (value: string) => '<div data-markdown-text-tone="user-message" class="rich-text-user-turn">'
      + value.split("\n\n").map((paragraph, i) => (i ? '<span data-markdown-copy="blank-lines">\n</span>' : "")
        + '<p>' + (i ? "" : '<a href="/plugins/fixture"><span data-prompt-link-href="app://fixture">Clew review</span></a>  ')
        + paragraph.split("\n").map(line => `<span>${line}</span>`).join("<br>") + '</p>').join("") + '</div>';
    for (const scenario of ["complete", "different-tail", "changed-spaces", "wrong-plugin", "still-truncated", "competing-turn"] as const) {
      const page = await browser.newPage();
      await page.setContent('<main></main>');
      const baseline = await worker.captureSubmissionBaseline(page, prompt);
      await page.locator('main').evaluate(e => { e.innerHTML = '<div data-turn-key="optimistic"><span hidden data-chatgpt-agent-turn-start></span></div>'; });
      const binding = shellBinding(page, "optimistic");
      const collapsed = render(prompt.slice(0, 10_000));
      await page.locator('main').evaluate((e, html) => { e.innerHTML = html; }, `<div data-turn-key="persisted">
        <div data-user-message-bubble><div data-search-result-target>${collapsed}</div>
        <button type="button" aria-expanded="false" data-thread-find-skip="true" data-markdown-copy="exclude">Показать ещё</button></div>
        <div data-conversation-role="assistant"></div><div data-markdown-text-style="assistant-message">Complete answer</div></div>`);
      let expanded = render(scenario === "different-tail" ? prompt.replace("END_MARKER", "OTHER_TASK")
        : scenario === "changed-spaces" ? prompt.replace("alpha  beta", "alpha beta")
        : scenario === "still-truncated" ? prompt.slice(0, 10_000) : prompt);
      if (scenario === "wrong-plugin") expanded = expanded.replace("Clew review", "Other plugin");
      await page.locator('button').evaluate((button, { html, competing }) => {
        button.addEventListener('click', () => {
          if (button.getAttribute('aria-expanded') === 'true') {
            button.setAttribute('aria-expanded', 'false');
            return;
          }
          button.setAttribute('aria-expanded', 'true');
          button.parentElement!.querySelector('[data-search-result-target]')!.innerHTML = html;
          if (competing) document.querySelector('main')!.insertAdjacentHTML('beforeend', '<div data-turn-key="other"><div data-user-message-bubble>Another task</div></div>');
        });
      }, { html: expanded, competing: scenario === "competing-turn" });
      // Text rendering and ownership are separate proofs. An acknowledged key
      // permits binding; an unacknowledged text-only answer is now ambiguous.
      expect(await matchesSubmission(worker, page.locator('[data-turn-key="persisted"]'), prompt))
        .toBe(scenario === "complete" || scenario === "competing-turn");
      if (scenario === "complete") baseline.acceptedUserIdentity = "group:user:persisted";
      const result = await worker.reconcileAssistantTurnBinding(page, baseline, binding)
        .then((value: unknown) => ({ value }), (error: Error) => ({ error }));
      if (scenario === "complete") expect(result.value).toMatchObject({ identity: "group:assistant:persisted" });
      else expect(result.value).toBe(binding);
      await page.close();
    }
  } finally { await closeTestContexts(); }
}, 20_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("auto-linked URLs preserve exact prompt text and reject changed labels or destinations", async () => {
  try {
    const page = await browser.newPage();
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const url = "https://example.com/report?q=one&lang=en";
    const prompt = `Keep  spaces\n${url}\nEnd.`;
    for (const scenario of ["exact", "changed-label", "changed-destination", "extra-content"]) {
      await page.setContent('<div id="group"><div data-user-message-bubble><div data-search-result-target></div></div></div>');
      await page.locator('[data-search-result-target]').evaluate((node, { url, scenario }) => {
        node.append("Keep  spaces\n");
        const link = document.createElement("a");
        link.href = scenario === "changed-destination" ? "https://example.org/other" : url;
        link.setAttribute("data-search-result-target", "");
        link.textContent = scenario === "changed-label" ? "report" : url;
        node.append(link, scenario === "extra-content" ? " extra\nEnd." : "\nEnd.");
      }, { url, scenario });
      expect(await matchesSubmission(worker, page.locator('#group'), prompt)).toBe(scenario === "exact");
    }
  } finally { await closeTestContexts(); }
});

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("reading a collapsed message restores the viewport and remounts its virtualized active answer", async () => {
  try {
    const page = await browser.newPage();
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const text = "Large history\n".repeat(2000);
    await page.setContent('<div id="scroll" style="height:300px;overflow:auto"><div id="group"><div data-user-message-bubble>'
      + '<div data-search-result-target style="white-space:pre-wrap">Preview</div>'
      + '<button type="button" aria-expanded="false" data-thread-find-skip="true" data-markdown-copy="exclude">Show more</button>'
      + '</div></div><div style="height:1000px"></div><div id="answer">Active answer</div></div><input id="composer">');
    await page.locator('button').evaluate((button, text) => {
      const answer = document.querySelector('#answer')!;
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        button.parentElement!.querySelector('[data-search-result-target]')!.textContent = open ? text : "Preview";
        if (open) answer.remove(); else document.querySelector('#scroll')!.append(answer);
      });
    }, text);
    await page.locator('#composer').focus();
    await page.locator('#scroll').evaluate(node => { node.scrollTop = node.scrollHeight; });
    expect(await matchesSubmission(worker, page.locator('#group'), text)).toBeTrue();
    expect(await page.locator('button').getAttribute('aria-expanded')).toBe('false');
    expect(await page.locator('#answer').count()).toBe(1);
    expect(await page.locator('#scroll').evaluate(node => node.scrollHeight - node.clientHeight - node.scrollTop)).toBeLessThanOrEqual(1);
    expect(await page.locator('#composer').evaluate(node => document.activeElement === node)).toBeTrue();
  } finally { await closeTestContexts(); }
});

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("plain user code blocks preserve the full submitted code and whitespace", async () => {
  try {
    const page = await browser.newPage();
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const prompt = 'Literal header\n\n```json\n{"value":"a  b"}\n```\n\n\tEnd.';
    // Captured plain user-message renderer: only fenced code becomes an HTML block.
    await page.setContent('<div id="group"><div data-user-message-bubble><div data-search-result-target>'
      + 'Literal header\n\n<pre data-markdown-copy="code-block"><code data-markdown-copy-content="true" data-language="json">{"value":"a  b"}</code></pre>\n\n\tEnd.</div></div></div>');
    expect(await matchesSubmission(worker, page.locator('#group'), prompt)).toBeTrue();
    expect(await matchesSubmission(worker, page.locator('#group'), prompt.replace('a  b', 'a b'))).toBeFalse();
  } finally { await closeTestContexts(); }
});

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("rich-text rebind requires the exact prepared turn token after expansion", async () => {
  try {
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const token = "turn_0123456789abcdef0123456789abcdef";
    const foreign = "turn_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const prompt = 'Task JSON with links.\nPass turn_token ' + token;
    for (const scenario of ["matching", "foreign", "missing", "duplicate", "token-prefix", "competing-turn"] as const) {
      const page = await browser.newPage();
      await page.setContent('<main></main>');
      const baseline = await worker.captureSubmissionBaseline(page, prompt, [], token);
      await page.locator('main').evaluate(e => { e.innerHTML = '<div data-turn-key="pending"><span hidden data-chatgpt-agent-turn-start></span></div>'; });
      const binding = shellBinding(page);
      await page.locator('main').evaluate(e => { e.innerHTML = '<div data-turn-key="persisted"><div data-user-message-bubble>'
        + '<div data-search-result-target><a data-search-result-target href="https://example.com">Altered JSON/link label</a></div>'
        + '<button type="button" aria-expanded="false" data-thread-find-skip="true" data-markdown-copy="exclude">Afficher plus</button></div>'
        + '<span hidden data-chatgpt-agent-turn-start></span></div>'; });
      const displayed = scenario === "foreign" ? foreign : scenario === "missing" ? ""
        : scenario === "duplicate" ? `${token} ${token}` : scenario === "token-prefix" ? `${token}extra` : token;
      await page.locator('button').evaluate((button, { displayed, competing }) => {
        button.addEventListener('click', () => {
          if (button.getAttribute('aria-expanded') === 'true') {
            button.setAttribute('aria-expanded', 'false');
            return;
          }
          button.setAttribute('aria-expanded', 'true');
          button.parentElement!.querySelector('[data-search-result-target]')!.append(' Pass turn_token ' + displayed);
          if (competing) document.querySelector('main')!.insertAdjacentHTML('beforeend', '<div data-turn-key="other"><div data-user-message-bubble>Other task</div></div>');
        });
      }, { displayed, competing: scenario === "competing-turn" });
      const result = await worker.reconcileAssistantTurnBinding(page, baseline, binding)
        .then((value: unknown) => ({ value }), (error: Error) => ({ error }));
      if (scenario === "matching") expect(result.value).toMatchObject({ identity: "group:assistant:persisted" });
      else if (scenario === "competing-turn") expect(result.error).toBeInstanceOf(Error);
      else expect(result.value).toBe(binding);
      const invalid = await worker.captureSubmissionBaseline(page, "No broker token here", [], token)
        .then(() => undefined, (error: Error) => error);
      expect(invalid).toBeInstanceOf(Error);
      await page.close();
    }
  } finally { await closeTestContexts(); }
}, 20_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("rebind reads token boundaries across rendered lines without accepting hidden or ambiguous tokens", async () => {
  try {
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const token = "turn_0123456789abcdef0123456789abcdef";
    const foreign = "turn_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    for (const [name, html, accepted] of [
      ["line-after", `${token}<br>Continue`, true],
      ["line-before", `Identity<br>${token}`, true],
      ["paragraphs", `<p>Identity</p><p>${token}</p><p>Continue</p>`, true],
      ["inline-format", `<b>${token.slice(0, 10)}</b>${token.slice(10)}`, true],
      ["inline-suffix", `${token}<span>extra</span>`, false],
      ["inline-prefix", `<span>extra</span>${token}`, false],
      ["foreign", foreign, false],
      ["two-visible", `${token}<br>${foreign}`, false],
      ["duplicate", `${token}<br>${token}`, false],
      ["hidden-duplicate", `${token}<span hidden>${token}</span>`, false],
      ["hidden-foreign", `${token}<span hidden>${foreign}<br>Continue</span>`, false],
      ["hidden-only", `<span hidden>${token}</span>`, false],
      ["transparent-only", `<span style="opacity:0">${token}</span>`, false],
      ["partly-hidden", `${token.slice(0, 10)}<span style="opacity:0">${token.slice(10)}</span>`, false],
    ] as const) {
      const page = await browser.newPage();
      await page.setContent("<main></main>");
      const baseline = await worker.captureSubmissionBaseline(page, `Identity\n${token}\nContinue`, [], token);
      await page.locator("main").evaluate(node => { node.innerHTML = '<div data-turn-key="pending"><span hidden data-chatgpt-agent-turn-start></span></div>'; });
      const binding = shellBinding(page);
      await page.locator("main").evaluate((node, body) => {
        node.innerHTML = '<div data-turn-key="persisted"><div data-user-message-bubble><div data-search-result-target>'
          + body + '</div></div><span hidden data-chatgpt-agent-turn-start></span></div>';
      }, html);
      const group = page.locator('[data-turn-key="persisted"]');
      expect(await matchesSubmission(worker, group, baseline.submittedText, undefined, token), name).toBe(accepted);
      if (accepted) expect((await worker.reconcileAssistantTurnBinding(page, baseline, binding)).identity, name)
        .toBe("group:assistant:persisted");
      await page.close();
    }
  } finally { await closeTestContexts(); }
}, 20_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("binds captured Activity before an answer exists and recognizes uploaded native-button tiles", async () => {
  const server = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: request => new URL(request.url).pathname === "/backend-api/files/process_upload_stream"
    ? new Response(JSON.stringify({ event: "file.processing.completed", file_id: "fixture-file" }) + "\n", { headers: { "content-type": "application/x-ndjson" } })
    : new Response("<main></main>", { headers: { "content-type": "text/html" } }) });
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.port}`);
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    await page.setContent('<main></main>');
    const baseline = await worker.captureSubmissionBaseline(page, "Prompt");
    const html = readFileSync(new URL("./fixtures/chatgpt-power-activity.html", import.meta.url), "utf8");
    // The anonymized capture has no message target; ownership needs the exact submitted text.
    await page.locator("main").evaluate((node, content) => {
      node.innerHTML = content;
      node.querySelector("[data-user-message-bubble]")!.innerHTML = "<div data-search-result-target>Prompt</div>";
    }, html);
    const binding = await worker.waitForNewAssistantTurn(page, baseline, Date.now() + 2000);
    expect(binding.identity).toBe("group:assistant:activity");
    expect((await worker.responseDomSnapshot(binding.locator)).traceBlocks.some((block: { kind: string }) => block.kind === "commentary")).toBeTrue();
    for (const tile of ['button', 'div role="button"']) {
      await page.setContent(`<form data-chatgpt-composer><div data-composer-markdown contenteditable="true" role="textbox" style="height:40px">Prompt</div>
        <input type="file" multiple><${tile} class="composer-attachment-surface" aria-label="codex-input-image-1.png">File</${tile.split(' ')[0]}>
        <button type="submit">Send</button></form>`);
      await page.locator('input[type="file"]').evaluate(input => {
        input.addEventListener("change", () => void fetch("/backend-api/files/process_upload_stream", {
          method: "POST", body: JSON.stringify({ file_name: "codex-input-image-1.png", file_id: "fixture-file" }),
        }));
      });
      await worker.attachFiles(page, { images: [{ ref: "codex-input-image-1", imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" }] });
      expect(await page.locator('input[type="file"]').evaluate(input => (input as HTMLInputElement).files?.[0]?.name)).toBe("codex-input-image-1.png");
    }
  } finally {
    try { await closeTestContexts(); } finally { server.stop(true); }
  }
}, 15_000);
