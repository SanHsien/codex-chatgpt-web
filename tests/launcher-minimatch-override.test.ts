import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// GHSA-g3hv-75wg-m249 affects minimatch <11.0.1. The modern line must resolve to the patched
// 11.0.5 release, while legacy minimatch 3/5 nodes stay on their callable CommonJS API.
const root = join(import.meta.dir, "..");
const pkg = JSON.parse(readFileSync(join(root, "launcher/package.json"), "utf8")) as { overrides?: Record<string, string> };
const lock = readFileSync(join(root, "launcher/bun.lock"), "utf8");

test("launcher overrides the vulnerable minimatch line only to the patched 11.0.5 release", () => {
  expect(pkg.overrides?.["minimatch@>=7.0.0 <11.0.1"]).toBe("11.0.5");
  expect(Object.keys(pkg.overrides ?? {}).some(key => key.startsWith("minimatch@>=5"))).toBe(false);
});

test("the launcher lockfile resolves the modern minimatch line to 11.0.5 or later", () => {
  const match = lock.match(/"minimatch": \["minimatch@(\d+)\.(\d+)\.(\d+)"/);
  expect(match).not.toBeNull();
  const [major, minor, patch] = match!.slice(1).map(Number);
  const atLeast = major > 11 || (major === 11 && (minor > 0 || (minor === 0 && patch >= 5)));
  expect(atLeast).toBe(true);
});
