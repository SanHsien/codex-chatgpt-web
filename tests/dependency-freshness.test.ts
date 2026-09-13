import { expect, test } from "bun:test";
import { checkFailure, checkFreshness, evaluateFreshness, parseBunOutdated, renderReport, validateDeferrals } from "../scripts/check-dependency-freshness";

const table = "bun outdated v1.4.0 (34cbb9a40)\n| Package | Current | Update | Latest |\n|---|---|---|---|\n| pkg (dev) | 1.0.0 | 1.1.0 | 2.0.0 |\n";
const deferrals = { schemaVersion: 1, deferrals: [{ workspace: "root", package: "pkg", latest: "2.0.0", reviewed: "2026-09-06", reason: "Requires packaged desktop verification." }] } as const;

test("parses Bun 1.4 text tables and applies exact-version deferrals", () => {
  expect(parseBunOutdated(table)).toEqual([{ package: "pkg", current: "1.0.0", update: "1.1.0", latest: "2.0.0" }]);
  expect(evaluateFreshness("root", parseBunOutdated(table), validateDeferrals(deferrals))[0].status).toBe("deferred");
  expect(evaluateFreshness("root", [{ package: "pkg", current: "1.0.0", update: "1.1.0", latest: "2.1.0" }], validateDeferrals(deferrals))[0].status).toBe("attention");
});

test("checks both workspaces and audits with an injected command runner", () => {
  const clean = "bun outdated v1.4.0 (34cbb9a40)\n| Package | Current | Update | Latest |\n|---|---|---|---|\n";
  const result = checkFreshness("/repo", validateDeferrals(deferrals), (_command, args, cwd) => ({ exitCode: 0, stdout: args[0] === "audit" ? "No vulnerabilities" : (cwd === "/repo" ? table : clean), stderr: "" }));
  expect(result.status).toBe("current");
  expect(result.outdatedChecks).toHaveLength(2);
  expect(result.audits).toHaveLength(2);
  expect(result.rows[0].status).toBe("deferred");
});

test("fails closed for malformed output and renders checker detail", () => {
  expect(() => parseBunOutdated("{}\n")).toThrow("unavailable");
  expect(() => validateDeferrals({ schemaVersion: 1, deferrals: [{ workspace: "root", package: "pkg", latest: "2.0.0", reason: "missing reviewed" }] })).toThrow("invalid or incomplete");
  expect(() => validateDeferrals({ schemaVersion: 1, deferrals: [{ ...deferrals.deferrals[0], reviewed: "2026-02-30" }] })).toThrow("invalid or incomplete");
  expect(() => validateDeferrals({ schemaVersion: 1, deferrals: [deferrals.deferrals[0], { ...deferrals.deferrals[0], latest: "2.1.0" }] })).toThrow("duplicate workspace/package");
  expect(evaluateFreshness("root", [{ package: "pkg", current: "1.0.0", update: "1.1.0", latest: "2.1.0" }], validateDeferrals(deferrals))[0].status).toBe("attention");
  const failed = checkFreshness("/repo", validateDeferrals(deferrals), () => ({ exitCode: 1, stdout: "", stderr: "offline" }));
  expect(failed.status).toBe("check-failure");
  expect(renderReport(failed)).toContain("offline");
  expect(renderReport(checkFailure("invalid deferrals\nwith detail"))).toContain("invalid deferrals with detail");
});
