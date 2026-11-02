import { expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defaultConfig } from "../src/config";
import { runDoctor } from "../src/doctor";
import { inspectCodexCompaction } from "../src/doctor-compaction";

test("doctor warns about saved compaction overrides without changing Codex settings", () => {
  const root = mkdtempSync(join(tmpdir(), "cgw-compaction-doctor-"));
  const path = join(root, "config.toml");
  const config = defaultConfig("browser-only");
  try {
    const check = (text: string, capabilities = config) => {
      writeFileSync(path, text);
      const result = inspectCodexCompaction(capabilities, path);
      expect(readFileSync(path, "utf8")).toBe(text);
      return result;
    };
    expect(inspectCodexCompaction(config, path)).toEqual([]);
    expect(check('model="chatgpt-web/gpt-6-sol"\n')).toEqual([]);
    expect(check('model="chatgpt-web/gpt-6-sol"\nmodel_auto_compact_token_limit=150_000\n')[0])
      .toMatchObject({ status: "warning", id: "codex-compaction" });
    expect(check('model="chatgpt-web/gpt-6-sol"\nmodel_auto_compact_token_limit=40_000\n')).toEqual([]);
    // A low window override can make a threshold unsafe even for the large Luna rolling window.
    const luna = { ...config, solAvailable: false, proAvailable: false };
    expect(check('model="chatgpt-web/gpt-5.6-luna"\nmodel_context_window=59640\nmodel_auto_compact_token_limit=150000', luna)[0]?.detail)
      .toContain("59640 tokens");
    expect(check('model="chatgpt-web/gpt-5.6-luna"\nmodel_auto_compact_token_limit=150000', luna)).toEqual([]);
    expect(check('model="chatgpt-web/gpt-5.6-luna"\nmodel_auto_compact_token_limit=150000', { ...luna, experimentalBiggerContext: true })[0]?.detail)
      .toContain("59424 tokens");
    expect(check('model="chatgpt-web/gpt-5.6-luna"\nmodel_auto_compact_token_limit=42000', { ...luna, experimentalBiggerContext: true })).toEqual([]);
    expect(check('profile="web"\nmodel_auto_compact_token_limit=150000\n[profiles.web]\nmodel="chatgpt-web/gpt-6-sol"\nmodel_auto_compact_token_limit=40000')).toEqual([]);
    expect(check('profile="web"\n[profiles.web]\nmodel="chatgpt-web/gpt-6-sol"\nmodel_auto_compact_token_limit=150000')[0]?.detail)
      .toContain('default profile "web"');
    expect(check('# model_auto_compact_token_limit=150000\n[profiles.unused]\nmodel_auto_compact_token_limit=150000')).toEqual([]);
    expect(check('model="gpt-6.1-sol"\nmodel_auto_compact_token_limit=150000')[0]?.detail).toContain('chatgpt-web/');
    for (const text of ['[invalid', 'profile="missing"', 'model_auto_compact_token_limit="secret"', 'model_auto_compact_token_limit=-1']) {
      const result = check(text)[0]!;
      expect(result.status).toBe("warning");
      expect(result.message).toContain("could not be checked");
      expect(result.detail).not.toContain("secret");
    }
    expect(check('\uFEFFmodel="chatgpt-web/gpt-6-sol"\nmodel_auto_compact_token_limit=150000')[0]?.status).toBe("warning");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("runDoctor includes codex-compaction check report", async () => {
  const root = mkdtempSync(join(tmpdir(), "cgw-doctor-integration-"));
  const appHome = join(root, "app");
  const codexHome = join(root, "codex");
  mkdirSync(appHome, { recursive: true });
  mkdirSync(codexHome, { recursive: true });
  const config = { ...defaultConfig("browser-only"), browserHost: "managed-chrome" as const };
  writeFileSync(join(appHome, "config.json"), JSON.stringify(config));
  writeFileSync(join(codexHome, "config.toml"), 'model="chatgpt-web/gpt-6-sol"\nmodel_auto_compact_token_limit=150000\n');
  const savedConfig = readFileSync(join(codexHome, "config.toml"), "utf8");
  const prevApp = process.env.CODEX_CHATGPT_WEB_HOME;
  const prevCodex = process.env.CODEX_HOME;
  process.env.CODEX_CHATGPT_WEB_HOME = appHome;
  process.env.CODEX_HOME = codexHome;
  try {
    const report = await runDoctor();
    const compactionCheck = report.checks.find(c => c.id === "codex-compaction");
    expect(compactionCheck).toBeDefined();
    expect(compactionCheck?.status).toBe("warning");
    expect(compactionCheck?.message).toContain("Custom Codex compaction limit exceeds Web model limits");
    expect(readFileSync(join(codexHome, "config.toml"), "utf8")).toBe(savedConfig);
  } finally {
    if (prevApp !== undefined) process.env.CODEX_CHATGPT_WEB_HOME = prevApp; else delete process.env.CODEX_CHATGPT_WEB_HOME;
    if (prevCodex !== undefined) process.env.CODEX_HOME = prevCodex; else delete process.env.CODEX_HOME;
    rmSync(root, { recursive: true, force: true });
  }
});
