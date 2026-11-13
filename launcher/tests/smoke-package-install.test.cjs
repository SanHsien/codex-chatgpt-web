const assert = require("node:assert/strict");
const { test } = require("node:test");
const { checkInstallOverwrite } = require("../scripts/smoke-package-install.cjs");

const guid = "d1a6026a-6210-588e-9a2b-da3936f94e02";
const location = "C:\\Users\\Example User\\AppData\\Local\\Programs\\Codex Web GPT";
const consent = "CODEX_WEB_GPT_SMOKE_ALLOW_OVERWRITE";
function queryValue(value) {
  return (command, args, options) => {
    assert.equal(command, "powershell.exe");
    assert.ok(args.includes("-NoProfile"));
    assert.ok(args.at(-1).includes(`Software\\${guid}`));
    assert.ok(args.at(-1).includes("InstallLocation"));
    assert.equal(options.windowsHide, true);
    assert.ok(options.timeout > 0);
    return { status: 0, stdout: JSON.stringify(value), stderr: "" };
  };
}

test("clean runner can install without consent", () => {
  assert.equal(checkInstallOverwrite(guid, {}, queryValue(null)), null);
});

test("existing installation refuses missing or non-exact consent", () => {
  for (const value of [undefined, "", "0", "true", "yes", " 1", "1 "]) {
    assert.throws(() => checkInstallOverwrite(guid, { [consent]: value }, queryValue(location)), (error) => {
      assert.ok(error.message.includes(location));
      assert.ok(error.message.includes(`HKCU\\Software\\${guid}`));
      assert.ok(error.message.includes(`${consent}=1`));
      assert.match(error.message, /refus|overwrite/i);
      return true;
    });
  }
});

test("exact consent allows the registered installation even if its directory is stale", () => {
  assert.equal(checkInstallOverwrite(guid, { [consent]: "1" }, queryValue(location)), location);
});

test("unknown registry state fails closed even with consent", () => {
  const failure = new Error("query unavailable");
  for (const result of [
    { error: failure },
    { status: 1, stderr: "Access denied" },
    { status: null, stdout: "" },
    { status: 0, stdout: "not json" },
  ]) {
    assert.throws(() => checkInstallOverwrite(guid, { [consent]: "1" }, () => result));
  }
});

test("invalid registered locations fail closed", () => {
  for (const value of ["", "   ", "relative\\path", 42, {}, []]) {
    assert.throws(() => checkInstallOverwrite(guid, {}, queryValue(value)), /invalid InstallLocation/);
  }
});

test("a real registry query on Windows treats an absent product key as a clean runner", { skip: process.platform !== "win32" }, () => {
  // Windows PowerShell 5.1 prints nothing for ConvertTo-Json $null; a clean CI runner must still pass.
  assert.equal(checkInstallOverwrite("00000000-0000-0000-0000-00000000c0de", {}), null);
});
