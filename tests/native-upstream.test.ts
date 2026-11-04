import { afterEach, expect, test } from "bun:test";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  activateCodexIntegration,
  deactivateCodexIntegration,
  installCodexIntegration,
  uninstallCodexIntegration,
} from "../src/codex-integration";
import {
  getCodexCatalogOverlayPath,
  getMergedCodexCatalogPath,
  refreshCodexCatalogOverlay,
} from "../src/codex-catalog-overlay";
import { defaultConfig, saveConfig } from "../src/config";
import {
  CHATGPT_CODEX_BACKEND,
  forwardNativeCodexRequest,
  getNativeCodexUpstream,
  setNativeCodexUpstream,
} from "../src/native-passthrough";
import { resolveNativeCodexUpstream } from "../src/native-upstream";
import { modelsRequest } from "../src/server";

const OPENCODEX = "http://127.0.0.1:10100/v1";
const roots: string[] = [];

function nativeModel(slug: string): Record<string, unknown> {
  return {
    slug,
    display_name: slug,
    priority: 1,
    visibility: "list",
    supported_in_api: true,
    multi_agent_version: "v2",
    supported_reasoning_levels: [],
    tool_mode: "code_mode_only",
    context_window: 300_000,
  };
}

function nativeConfig() {
  const config = defaultConfig("browser-only");
  config.subagentProtocol = "native";
  return config;
}

function fixture(): { codexHome: string; configPath: string; sourcePath: string } {
  const root = join(tmpdir(), `codex-chatgpt-web-upstream-${process.pid}-${Date.now()}-${Math.random()}`);
  const codexHome = join(root, "codex");
  mkdirSync(codexHome, { recursive: true });
  roots.push(root);
  process.env.CODEX_HOME = codexHome;
  process.env.CODEX_CHATGPT_WEB_HOME = join(root, "app");
  const sourcePath = join(codexHome, "opencodex-catalog.json");
  writeFileSync(sourcePath, JSON.stringify({
    models: [nativeModel("gpt-6.1-sol"), nativeModel("anthropic/claude-haiku-4-5"), nativeModel("combo/flagship")],
  }));
  return { codexHome, configPath: join(codexHome, "config.toml"), sourcePath };
}

function baselineConfig(sourcePath: string): string {
  return [
    `model = "gpt-6.1-sol"`,
    `model_catalog_json = ${JSON.stringify(sourcePath)}`,
    `openai_base_url = ${JSON.stringify(OPENCODEX)}`,
    "",
    "[windows]",
    `sandbox = "elevated"`,
    "",
  ].join("\n");
}

function catalogLine(configPath: string): string | undefined {
  return readFileSync(configPath, "utf8").split("\n").find(line => line.startsWith("model_catalog_json"));
}

function slugs(path: string): string[] {
  return (JSON.parse(readFileSync(path, "utf8")) as { models: Array<{ slug: string }> }).models.map(model => model.slug);
}

afterEach(() => {
  setNativeCodexUpstream(CHATGPT_CODEX_BACKEND);
  delete process.env.CODEX_HOME;
  delete process.env.CODEX_CHATGPT_WEB_HOME;
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

test("non-Web models reach the configured native upstream instead of chatgpt.com", async () => {
  setNativeCodexUpstream(`${OPENCODEX}/`);
  const request = new Request("http://127.0.0.1:17841/v1/responses", {
    method: "POST",
    headers: { authorization: "Bearer codex-oauth-token", "content-type": "application/json" },
    body: JSON.stringify({ model: "anthropic/claude-haiku-4-5", input: [] }),
  });
  let upstream: Request | undefined;
  await forwardNativeCodexRequest(request, "responses", async input => {
    upstream = input;
    return new Response("data: [DONE]\n\n", { headers: { "content-type": "text/event-stream" } });
  });
  expect(upstream!.url).toBe(`${OPENCODEX}/responses`);
  expect(upstream!.headers.get("authorization")).toBe("Bearer codex-oauth-token");
});

test("every native endpoint shares the one configured upstream", async () => {
  setNativeCodexUpstream(OPENCODEX);
  for (const endpoint of ["responses/compact", "alpha/search", "images/generations"] as const) {
    let url = "";
    await forwardNativeCodexRequest(new Request(`http://127.0.0.1:17841/v1/${endpoint}`, {
      method: "POST",
      headers: { authorization: "Bearer t", "content-type": "application/json" },
      body: "{}",
    }), endpoint, async input => {
      url = input.url;
      return Response.json({});
    });
    expect(url).toBe(`${OPENCODEX}/${endpoint}`);
  }
});

test("the upstream model list keeps its models and gains the Web rows", async () => {
  setNativeCodexUpstream(OPENCODEX);
  const response = await modelsRequest(
    new Request("http://127.0.0.1:17841/v1/models?client_version=0.150.0", { headers: { authorization: "Bearer t" } }),
    nativeConfig(),
    async input => {
      expect(input.url).toBe(`${OPENCODEX}/models?client_version=0.150.0`);
      return Response.json({ models: [nativeModel("gpt-6.1-sol"), nativeModel("anthropic/claude-haiku-4-5")] });
    },
  );
  const body = await response.json() as { models: Array<{ slug: string; display_name: string }> };
  expect(body.models.map(model => model.slug)).toContain("anthropic/claude-haiku-4-5");
  expect(body.models.some(model => model.display_name.endsWith("(Web)"))).toBeTrue();
});

test("an invalid native upstream is refused instead of silently falling back", () => {
  expect(() => setNativeCodexUpstream("file:///etc/passwd")).toThrow();
  expect(getNativeCodexUpstream()).toBe(CHATGPT_CODEX_BACKEND);
});

test("the default upstream is the openai_base_url Codex used before setup", () => {
  const { configPath, sourcePath } = fixture();
  writeFileSync(configPath, baselineConfig(sourcePath));
  const config = nativeConfig();
  expect(resolveNativeCodexUpstream(config)).toEqual({ url: CHATGPT_CODEX_BACKEND, source: "default" });
  installCodexIntegration(config, { replaceExistingRoute: true });
  expect(resolveNativeCodexUpstream(config)).toEqual({ url: OPENCODEX, source: "journal" });
  expect(resolveNativeCodexUpstream({ ...config, nativeUpstreamUrl: "http://127.0.0.1:9999/v1" }))
    .toEqual({ url: "http://127.0.0.1:9999/v1", source: "config" });
});

test("a pinned model_catalog_json is replaced by a merged catalog and restored on uninstall", () => {
  const { configPath, sourcePath } = fixture();
  const baseline = baselineConfig(sourcePath);
  writeFileSync(configPath, baseline);
  const sourceBefore = readFileSync(sourcePath, "utf8");
  const config = nativeConfig();
  saveConfig(config);

  installCodexIntegration(config, { replaceExistingRoute: true });
  const merged = getMergedCodexCatalogPath();
  expect(catalogLine(configPath)).toBe(`model_catalog_json = ${JSON.stringify(merged)}`);
  expect(slugs(merged)).toContain("anthropic/claude-haiku-4-5");
  expect(slugs(merged)).toContain("combo/flagship");
  expect(slugs(merged).some(slug => slug.startsWith("chatgpt-web/"))).toBeTrue();
  expect(readFileSync(sourcePath, "utf8")).toBe(sourceBefore);

  // The other tool re-syncs its own catalog file; the merged catalog follows it.
  writeFileSync(sourcePath, JSON.stringify({ models: [nativeModel("gpt-6.1-sol"), nativeModel("anthropic/claude-opus-5-5")] }));
  expect(refreshCodexCatalogOverlay(config)).toBe("refreshed");
  expect(slugs(merged)).toContain("anthropic/claude-opus-5-5");
  expect(slugs(merged)).not.toContain("combo/flagship");

  deactivateCodexIntegration();
  expect(catalogLine(configPath)).toBe(`model_catalog_json = ${JSON.stringify(sourcePath)}`);
  activateCodexIntegration();
  expect(catalogLine(configPath)).toBe(`model_catalog_json = ${JSON.stringify(merged)}`);

  uninstallCodexIntegration();
  expect(readFileSync(configPath, "utf8")).toBe(baseline);
  expect(existsSync(merged)).toBeFalse();
  expect(existsSync(getCodexCatalogOverlayPath())).toBeFalse();
});

test("reinstalling keeps the original catalog as the merge source", () => {
  const { configPath, sourcePath } = fixture();
  const baseline = baselineConfig(sourcePath);
  writeFileSync(configPath, baseline);
  const config = nativeConfig();
  installCodexIntegration(config, { replaceExistingRoute: true });
  installCodexIntegration(config, { replaceExistingRoute: true });
  expect(slugs(getMergedCodexCatalogPath())).toContain("anthropic/claude-haiku-4-5");
  uninstallCodexIntegration();
  expect(readFileSync(configPath, "utf8")).toBe(baseline);
});

test("a catalog line someone else rewrote is left alone on uninstall", () => {
  const { configPath, sourcePath } = fixture();
  writeFileSync(configPath, baselineConfig(sourcePath));
  installCodexIntegration(nativeConfig(), { replaceExistingRoute: true });
  const other = `model_catalog_json = ${JSON.stringify(join(tmpdir(), "someone-else.json"))}`;
  writeFileSync(configPath, readFileSync(configPath, "utf8").replace(/^model_catalog_json = .*$/m, other));
  uninstallCodexIntegration();
  expect(catalogLine(configPath)).toBe(other);
  expect(existsSync(getCodexCatalogOverlayPath())).toBeFalse();
});

test("without a pinned catalog Codex keeps asking the bridge and nothing is overlaid", () => {
  const { configPath } = fixture();
  const baseline = [`openai_base_url = ${JSON.stringify(OPENCODEX)}`, ""].join("\n");
  writeFileSync(configPath, baseline);
  installCodexIntegration(nativeConfig(), { replaceExistingRoute: true });
  expect(catalogLine(configPath)).toBeUndefined();
  expect(existsSync(getCodexCatalogOverlayPath())).toBeFalse();
  uninstallCodexIntegration();
  expect(readFileSync(configPath, "utf8")).toBe(baseline);
});
