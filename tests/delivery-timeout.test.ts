import { expect, test } from "bun:test";
import { chromium } from "playwright-core";
import { ChatGptBrowserWorker, ChatGptCompletionTracker, throwIfChatGptDeliveryTimeoutAlert, throwIfChatGptTerminalErrorAlert } from "../src/adapters/chatgpt-web/browser-worker";
import { chatGptAssistantTurnSelector, chatGptTurnContainerSelector } from "../src/chatgpt-session";

const deliveryError = "Message delivery timed out. Please try again.";

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("delivery timeout belongs to a visible service alert in the current response, without Stop", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHATGPT_DOM_TEST_BROWSER, headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(`<section data-turn-key="old"><aside role="alert">${deliveryError}</aside></section>
      <section data-turn-key="current"><div data-user-message-bubble>Prompt</div><div id="variant"></div></section>`);
    const current = page.locator(chatGptTurnContainerSelector("group:assistant:current"));
    for (const markup of [
      `<div class="markdown"><aside role="alert">${deliveryError}</aside></div>`,
      `<div data-user-message-bubble><aside role="alert">${deliveryError}</aside></div>`,
      `<div contenteditable="true"><aside role="alert">${deliveryError}</aside></div>`,
      `<div hidden><aside role="alert">${deliveryError}</aside></div>`,
      `<div aria-hidden="true"><aside role="alert">${deliveryError}</aside></div>`,
      `<div data-turn-key="foreign"><aside role="alert">${deliveryError}</aside></div>`,
      `<aside role="alert" style="visibility:hidden">${deliveryError}</aside>`,
      `<aside role="alert">The model said: ${deliveryError}</aside>`,
      `<aside role="alert">Network error in my application</aside>`,
      `<div>${deliveryError}</div>`,
    ]) {
      await page.locator('#variant').evaluate((element, html) => { element.innerHTML = html; }, markup);
      await expect(throwIfChatGptDeliveryTimeoutAlert(page, current)).resolves.toBeUndefined();
    }
    await page.locator('#variant').evaluate((element, text) => { element.innerHTML = `<aside role="alert">${text}</aside>`; }, deliveryError);
    // This exact service failure was invisible to the pre-existing terminal-error check.
    await expect(throwIfChatGptTerminalErrorAlert(current)).resolves.toBeUndefined();
    await page.locator('body').evaluate(element => element.insertAdjacentHTML('beforeend', '<button data-testid="stop-button">Stop</button>'));
    await expect(throwIfChatGptDeliveryTimeoutAlert(page, current)).resolves.toBeUndefined();
    await page.getByTestId('stop-button').evaluate(element => element.remove());
    await expect(throwIfChatGptDeliveryTimeoutAlert(page, current)).rejects.toMatchObject({
      code: "chatgpt_delivery_timeout", status: 503, retryable: true,
    });
    await page.locator('#variant').evaluate(element => element.remove());
    await expect(throwIfChatGptDeliveryTimeoutAlert(page, current)).resolves.toBeUndefined();
  } finally { await browser.close(); }
}, 20_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("a damaged staging acknowledgement fails exactly and permits restarting before the final commit", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHATGPT_DOM_TEST_BROWSER, headless: true });
  try {
    const expected = `CODEX_MULTIPART_ACK ctx_current 5/6 ${"a".repeat(64)}`;
    for (const actual of [expected, expected.slice(0, -2), expected.replace('ctx_current', 'ctx_other')]) {
      // A fresh document keeps each protocol variant independent of earlier DOM observers.
      const page = await browser.newPage();
      try {
        await page.setContent(`<section data-turn-key="current"><div data-user-message-bubble>Stage 5</div>
          <div data-content-search-unit-key="current:assistant"><div data-conversation-role="assistant"></div><div class="markdown"><p>${actual}</p></div></div>
          <div class="turn-action-controls"><button data-testid="copy-turn-action-button">Copy</button></div></section>`);
        const identity = 'group:assistant:current';
        const binding = { identity, locator: page.locator(chatGptAssistantTurnSelector(identity)), acceptedTurnIdentities: [identity] };
        const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
        const inspected = await worker.responseDomSnapshot(binding.locator);
        expect(inspected.visibleText).toBe(actual);
        expect(inspected.completionActionVisible).toBeTrue();
        let failure: unknown;
        try {
          const result = await worker.waitForMultipartAcknowledgement(page, binding, {},
            { acknowledgement: expected }, Date.now() + 15_000, undefined, undefined, new ChatGptCompletionTracker(0));
          expect(actual).toBe(expected);
          expect(result.identity).toBe(identity);
        } catch (error) { failure = error; }
        if (actual === expected) expect(failure).toBeUndefined();
        else expect(failure).toMatchObject({ code: 'multipart_acknowledgement_mismatch', retryable: true });
      } finally { await page.close(); }
    }
  } finally { await browser.close(); }
}, 60_000);
