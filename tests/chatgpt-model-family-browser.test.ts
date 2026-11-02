// Reproduction contributed by @alexalok in PR #730.
import { expect, test } from "bun:test";
import { chromium } from "playwright-core";
import { ChatGptBrowserWorker } from "../src/adapters/chatgpt-web/browser-worker";
import { CHATGPT_WEB_MODEL_ID } from "../src/adapters/chatgpt-web/model";
import { readChatGptUsageModel } from "../src/adapters/chatgpt-web/limits";

// October 28 picker: Default mixes model families; explicit Sol has five
// positions and explicit Astra has six. Never infer a family from Default.
const EXPLICIT_PICKER = `<form><div id="prompt-textarea" contenteditable="true">Draft</div>
  <button type="button" data-tone="neutral" aria-haspopup="menu" aria-controls="picker" aria-expanded="false">6 Sol High</button></form>
  <div id="picker" role="menu" aria-label="Select ChatGPT model" hidden>
    <div data-model-picker-view="simple">
      <div id="simple" data-active="true" aria-hidden="false">
        <div role="menuitem" aria-label="Select model" data-model-picker-view-toggle="true" tabindex="0"><div data-menu-row-content><span id="model"></span><span id="effort"></span></div></div>
        <span role="status" id="status"></span><span id="hint">Use Left and Right arrow keys to adjust power</span>
        <div role="menuitem" aria-label="Power" aria-describedby="status hint" tabindex="-1"><div data-model-picker-power-slider style="height:30px;width:250px"></div></div>
      </div>
      <div id="advanced" aria-hidden="true" inert>
        <div role="menuitemradio" aria-checked="true" data-model-selected="true">Default Recommended set of models</div>
        <div role="menuitemradio" aria-checked="false">GPT-6 Sol</div>
        <div role="menuitemradio" aria-checked="false">GPT-6.1 Sol</div>
        <div role="menuitemradio" aria-checked="false">GPT-6 Astra</div>
        <div role="menuitemradio" aria-checked="false">GPT-6.1 Terra</div>
        <div role="menuitemradio" aria-checked="false">GPT-5.6 Sol</div>
      </div>
    </div>
  </div><script>
    const button=document.querySelector('button'), menu=document.querySelector('#picker');
    const simple=document.querySelector('#simple'), advanced=document.querySelector('#advanced');
    let selected='Default', value=1;
    function render() {
      const astra=selected==='GPT-6 Astra', defaults=selected==='Default';
      const efforts=astra?['Light','Medium','High','Extra High','Max','Ultra']:defaults?['Instant','High','Light','Medium','Extra High','Pro']:['Instant','Medium','High','Extra High','Pro'];
      const name=defaults?'6 Sol':selected.replace('GPT-','');
      document.querySelector('#model').textContent=window.conflictingHeader?'6.1 Sol':name;
      document.querySelector('#effort').textContent=efforts[value];
      document.querySelector('#status').textContent=efforts[value]+', '+(value+1)+' of '+efforts.length+'.';
      document.querySelector('[data-model-picker-power-slider]').innerHTML='<span data-orientation="horizontal" aria-disabled="false">'+efforts.map((_,i)=>'<span data-selected="'+(i<=value)+'"></span>').join('')+'<span role="slider" aria-hidden="true" aria-valuemin="0" aria-valuemax="'+(efforts.length-1)+'" aria-valuenow="'+value+'"></span></span>';
    }
    function view(advancedView) {
      document.querySelector('[data-model-picker-view]').setAttribute('data-model-picker-view',advancedView?'advanced':'simple');
      simple.inert=advancedView; simple.setAttribute('aria-hidden',String(advancedView)); simple.style.display=advancedView?'none':'';
      advanced.inert=!advancedView; advanced.setAttribute('aria-hidden',String(!advancedView)); advanced.style.display=advancedView?'':'none';
    }
    button.onclick=()=>{menu.hidden=false;button.setAttribute('aria-expanded','true');button.textContent='Select model';view(false);render();};
    document.querySelector('[data-model-picker-view-toggle]').onclick=()=>view(true);
    for(const row of advanced.children) row.onclick=()=>{selected=row.textContent;value=selected==='GPT-6 Astra'?1:2;for(const other of advanced.children)other.setAttribute('aria-checked',String(other===row));view(false);render();};
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape'){menu.hidden=true;button.setAttribute('aria-expanded','false');button.textContent=document.querySelector('#model').textContent+' '+document.querySelector('#effort').textContent;}
      else if(event.key==='ArrowLeft'||event.key==='ArrowRight'){value=Math.max(0,Math.min(selected==='GPT-6 Astra'?5:4,value+(event.key==='ArrowRight'?1:-1)));render();event.preventDefault();}
    });
    if(window.omitSol)[...advanced.children].find(x=>x.textContent==='GPT-6 Sol').remove();
    render();view(false);
  </script>`;

for (const [effort, label, usageModel] of [["high", "6 Sol High", "other"], ["max", "6 Astra Max", "gpt-6-pro"]] as const) {
  test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)(`explicit picker selects exact GPT-6 ${effort} beside GPT-6.1`, async () => {
    const browser=await chromium.launch({executablePath:process.env.CHATGPT_DOM_TEST_BROWSER,headless:true});
    try {
      const page=await browser.newPage();await page.setContent(EXPLICIT_PICKER);
      const worker=Object.create(ChatGptBrowserWorker.prototype) as any;
      const mode=await worker.selectModelAndEffort(page,CHATGPT_WEB_MODEL_ID,effort,{localToolsEnabled:false,solAvailable:true,extraHighAvailable:true,proAvailable:true},undefined,true,"6");
      expect(mode.selection.label).toBe(label);expect(mode.usageModel).toBe(usageModel);
      expect(await page.locator('#prompt-textarea').innerText()).toBe('Draft');
    } finally {await browser.close();}
  },30_000);
}

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("explicit picker refuses absent GPT-6 Sol and conflicting GPT-6.1 evidence",async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHATGPT_DOM_TEST_BROWSER,headless:true});
  try {
    for(const scenario of ['omitSol','conflictingHeader']){
      const page=await browser.newPage();await page.setContent('<script>window.'+scenario+'=true;</script>'+EXPLICIT_PICKER);
      const worker=Object.create(ChatGptBrowserWorker.prototype) as any;
      let failure: unknown;
      try {
        await worker.selectModelAndEffort(page,CHATGPT_WEB_MODEL_ID,'high',{localToolsEnabled:false,solAvailable:true,extraHighAvailable:true,proAvailable:true},undefined,false,'6');
      } catch (error) { failure=error; }
      expect(String(failure)).toContain('could not be selected and verified');
      expect(await page.locator('#prompt-textarea').innerText()).toBe('Draft');await page.close();
    }
  }finally{await browser.close();}
},30_000);

// Mirrors ChatGPT's power picker as captured live on 2026-09-29 (English, Pro account): the slider
// announcement reads only "Pro, 5 of 5." and the model version appears in the "Select model"
// header as <span>6</span><span data-maximum>Pro</span>. Older pickers announced "6 Pro, 5 of 5.".
type Picker = {
  /** Header version per slider value; null removes the header like older pickers. */
  header: ((value: number) => string) | null;
  /** Slider announcement per effort label and slider value. */
  status: (effort: string, value: number) => string;
};

const PICKERS = {
  current: { header: (value: number) => value === 4 ? "6" : "5.6", status: (effort: string, value: number) => effort + ", " + (value + 1) + " of 5." },
  legacy: { header: null, status: (effort: string, value: number) => (value === 4 ? "6 " : "5.6 ") + effort + ", " + (value + 1) + " of 5." },
  future: { header: (value: number) => value === 4 ? "7" : "5.6", status: (effort: string, value: number) => effort + ", " + (value + 1) + " of 5." },
  versionless: { header: () => "", status: (effort: string, value: number) => effort + ", " + (value + 1) + " of 5." },
  conflicting: { header: (value: number) => value === 4 ? "6" : "5.6", status: (effort: string, value: number) => (value === 4 ? "5.6 " : "") + effort + ", " + (value + 1) + " of 5." },
} satisfies Record<string, Picker>;

const FIXTURE = `<form><div id="prompt-textarea" contenteditable="true">Draft</div>
  <button type="button" data-tone="neutral" aria-haspopup="menu" aria-controls="picker" aria-expanded="false">Medium</button></form>
  <div id="picker" role="menu" aria-label="Select ChatGPT model" hidden>
    <div data-model-picker-view="simple">
      <div aria-hidden="false" data-active="true">
        <div data-explicit-model="false">
          <div role="menuitem" aria-hidden="false" aria-label="Select model" data-model-picker-view-toggle="true" tabindex="0">
            <div data-menu-row-content="true"><span><span><span id="header-version"></span><span id="header-effort" data-accent="true"></span><svg></svg></span></span></div>
          </div>
          <span aria-hidden="true"><span>Consumes usage limits faster</span></span>
        </div>
        <span aria-live="polite" id="status" role="status"></span>
        <span id="hint">Use Left and Right arrow keys to adjust power</span>
        <div role="menuitem" aria-describedby="status hint" aria-label="Power" data-reasoning-slider="true" tabindex="-1">
          <div data-menu-row-content="true"><span><div data-model-picker-power-slider style="height:30px;width:250px"></div></span></div>
        </div>
      </div>
      <div aria-hidden="true" data-active="false" inert>
        <span>Locked, opens access options</span>
        <div role="menuitemradio" aria-checked="true" data-model-selected="true" tabindex="-1"><div data-menu-row-content="true"><span>Latest</span></div></div>
        <div role="menuitemradio" aria-checked="false" tabindex="-1"><div data-menu-row-content="true"><span>GPT-5.6 Sol</span></div></div>
        <div role="menuitemradio" aria-checked="false" tabindex="-1"><div data-menu-row-content="true"><div><span>GPT-5.5</span><span>Leaving on October 14</span></div></div></div>
      </div>
    </div>
  </div>
  <script>
    const efforts = ["Instant", "Medium", "High", "Extra High", "Pro"];
    const control = document.querySelector("button"), menu = document.querySelector("#picker");
    let value = 1;
    function render() {
      document.querySelector("[data-model-picker-power-slider]").innerHTML = '<span data-orientation="horizontal" aria-disabled="false">'
        + efforts.map((_, i) => '<span data-selected="' + (i <= value) + '"></span>').join("")
        + '<span role="slider" aria-hidden="true" aria-valuemin="0" aria-valuemax="4" aria-valuenow="' + value + '"></span></span>';
      document.querySelector("#status").textContent = window.pickerStatus(efforts[value], value);
      if (window.pickerHeader === null) document.querySelector("[data-model-picker-view-toggle]")?.remove();
      else {
        document.querySelector("#header-version").textContent = window.pickerHeader(value);
        document.querySelector("#header-effort").textContent = efforts[value];
      }
    }
    control.onclick = () => {
      menu.hidden = false; control.setAttribute("aria-expanded", "true"); control.textContent = "Thinking effort"; render();
    };
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        menu.hidden = true; control.setAttribute("aria-expanded", "false"); control.textContent = efforts[value];
      } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        value = Math.max(0, Math.min(4, value + (event.key === "ArrowRight" ? 1 : -1))); render(); event.preventDefault();
      }
    });
  </script>`;

async function selectGpt6Pro(picker: Picker) {
  const browser = await chromium.launch({ executablePath: process.env.CHATGPT_DOM_TEST_BROWSER, headless: true });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(5_000);
    const config = "<script>window.pickerHeader = " + (picker.header ? picker.header.toString() : "null")
      + "; window.pickerStatus = (_effort, value) => "
      + JSON.stringify(["Instant", "Medium", "High", "Extra High", "Pro"].map((effort, value) => picker.status(effort, value)))
      + "[value];</script>";
    await page.setContent(config + FIXTURE);
    const worker = Object.create(ChatGptBrowserWorker.prototype) as any;
    try {
      const mode = await worker.selectModelAndEffort(page, CHATGPT_WEB_MODEL_ID, "max", {
        localToolsEnabled: false, solAvailable: true, extraHighAvailable: true, proAvailable: true,
      }, undefined, true, "6");
      return { ok: true, label: mode.selection.label, usageModel: mode.usageModel, draft: await page.locator("#prompt-textarea").innerText() };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : String(error), draft: await page.locator("#prompt-textarea").innerText() };
    }
  } finally {
    await browser.close();
  }
}

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("GPT-6 Pro is verified from the current picker header when the slider announces only the effort", async () => {
  expect(await selectGpt6Pro(PICKERS.current)).toEqual({ ok: true, label: "Pro", usageModel: "gpt-6-pro", draft: "Draft" });
}, 60_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("GPT-6 Pro is still verified from the older versioned slider announcement", async () => {
  expect(await selectGpt6Pro(PICKERS.legacy)).toEqual({ ok: true, label: "Pro", usageModel: "gpt-6-pro", draft: "Draft" });
}, 60_000);

for (const scenario of ["future", "versionless", "conflicting"] as const)
test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("GPT-6 Pro fails closed when the picker's model evidence is " + scenario, async () => {
  const result = await selectGpt6Pro(PICKERS[scenario]);
  expect(result.ok).toBe(false);
  expect(result.message).toContain("ChatGPT model 6 could not be selected and verified");
  expect(result.draft).toBe("Draft");
}, 60_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("model evidence excludes inactive and foreign picker headers and rejects multiple active headers", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHATGPT_DOM_TEST_BROWSER, headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(`<div role="menu" id="owned">
      <div data-model-picker-view-toggle="true" id="active"><div data-menu-row-content>
        <span>6</span><span>Pro</span><span hidden>5.6</span>
      </div></div>
      <div role="menuitem" aria-describedby="status"><span role="slider"></span></div>
      <span id="status">Pro, 5 of 5.</span>
      <div hidden><div data-model-picker-view-toggle="true">5.6 Pro</div></div>
      <div inert><div data-model-picker-view-toggle="true">5.6 Pro</div></div>
      <div aria-hidden="true"><div data-model-picker-view-toggle="true">5.6 Pro</div></div>
      <div style="display:none"><div data-model-picker-view-toggle="true">5.6 Pro</div></div>
      <div role="menu"><div data-model-picker-view-toggle="true">5.6 Pro</div></div>
    </div><div role="menu"><div data-model-picker-view-toggle="true">5.6 Pro</div></div>`);
    const slider = page.getByRole("slider");
    expect(await readChatGptUsageModel(slider, true)).toBe("gpt-6-pro");
    await page.locator("#active").evaluate(element => element.setAttribute("hidden", ""));
    expect(await readChatGptUsageModel(slider, true)).toBe("pro-unknown");
    await page.locator("#active").evaluate(element => {
      element.removeAttribute("hidden");
      element.after(element.cloneNode(true));
    });
    await expect(readChatGptUsageModel(slider, true)).rejects.toThrow("multiple active model headers");
  } finally {
    await browser.close();
  }
}, 60_000);

test.skipIf(!process.env.CHATGPT_DOM_TEST_BROWSER)("localized position punctuation works through actual picker selection and usage readback", async () => {
  for (const separator of ["、", "،", "；", "—"]) {
    const picker: Picker = { header: null, status: (effort, value) => `${value === 4 ? "6" : "5.6"} ${effort}${separator}5 件中 ${value + 1} 番目。` };
    expect(await selectGpt6Pro(picker)).toEqual({ ok: true, label: "Pro", usageModel: "gpt-6-pro", draft: "Draft" });
  }
}, 60_000);
