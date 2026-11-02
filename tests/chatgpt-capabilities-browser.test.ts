import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { detectChatGptAccountCapabilities } from "../src/chatgpt-session";
import { setChatGptThinkMode } from "../src/adapters/chatgpt-web/browser-worker";

const browserPath = process.env.CHATGPT_DOM_TEST_BROWSER;
// Ported from upstream 9c3633c (#932). Its first case (paid inline control) reads
// chatgpt-model-picker-power-2026-09-29.html, which belongs to the deferred exact picker (#921);
// the equivalent paid-inline-control coverage lives in chatgpt-session.test.ts.
const probe = { selectorTimeoutMs: 150, stableAbsenceMs: 0 };

test.skipIf(!browserPath)("only a unique recognized Think control proves a Luna account, without clicking or submitting", async () => {
  const browser = await chromium.launch({ executablePath: browserPath, headless: true });
  try {
    const page = await browser.newPage();
    const think = readFileSync(new URL('./fixtures/chatgpt-composer-think-2026-10-28.html', import.meta.url), 'utf8');
    for (const controls of [think, '<button type="button" aria-pressed="true">Think</button>']) {
      await page.setContent(`<form><div id="prompt-textarea" contenteditable="true">Keep my draft</div>${controls}</form>`);
      const before = await page.locator('form').innerHTML();
      expect(await detectChatGptAccountCapabilities(page, probe)).toEqual({ solAvailable: false, extraHighAvailable: false, proAvailable: false });
      expect(await page.locator('form').innerHTML()).toBe(before);
    }
    for (const controls of [
      '', '<button aria-haspopup="menu" data-composer-navigation-target="reasoning">6 High</button>',
      '<button type="button" aria-pressed="false" hidden>Think</button>',
      '<button type="button">Think</button>',
      '<button type="button" aria-pressed="false">Think harder</button>',
      '<button type="button" aria-pressed="false">Think</button><button type="button" aria-pressed="true">Think</button>',
    ]) {
      await page.setContent(`<form><div id="prompt-textarea" contenteditable="true">Keep my draft</div>${controls}</form>
        <button type="button" aria-pressed="false">Think</button>`);
      await expect(detectChatGptAccountCapabilities(page, probe)).rejects.toThrow("Could not identify ChatGPT's model controls");
      expect(await page.locator('#prompt-textarea').innerText()).toBe('Keep my draft');
    }
    await page.setContent('<form><div id="prompt-textarea" contenteditable="true">Keep my draft</div></form>');
    await expect(setChatGptThinkMode(page.locator('#prompt-textarea'), false))
      .rejects.toMatchObject({ code: 'chatgpt_model_controls_unavailable', retryable: false });
    expect(await page.locator('#prompt-textarea').innerText()).toBe('Keep my draft');
  } finally { await browser.close(); }
}, 60_000);
