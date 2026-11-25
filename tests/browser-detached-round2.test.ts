import { afterAll, beforeAll, expect, test } from "bun:test";
import { chromium, type Browser } from "playwright-core";
import { ChatGptBrowserWorker, ChatGptBrowserObservationTimeoutError } from "../src/adapters/chatgpt-web/browser-worker";
import { matchesSubmission } from "./ownership-probe";

let browser: Browser;
beforeAll(async () => {
  if (process.env.CHATGPT_DOM_TEST_BROWSER) browser = await chromium.launch({ executablePath: process.env.CHATGPT_DOM_TEST_BROWSER, headless: true });
}, 15_000);
afterAll(async () => { if (browser) await browser.close(); }, 15_000);
const token = "turn_0123456789abcdef0123456789abcdef";
const group = (id: string, text: string, complete = false) => `<div data-turn-key="${id}"><div data-user-message-bubble><div data-search-result-target style="white-space:pre-wrap">${text}</div></div><div data-conversation-role="assistant">${id} answer</div>${complete ? '<div class="turn-action-controls"><button>Copy</button></div>' : ''}</div>`;

for (const scenario of ["accepted-no-token", "owner-absent", "assistant-only-history", "before-owner", "identical-old", "identical-old-unmarked", "history-during-proof", "bounded-history", "timeout-cleanup"] as const) {
  test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)(`detached turn, history and recovery: ${scenario}`, async () => {
    const page = await browser.newPage();
    try {
      const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
      const textOnly = scenario === "accepted-no-token" || scenario === "identical-old" || scenario === "identical-old-unmarked";
      const prompt = textOnly ? "continue" : `Request ${token}`;
      await page.setContent(`<main>${scenario === "identical-old" ? group("original-old", prompt, true) : ''}</main><div id="draft" contenteditable="true">Unsent draft</div>`);
      const baseline = await worker.captureSubmissionBaseline(page, prompt, [], textOnly ? undefined : token);
      if (scenario === "accepted-no-token") baseline.acceptedUserIdentity = "group:user:ours";
      await page.locator('main').evaluate(node => { node.innerHTML = '<div data-turn-key="pending"><span hidden data-chatgpt-agent-turn-start></span></div>'; });
      // An owner-less shell group is never bound by first binding; start from a detached binding.
      const binding = { identity: "group:assistant:pending", locator: page.locator('[data-turn-key="pending"] [data-conversation-role="assistant"]') };
      let sends = 0;
      worker.sendAttachedPrompt = async () => { sends++; throw new Error("Unexpected resubmission"); };
      worker.activeComposer = async () => { throw new Error("Reconcile touched composer"); };
      let html = group("ours", prompt);
      if (textOnly && scenario !== "accepted-no-token") html = group("rekeyed-old", prompt, scenario !== "identical-old-unmarked");
      if (scenario === "owner-absent") html = group("history-only", "Earlier question", true);
      if (["assistant-only-history", "identical-old", "identical-old-unmarked", "owner-absent"].includes(scenario)) html = '<div data-turn-key="history-only"><div data-conversation-role="assistant">Old answer</div></div>';
      if (scenario === "before-owner") html = group("concurrent-before", "Other user's real message") + html;
      if (scenario === "bounded-history") html = Array.from({ length: 24 }, (_, i) => group(`old-${i}`, `Long history ${i}`)).join('') + html;
      await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, html);
      if (["bounded-history", "timeout-cleanup"].includes(scenario)) {
        await page.locator('[data-user-message-bubble]').evaluateAll((bubbles, { prompt }) => {
          (window as any).expansions = 0;
          (window as any).historyExpansions = 0;
          for (const bubble of bubbles) {
            const own = bubble.parentElement!.getAttribute('data-turn-key') === 'ours';
            const content = bubble.querySelector('[data-search-result-target]')!;
            content.textContent = 'Preview';
            const button = document.createElement('button');
            button.type = 'button'; button.setAttribute('aria-expanded', 'false');
            button.setAttribute('data-thread-find-skip', 'true'); button.setAttribute('data-markdown-copy', 'exclude');
            button.onclick = () => {
              const open = button.getAttribute('aria-expanded') === 'false';
              button.setAttribute('aria-expanded', String(open));
              if (open) {
                (window as any).expansions++;
                if (!own) { (window as any).historyExpansions++; window.scrollTo(0, 800); }
              }
              content.textContent = open ? (own ? prompt : 'Long unrelated history') : 'Preview';
            };
            bubble.append(button);
          }
        }, { prompt });
      }
      const before = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
      if (scenario === "timeout-cleanup") {
        worker.withExpandedUserMessage = async (locator: any, _read: unknown, signal: AbortSignal) => (ChatGptBrowserWorker.prototype as any).withExpandedUserMessage.call(worker, locator, async () => {
          throw new ChatGptBrowserObservationTimeoutError(1);
        }, signal);
      }
      const reconcile = () => worker.reconcileAssistantTurnBinding(page, baseline, binding);
      if (["assistant-only-history", "identical-old", "identical-old-unmarked", "owner-absent"].includes(scenario)) {
        expect(await reconcile()).toBe(binding);
      } else if (scenario === "timeout-cleanup") {
        const error = await reconcile().catch((error: Error) => error);
        expect(error).toBeInstanceOf(Error);
        if (scenario === "timeout-cleanup") {
          expect(error).toBeInstanceOf(ChatGptBrowserObservationTimeoutError);
          expect(await page.locator('button[aria-expanded]').getAttribute('aria-expanded')).toBe('false');
          // Recovery may replace the DOM only after the expansion has settled.
          await page.locator('main').evaluate(node => { node.innerHTML = '<p>Rebound page</p>'; });
          expect(await page.evaluate(() => (window as any).expansions)).toBe(1);
        }
      } else {
        const rebound = await reconcile();
        expect(rebound.identity).toBe("group:assistant:ours");
        expect(await rebound.locator.innerText()).toContain("ours answer");
        if (scenario === "bounded-history") {
          expect(await worker.reconcileAssistantTurnBinding(page, baseline, rebound)).toBe(rebound);
          expect(await page.evaluate(() => (window as any).expansions)).toBe(1);
          expect(await page.evaluate(() => (window as any).historyExpansions)).toBe(0);
        }
      }
      expect(await page.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual(before);
      expect(sends).toBe(0);
      expect(await page.locator('#draft').innerText()).toBe('Unsent draft');
    } finally { await page.context().close(); }
  }, 20_000);
}

for (const scenario of ["own-content-late", "own-token-late", "own-proof-incomplete", "accepted-anchor-history", "inferred-anchor-history", "rekeyed-anchor-history", "after-anchor-aborts", "identical-old-assistant-unmounted"] as const) {
  test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)(`detached turn, ownership evidence: ${scenario}`, async () => {
    const page = await browser.newPage();
    try {
      const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
      const textOnly = scenario === "identical-old-assistant-unmounted";
      const prompt = textOnly ? "continue" : `Request ${token}`;
      await page.setContent('<main></main>');
      const baseline = await worker.captureSubmissionBaseline(page, prompt, [], textOnly ? undefined : token);
      if (textOnly) baseline.initialTurnIdentities.push("group:user:ours", "group:assistant:ours");
      const anchor = scenario.includes("anchor");
      const binding = { identity: "group:assistant:pending", locator: page.locator('[data-turn-key="pending"] [data-conversation-role="assistant"]'),
 };
      if (anchor && scenario !== "inferred-anchor-history") baseline.acceptedUserIdentity = scenario === "rekeyed-anchor-history"
        ? "group:user:prior-key" : "group:user:ours";
      const ownUser = group("ours", prompt).replace(/<div data-conversation-role="assistant">.*?<\/div>/, '');
      let html = ownUser;
      if (scenario === "own-content-late") html = '<div data-turn-key="ours"><div data-user-message-bubble></div></div>';
      if (scenario === "own-token-late") html = ownUser.replace(prompt, "Rendering");
      if (scenario === "own-proof-incomplete") html = ownUser.replace('</div></div>', '</div><div data-search-result-target>Duplicate target</div></div>');
      if (anchor) html = group("history", "Earlier", true) + ownUser;
      if (scenario === "after-anchor-aborts") html += group("competitor", "Another user");
      await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, html);
      const reconcile = () => worker.reconcileAssistantTurnBinding(page, baseline, binding);
      if (scenario === "after-anchor-aborts") { await expect(reconcile()).rejects.toThrow(); return; }
      expect(await reconcile()).toBe(binding);
      if (textOnly) {
        expect(await reconcile()).toBe(binding);
        // An old assistant may return later; that still cannot establish freshness.
        await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, group("ours", prompt));
        expect(await reconcile()).toBe(binding);
        return;
      }
      await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, (anchor ? group("history", "Earlier", true) : '') + group("ours", prompt));
      expect((await reconcile()).identity).toBe("group:assistant:ours");
    } finally { await page.context().close(); }
  }, 20_000);
}

// Execute the production response-missing block, including its recovery catch.
// Extracting it avoids mocking the entire login/send flow or maintaining a copy
// of the caller that could silently diverge from production.
test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("detached turn: caller timeout cleanup never mutates a rebound page", async () => {
  const source = await Bun.file(new URL('../src/adapters/chatgpt-web/browser-worker.ts', import.meta.url)).text();
  const start = source.indexOf('        if (!snapshot.responsePresent) {', source.indexOf('      let consecutiveObservationRebinds = 0;'));
  const end = source.indexOf('        if (snapshot.stoppedThinkingVisible)', start);
  expect(start).toBeGreaterThan(0);
  expect(end).toBeGreaterThan(start);
  const code = new Bun.Transpiler({ loader: 'ts' }).transformSync(`async function caller() {
    for (;;) { ${source.slice(start, end)} break; }
  }`);
  const page = await browser.newPage();
  try {
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    await page.setContent('<main></main><div contenteditable="true">Draft</div>');
    const baseline = await worker.captureSubmissionBaseline(page, `Request ${token}`, [], token);
    await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, group('ours', 'Preview'));
    await page.locator('[data-user-message-bubble]').evaluate((bubble, prompt) => {
      const button = document.createElement('button');
      button.type = 'button'; button.setAttribute('aria-expanded', 'false');
      button.setAttribute('data-thread-find-skip', 'true'); button.setAttribute('data-markdown-copy', 'exclude');
      button.onclick = () => {
        const open = button.getAttribute('aria-expanded') === 'false';
        button.setAttribute('aria-expanded', String(open));
        bubble.querySelector('[data-search-result-target]')!.textContent = open ? prompt : 'Preview';
      };
      bubble.append(button);
    }, `Request ${token}`);
    const originalLocator = page.locator.bind(page);
    await page.locator('[contenteditable]').focus();
    const handle = await page.evaluateHandle(() => ({
      scroll: [], focus: document.activeElement, button: document.querySelector('button'),
    }));
    await page.locator('button').focus();
    let cleanupStarted = false;
    let release!: () => void;
    let lateCleanup!: Promise<unknown>;
    const view = {
      evaluate(fn: any, arg: any) {
        if (!String(fn).includes("preventScroll")) return handle.evaluate(fn, arg);
        cleanupStarted = true;
        lateCleanup = new Promise<void>(resolve => { release = resolve; }).then(() => handle.evaluate(fn, arg));
        return lateCleanup;
      },
      dispose: async () => {},
    };
    // Keep locator acquisition deterministic; mutations and the deferred cleanup
    // execute in Edge. The production helper and caller both run unchanged.
    const expand = { count: async () => 1, getAttribute: async () => 'false',
      locator: () => ({ waitFor: async () => {} }), evaluate: async () => {},
      press: async () => page.locator('button').click() };
    const bubble = { count: async () => 1, locator: (selector: string) => selector.startsWith('button')
      ? expand : { count: async () => 1 } };
    const fixtureGroup = { locator: () => bubble, evaluateHandle: async () => view };
    worker.reconcileAssistantTurnBinding = () => worker.withExpandedUserMessage(fixtureGroup, async () => {
      throw new ChatGptBrowserObservationTimeoutError(1);
    });
    let rebound = 0;
    const recoveryDone = new Error('RECOVERY_REACHED');
    const binding = { identity: 'group:assistant:pending', locator: originalLocator('[data-turn-key="pending"] [data-conversation-role="assistant"]') };
    const run = new Function('env', `with (env) { ${code}; return caller; }`)({
      snapshot: { responsePresent: false }, page, submissionBaseline: baseline, responseTurn: binding,
      turn: {}, responseDomCache: {}, launcherSurfaceId: 'fixture', consecutiveObservationRebinds: 0,
      ChatGptBrowserObservationTimeoutError, MAX_CHATGPT_BROWSER_PAGE_REBINDS: 2,
      // The base caller uses this outer race; keep its real timeout behavior.
      withChatGptBrowserObservationTimeout: async (promise: Promise<unknown>) => {
        let timer: ReturnType<typeof setTimeout>;
        try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new ChatGptBrowserObservationTimeoutError(5000)), 5000); })]); }
        finally { clearTimeout(timer!); }
      },
      withBrowserTurnAbort: (promise: Promise<unknown>) => promise,
      rebindLauncherPage: async () => { rebound++; throw recoveryDone; },
    });
    const started = Date.now();
    await expect(run.call(worker)).rejects.toBe(recoveryDone);
    expect(cleanupStarted).toBeTrue();
    expect(rebound).toBe(1);
    expect(Date.now() - started).toBeLessThan(12000);
    expect(await originalLocator('button[aria-expanded]').getAttribute('aria-expanded')).toBe('true');
    release();
    await lateCleanup;
    expect(await originalLocator('button[aria-expanded]').getAttribute('aria-expanded')).toBe('true');
    expect(await originalLocator('button').evaluate(node => document.activeElement === node)).toBeTrue();
    await handle.dispose();
  } finally { await page.context().close(); }
}, 15_000);


for (const scenario of ["previous-accepted-user", "history-with-late-token"] as const) {
  test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)(`detached turn, stale accepted state: ${scenario}`, async () => {
    const page = await browser.newPage();
    try {
      const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
      const prompt = `Request ${token}`;
      await page.setContent(`<main>${group("previous", "Old question", true)}</main>`);
      const baseline = await worker.captureSubmissionBaseline(page, prompt, [], token);
      baseline.acceptedUserIdentity = scenario === "previous-accepted-user" ? "group:user:ours" : undefined;
      const binding = { identity: "group:assistant:pending", locator: page.locator('[data-turn-key="pending"] [data-conversation-role="assistant"]') };
      const history = Array.from({ length: 5 }, (_, i) => group(`history-${i}`, `History ${i}`, true)).join('');
      if (scenario === "history-with-late-token") {
        await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, history + group("ours", "Rendering").replace(/<div data-conversation-role="assistant">.*?<\/div>/, ''));
      }
      // Neither the old accepted history nor a late token can establish ownership.
      expect(await worker.reconcileAssistantTurnBinding(page, baseline, binding)).toBe(binding);
      await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, history + group("ours", prompt));
      expect((await worker.reconcileAssistantTurnBinding(page, baseline, binding)).identity).toBe("group:assistant:ours");
    } finally { await page.context().close(); }
  }, 20_000);
}

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("detached turn: multipart acknowledgement tolerates slow evidence reads without a new cap", async () => {
  const page = await browser.newPage();
  try {
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    const prompt = `Request ${token}`;
    await page.setContent('<main></main>');
    const baseline = await worker.captureSubmissionBaseline(page, prompt, [{ text: 'Earlier stage', acknowledgement: 'Earlier ack', identities: ['group:assistant:stage'] }], token);
    baseline.acceptedUserIdentity = 'group:user:ours';
    const binding = { identity: 'group:assistant:pending', locator: page.locator('[data-turn-key="pending"] [data-conversation-role="assistant"]') };
    await page.locator('main').evaluate((node, html) => { node.innerHTML = html; }, (Array.from({ length: 3 }, (_, i) => group(`history-${i}`, `Old ${i}`, true)).join('') + group('ours', prompt)).replace(/(<div data-conversation-role="assistant">)([^<]*)(<\/div>)/g, '<div data-content-search-unit-key="answer">$1<div class="markdown">$2</div>$3</div>'));
    await page.locator('[data-turn-key="ours"] [data-user-message-bubble]').evaluate((bubble, prompt) => {
      const content = bubble.querySelector('[data-search-result-target]')!;
      content.textContent = "Preview";
      const button = document.createElement('button');
      button.type = 'button'; button.setAttribute('aria-expanded', 'false');
      button.setAttribute('data-thread-find-skip', 'true'); button.setAttribute('data-markdown-copy', 'exclude');
      button.onclick = () => {
        const open = button.getAttribute('aria-expanded') === 'false';
        button.setAttribute('aria-expanded', String(open));
        content.textContent = open ? prompt : 'Preview';
      };
      bubble.append(button);
    }, prompt);
    const read = worker.bindingObservation.bind(worker);
    worker.bindingObservation = async (...args: any[]) => {
      await new Promise(resolve => setTimeout(resolve, 1900));
      return read(...args);
    };
    const started = Date.now();
    const result = await worker.waitForMultipartAcknowledgement(page, binding, baseline, { acknowledgement: 'ours answer' }, Date.now() + 20_000,
      undefined, undefined, { update: ({ responsePresent }: any) => responsePresent });
    expect(result.identity).toBe('group:assistant:ours');
    expect(Date.now() - started).toBeGreaterThan(5000);
  } finally { await page.context().close(); }
}, 25_000);

for (const scenario of ["slow-successful-cleanup", "expired-successful-cleanup"] as const) {
test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)(`detached turn, cleanup: ${scenario}`, async () => {
  const page = await browser.newPage();
  try {
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    await page.setContent(`<main>${group('ours', `Request ${token}`)}</main>`);
    await page.locator('[data-user-message-bubble]').evaluate(bubble => {
      const button = document.createElement('button');
      button.type = 'button'; button.setAttribute('aria-expanded', 'false');
      button.setAttribute('data-thread-find-skip', 'true'); button.setAttribute('data-markdown-copy', 'exclude');
      button.onclick = () => button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') === 'false'));
      bubble.append(button);
    });
    const real = page.locator('[data-turn-key="ours"]');
    let cleanup: Promise<unknown> | undefined;
    let release!: () => void;
    let savedHandle: any;
    const fixture = { locator: real.locator.bind(real), evaluateHandle: async (fn: any) => {
      const handle = savedHandle = await real.evaluateHandle(fn);
      return { dispose: async () => {}, evaluate: (fn: any, arg: any) => {
        if (!String(fn).includes('preventScroll')) return handle.evaluate(fn, arg);
        const delay = scenario === "slow-successful-cleanup"
          ? new Promise(resolve => setTimeout(resolve, 1300))
          : new Promise<void>(resolve => { release = resolve; });
        cleanup = delay.then(() => handle.evaluate(fn, arg));
        void cleanup.catch(() => {});
        return cleanup;
      } };
    } };
    const result = await matchesSubmission(worker, fixture, `Request ${token}`, undefined, token).catch((error: Error) => error);
    // Resume abandoned cleanup on the same mounted nodes after its budget expires.
    if (release) release();
    await cleanup;
    expect(result).toBeTrue();
    expect(await page.locator('button').getAttribute('aria-expanded')).toBe(scenario === "slow-successful-cleanup" ? 'false' : 'true');
    await savedHandle.dispose();
  } finally { await page.context().close(); }
}, 15_000);
}

for (const textOnly of [false, true]) {
  test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)(`detached turn: remounted history never acknowledges, aborts or answers for our turn (${textOnly ? "text" : "token"})`, async () => {
    const page = await browser.newPage();
    try {
      const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
      const prompt = textOnly ? "continue" : `Request ${token}`;
      const set = (html: string) => page.locator("main").evaluate((node, html) => { node.innerHTML = html; }, html);
      await page.setContent("<main></main>");
      const baseline = await worker.captureSubmissionBaseline(page, prompt, [], textOnly ? undefined : token);
      // History mounted after Send but before our own turn. (Identical-text history absent from the
      // baseline is the documented token-less limit; identical text inside it is covered above.)
      const history = group("history", "Earlier question", true);
      await set(history);
      expect(await worker.currentSubmissionEvidence(page, baseline)).toBeUndefined();
      expect(baseline.acceptedUserIdentity).toBeUndefined();
      const pending = { identity: "group:assistant:pending", locator: page.locator('[data-turn-key="pending"] [data-conversation-role="assistant"]') };
      // Our turn is briefly unmounted while history and its answer are: wait, never bind history.
      expect(await worker.reconcileAssistantTurnBinding(page, baseline, pending)).toBe(pending);
      // Bun's `.rejects` drains the loop synchronously and starves Playwright round trips; catch instead.
      const waited = await worker.waitForNewAssistantTurn(page, baseline, Date.now() + 600).catch((error: Error) => error);
      expect(waited).toBeInstanceOf(Error);
      expect((waited as Error).message).toMatch(/timed out|did not expose/);
      await set(history + group("ours", prompt));
      expect(await worker.currentSubmissionEvidence(page, baseline)).toBe("user_turn");
      expect(baseline.acceptedUserIdentity).toBe("group:user:ours");
      expect((await worker.reconcileAssistantTurnBinding(page, baseline, pending)).identity).toBe("group:assistant:ours");
      await set(history + group("ours", prompt) + group("competitor", "Another user"));
      const aborted = await worker.reconcileAssistantTurnBinding(page, baseline, pending).catch((error: Error) => error);
      expect(aborted).toBeInstanceOf(Error);
      expect((aborted as Error).message).toContain("another user turn");
    } finally { await page.context().close(); }
  }, 20_000);
}
