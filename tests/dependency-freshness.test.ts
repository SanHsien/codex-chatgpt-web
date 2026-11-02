import { expect, test } from "bun:test";
import { checkFailure, checkFreshness, evaluateFreshness, parseBunOutdated, renderReport, validateDeferrals } from "../scripts/check-dependency-freshness";

const table = "bun outdated v1.4.2 (34cbb9a40)\n| Package | Current | Update | Latest |\n|---|---|---|---|\n| pkg (dev) | 1.0.0 | 1.1.0 | 2.0.0 |\n";
const deferrals = { schemaVersion: 1, deferrals: [{ workspace: "root", package: "pkg", latest: "2.0.0", reviewed: "2026-09-06", reason: "Requires packaged desktop verification." }] } as const;

test("version-line deferrals honor numeric component precision and workspace scope", () => {
  for (const [prefix, inside, outside] of [
    ["3", ["3.0.0", "3.8.9-2", "3.99.0+build"], ["4.0.0", "30.0.0"]],
    ["3.8", ["3.8.0", "3.8.99-2"], ["3.9.0", "3.80.0"]],
    ["3.8.9", ["3.8.9", "3.8.9-2", "3.8.9+build"], ["3.8.10", "3.8.90"]],
  ] as const) {
    const policy = validateDeferrals({ schemaVersion: 1, deferrals: [{ workspace: "root", package: "pkg", latestPrefix: prefix, reviewed: "2026-11-03", reason: "Incompatible version line." }] });
    const status = (latest: string, workspace: "root" | "launcher" = "root", name = "pkg") => evaluateFreshness(workspace, [{ package: name, current: "1.0.0", update: "1.0.0", latest }], policy)[0].status;
    for (const latest of inside) expect(status(latest)).toBe("deferred");
    for (const latest of [...outside, "garbage", "3.8", "v3.8.9", "3.8.9junk"]) expect(status(latest)).toBe("attention");
    expect(status(inside[0], "launcher")).toBe("attention");
    expect(status(inside[0], "root", "other")).toBe("attention");
  }
});

test("deferral bounds reject missing, ambiguous and malformed prefixes", () => {
  const base = { workspace: "root", package: "pkg", reviewed: "2026-11-03", reason: "Reviewed." };
  for (const bound of [{}, { latest: "3.8.9", latestPrefix: "3" }, ...["", "03", "3.", "3.08", "3.8.9.1", "3.8.x", ">=3", "3-rc", 3, null].map(latestPrefix => ({ latestPrefix }))]) {
    expect(() => validateDeferrals({ schemaVersion: 1, deferrals: [{ ...base, ...bound }] })).toThrow("invalid or incomplete");
  }
});

test("parses Bun 1.4 text tables and applies exact-version deferrals", () => {
  expect(parseBunOutdated(table)).toEqual([{ package: "pkg", current: "1.0.0", update: "1.1.0", latest: "2.0.0" }]);
  expect(evaluateFreshness("root", parseBunOutdated(table), validateDeferrals(deferrals))[0].status).toBe("deferred");
  expect(evaluateFreshness("root", [{ package: "pkg", current: "1.0.0", update: "1.1.0", latest: "2.1.0" }], validateDeferrals(deferrals))[0].status).toBe("attention");
});

test("checks both workspaces and audits with an injected command runner", () => {
  const clean = "bun outdated v1.4.2 (34cbb9a40)\n| Package | Current | Update | Latest |\n|---|---|---|---|\n";
  const result = checkFreshness("/repo", validateDeferrals(deferrals), (_command, args, cwd) => ({ exitCode: 0, stdout: args[0] === "audit" ? "No vulnerabilities" : (cwd === "/repo" ? table : clean), stderr: "" }));
  expect(result.status).toBe("current");
  expect(result.outdatedChecks).toHaveLength(2);
  expect(result.audits).toHaveLength(2);
  expect(result.rows[0].status).toBe("deferred");
});

test("launcher freshness runs its policy-aware audit script and propagates failures", () => {
  const calls: string[][] = [];
  const clean = "bun outdated v1.4.2\n";
  const result = checkFreshness("/repo", validateDeferrals(deferrals), (_command, args) => {
    calls.push(args);
    return { exitCode: args[0] === "run" ? 1 : 0, stdout: clean, stderr: args[0] === "run" ? "Undeferred advisory" : "" };
  });
  expect(calls).toContainEqual(["audit"]);
  expect(calls).toContainEqual(["run", "audit"]);
  expect(result.status).toBe("check-failure");
  expect(result.audits[1].detail).toContain("Undeferred advisory");
});

test("freshness labels accepted security exceptions as deferred rather than clean", () => {
  const result = checkFreshness("/repo", validateDeferrals(deferrals), (_command, args) => ({
    exitCode: 0, stdout: args[0] === "run" ? "DEFERRED advisory: exact nodes; revisit deadline\nLAUNCHER_AUDIT_OK\n" : "bun outdated v1.4.2\n", stderr: "",
  }));
  expect(result.status).toBe("current");
  expect(result.audits[1].status).toBe("deferred");
  expect(renderReport(result)).toContain("DEFERRED advisory");
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

test("strips every Bun dependency-kind suffix so deferrals still match", () => {
  const kinds = ["dev", "peer", "optional"];
  const output = `bun outdated v1.4.2 (34cbb9a40)\n| Package | Current | Update | Latest |\n|---|---|---|---|\n${kinds.map((kind) => `| pkg-${kind} (${kind}) | 1.0.0 | 1.1.0 | 2.0.0 |`).join("\n")}\n`;
  expect(parseBunOutdated(output).map((row) => row.package)).toEqual(kinds.map((kind) => `pkg-${kind}`));
});

test("rejects non-object deferral entries with the documented error", () => {
  expect(() => validateDeferrals({ schemaVersion: 1, deferrals: [null] })).toThrow("invalid or incomplete");
  expect(() => validateDeferrals({ schemaVersion: 1, deferrals: ["pkg"] })).toThrow("invalid or incomplete");
});
