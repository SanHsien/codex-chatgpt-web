import { expect, test } from "bun:test";
import { evaluateAudit } from "../scripts/audit-launcher";

const finding = { url: "https://github.com/advisories/GHSA-example", vulnerable_versions: "<2", severity: "moderate" };
const output = JSON.stringify({ pkg: [finding] });
const lock = JSON.stringify({ packages: { "parent/pkg": ["pkg@1.0.0"] } });
const rule = { package: "pkg", ...finding, reviewed: "2026-11-01", revisit: "2026-11-17", nodes: { "parent/pkg": "1.0.0" }, reason: "Callable API blocks upgrade", reconsider: "Compatible parent release or deadline" };
const policy = { schemaVersion: 1, deferrals: [rule] };
const run = (code = 1, data = output, locked = lock, p: unknown = policy, day = "2026-11-03") => evaluateAudit(code, data, locked, p, day);

test("accepts only the reviewed advisory and exact affected lock nodes before the deadline", () => {
  expect(run()).toHaveLength(1);
  expect(run()[0]).toContain(rule.revisit);
  expect(run(0, "{}")).toEqual([]);
  // Patched nodes outside the vulnerable range do not broaden the exception.
  expect(run(1, output, JSON.stringify({ packages: { "parent/pkg": ["pkg@1.0.0"], pkg: ["pkg@2.0.0"] } }))).toHaveLength(1);
});

test("unknown advisories, changed severity/range, new vulnerable nodes and versions stay red", () => {
  for (const changed of [{ ...finding, url: "https://github.com/advisories/GHSA-other" }, { ...finding, severity: "high" }, { ...finding, vulnerable_versions: "<3" }]) {
    expect(() => run(1, JSON.stringify({ pkg: [changed] }))).toThrow("Undeferred");
  }
  expect(() => run(1, JSON.stringify({ pkg: [finding], other: [finding] }))).toThrow("Undeferred");
  for (const packages of [{ "parent/pkg": ["pkg@1.1.0"] }, { "parent/pkg": ["pkg@1.0.0"], pkg: ["pkg@1.0.0"] }, {}]) {
    expect(() => run(1, output, JSON.stringify({ packages }))).toThrow("lock nodes changed");
  }
});

test("expired, future-dated, incomplete and duplicate exceptions fail closed", () => {
  expect(() => run(1, output, lock, policy, rule.revisit)).toThrow("expired");
  for (const changed of [{ ...rule, reviewed: "2026-11-04" }, { ...rule, reason: "" }, { ...rule, reconsider: "" }, { ...rule, nodes: {} }, { ...rule, revisit: "2026-02-30" }]) {
    expect(() => run(1, output, lock, { ...policy, deferrals: [changed] })).toThrow("Invalid");
  }
  expect(() => run(1, output, lock, { ...policy, deferrals: [rule, rule] })).toThrow("Duplicate");
  expect(() => run(1, output, lock, {})).toThrow("Invalid");
});

test("network/process failures, inconsistent exits and malformed audit/lock data stay red", () => {
  for (const [code, data] of [[2, output], [1, "{}"], [0, output], [1, "offline"], [1, "[]"], [1, '{"pkg":[]}'], [1, '{"pkg":[null]}']] as const) {
    expect(() => run(code, data)).toThrow();
  }
  expect(() => run(1, output, "{}")).toThrow("Malformed");
  expect(() => run(1, output, '{"packages":{"parent/pkg":null}}')).toThrow("Malformed");
});
