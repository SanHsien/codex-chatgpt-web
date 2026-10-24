import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

// Expand a `bun run ...` command into the launcher `tsc --noEmit` runs it causes.
function launcherTypechecks(args: string[], rootScripts: Record<string, string>, launcherScripts: Record<string, string>): number {
  let rest = args.slice(1); // drop "run"
  let scripts = rootScripts;
  if (rest[0] === "--cwd" && rest[1] === "launcher") {
    scripts = launcherScripts;
    rest = rest.slice(2);
  }
  const name = rest[0];
  const body = scripts[name];
  if (body === undefined) return 0;
  const inner = [...body.matchAll(/bun run (--cwd launcher )?([\w:-]+)/g)];
  let total = scripts === launcherScripts && name === "typecheck" ? 1 : 0;
  for (const match of inner) {
    total += launcherTypechecks(
      match[1] ? ["run", "--cwd", "launcher", match[2]] : scripts === launcherScripts ? ["run", "--cwd", "launcher", match[2]] : ["run", match[2]],
      rootScripts,
      launcherScripts,
    );
  }
  return total;
}

test("verify runs the launcher typecheck exactly once", () => {
  const rootScripts = JSON.parse(read("package.json")).scripts as Record<string, string>;
  const launcherScripts = JSON.parse(read("launcher/package.json")).scripts as Record<string, string>;
  const steps = [...read("scripts/verify.ts").matchAll(/await run\((\["run"(?:, "[^"]+")*\])\);/g)]
    .map(match => JSON.parse(match[1]) as string[])
    .filter(args => args[0] === "run" && !args[1]?.endsWith(".ts"));
  expect(steps.length).toBeGreaterThan(5);
  const total = steps.reduce((sum, args) => sum + launcherTypechecks(args, rootScripts, launcherScripts), 0);
  expect(total).toBe(1);
});
