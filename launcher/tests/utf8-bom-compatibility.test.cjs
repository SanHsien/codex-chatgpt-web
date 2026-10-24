const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { readJsonFile } = require("../electron/json-file.cjs");
const { createStateStore } = require("../electron/state.cjs");
const { readWindowState } = require("../electron/window-state.cjs");

const BOM = "﻿";

function tempFile(name, text) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "codex-web-gpt-bom-"));
  const file = path.join(root, name);
  fs.writeFileSync(file, text, "utf8");
  return { root, file };
}

test("readJsonFile strips exactly one leading UTF-8 BOM", () => {
  const { root, file } = tempFile("a.json", `${BOM}{"a":1}`);
  try {
    assert.deepEqual(readJsonFile(file), { a: 1 });
    fs.writeFileSync(file, `${BOM}${BOM}{"a":1}`, "utf8");
    assert.throws(() => readJsonFile(file));
    fs.writeFileSync(file, `{"a":"x${BOM}y"}`, "utf8");
    assert.equal(readJsonFile(file).a, `x${BOM}y`);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("launcher state written with a UTF-8 BOM keeps its saved values", () => {
  const { root, file } = tempFile("state.json", `${BOM}${JSON.stringify({
    version: 1,
    language: "ja",
    autoStart: false,
    sidebarWidth: 300,
  })}`);
  try {
    const state = createStateStore(file).read();
    assert.equal(state.language, "ja");
    assert.equal(state.autoStart, false);
    assert.equal(state.sidebarWidth, 300);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("window state written with a UTF-8 BOM keeps its saved bounds", () => {
  const { root, file } = tempFile("window.json", `${BOM}${JSON.stringify({
    bounds: { width: 1300, height: 800 },
    maximized: true,
  })}`);
  try {
    const state = readWindowState(file);
    assert.equal(state.bounds.width, 1300);
    assert.equal(state.bounds.height, 800);
    assert.equal(state.maximized, true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("state files without a BOM and stored output format are unchanged", () => {
  const { root, file } = tempFile("state.json", JSON.stringify({ version: 1, language: "en" }));
  try {
    const store = createStateStore(file);
    assert.equal(store.read().language, "en");
    store.update({ language: "zh-CN" });
    const written = fs.readFileSync(file, "utf8");
    assert.equal(written.startsWith(BOM), false);
    assert.equal(JSON.parse(written).language, "zh-CN");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
