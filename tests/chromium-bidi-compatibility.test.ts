import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

test("installed chromium-bidi satisfies Playwright's lazy BiDi imports", () => {
  const playwrightRoot = dirname(require.resolve("playwright-core"));
  const bundle = readFileSync(join(playwrightRoot, "lib", "coreBundle.js"), "utf8");
  const imports = [...bundle.matchAll(/require\("(chromium-bidi\/[^"\n]+)"\)/g)]
    .map((match) => match[1]);
  expect(imports.length).toBeGreaterThan(0);
  for (const specifier of new Set(imports)) {
    expect(() => require(specifier)).not.toThrow();
  }
});
