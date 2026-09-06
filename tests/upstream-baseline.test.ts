import { expect, test } from "bun:test";
import { evaluateUpstream, isBranchName, readUpstreamInventory, validateBaseline, type UpstreamBaseline } from "../scripts/check-upstream-baseline";

const sha = "c648c09501bb1b704c7ad5273fb5f5d6b8992dd2";
const baseline: UpstreamBaseline = { schemaVersion: 2, upstream: { repository: "miuuyy/codex-chatgpt-web", remote: "upstream", branch: "main" }, reviewed: { mainCommit: sha, latestPullRequest: 343, latestNonPullRequestIssue: 346, branches: [{ name: "main", commit: sha }] }, reviewedAt: "2026-09-06", status: "reviewed-not-merged" };
const inventory = { mainCommit: sha, pullRequestNumbers: [343], nonPullRequestIssueNumbers: [346], branches: [{ name: "main", commit: sha }] };

test("accepts a complete four-axis reviewed inventory", () => {
  expect(validateBaseline(baseline)).toEqual(baseline);
  expect(evaluateUpstream(baseline, inventory).status).toBe("current");
});

test("fails closed for incomplete baselines and unavailable inventory", () => {
  expect(() => validateBaseline({ ...baseline, reviewed: { ...baseline.reviewed, branches: [] } })).toThrow("invalid or incomplete");
  expect(evaluateUpstream(baseline, { ...inventory, branches: undefined }).status).toBe("check-failure");
  expect(evaluateUpstream(baseline, { ...inventory, pullRequestNumbers: [] }).status).toBe("attention");
});

test("reports attention on every changed axis", () => {
  expect(evaluateUpstream(baseline, { ...inventory, mainCommit: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" }).axes.main).toBe("attention");
  expect(evaluateUpstream(baseline, { ...inventory, pullRequestNumbers: [344] }).axes.pullRequests).toBe("attention");
  expect(evaluateUpstream(baseline, { ...inventory, nonPullRequestIssueNumbers: [347] }).axes.issues).toBe("attention");
  expect(evaluateUpstream(baseline, { ...inventory, branches: [{ name: "next", commit: sha }] }).axes.branches).toBe("attention");
});

test("accepts slash-separated branches but rejects unsafe refs", () => {
  const featureBaseline: UpstreamBaseline = { ...baseline, upstream: { ...baseline.upstream, branch: "feature/x" }, reviewed: { ...baseline.reviewed, branches: [{ name: "feature/x", commit: sha }] } };
  expect(validateBaseline(featureBaseline).upstream.branch).toBe("feature/x");
  expect(evaluateUpstream(featureBaseline, { ...inventory, branches: [{ name: "feature/x", commit: sha }] }).status).toBe("current");
  expect(evaluateUpstream(featureBaseline, { ...inventory, branches: [{ name: "feature/y", commit: sha }] }).axes.branches).toBe("attention");
  for (const invalid of ["", "@", "/feature", "feature/", "feature//x", "feature/../x", "feature..x", "feature x", "feature@{x", ".hidden/x", "feature/.hidden", "feature/x.lock"]) expect(isBranchName(invalid)).toBe(false);
  expect(() => validateBaseline({ ...baseline, upstream: { ...baseline.upstream, branch: "feature//x" } })).toThrow("invalid or incomplete");
});

test("does not treat malformed GitHub output as zero findings", () => {
  const runner = () => ({ exitCode: 0, stdout: "{}", stderr: "" });
  expect(() => readUpstreamInventory(baseline, runner)).toThrow("unavailable");
});

test("fails closed on incomplete search and consumes every branch page", () => {
  const runner = (_command: string, args: string[]) => {
    const endpoint = args.at(-1) ?? "";
    if (endpoint.includes("git/ref")) return { exitCode: 0, stdout: JSON.stringify({ object: { sha } }), stderr: "" };
    if (endpoint.includes("is:pr")) return { exitCode: 0, stdout: JSON.stringify({ incomplete_results: false, items: [{ number: 343 }] }), stderr: "" };
    if (endpoint.includes("is:issue")) return { exitCode: 0, stdout: JSON.stringify({ incomplete_results: false, items: [{ number: 346 }] }), stderr: "" };
    return { exitCode: 0, stdout: JSON.stringify([[{ name: "main", commit: { sha } }], [{ name: "feature/x", commit: { sha } }]]), stderr: "" };
  };
  const multiPageBaseline: UpstreamBaseline = { ...baseline, reviewed: { ...baseline.reviewed, branches: [{ name: "main", commit: sha }, { name: "feature/x", commit: sha }] } };
  expect(readUpstreamInventory(multiPageBaseline, runner).branches).toEqual(multiPageBaseline.reviewed.branches);
  expect(() => readUpstreamInventory(baseline, (_command, args) => {
    const endpoint = args.at(-1) ?? "";
    if (endpoint.includes("git/ref")) return { exitCode: 0, stdout: JSON.stringify({ object: { sha } }), stderr: "" };
    if (endpoint.includes("is:pr")) return { exitCode: 0, stdout: JSON.stringify({ incomplete_results: true, items: [{ number: 343 }] }), stderr: "" };
    if (endpoint.includes("is:issue")) return { exitCode: 0, stdout: JSON.stringify({ incomplete_results: false, items: [{ number: 346 }] }), stderr: "" };
    return { exitCode: 0, stdout: JSON.stringify([[{ name: "main", commit: { sha } }]]), stderr: "" };
  })).toThrow("incomplete axis response");
  expect(() => readUpstreamInventory(baseline, (_command, args) => {
    const endpoint = args.at(-1) ?? "";
    if (endpoint.includes("git/ref")) return { exitCode: 0, stdout: JSON.stringify({ object: { sha } }), stderr: "" };
    if (endpoint.includes("is:pr")) return { exitCode: 0, stdout: JSON.stringify({ incomplete_results: false, items: [{ number: 343 }] }), stderr: "" };
    if (endpoint.includes("is:issue")) return { exitCode: 0, stdout: JSON.stringify({ incomplete_results: false, items: [{ number: 346 }] }), stderr: "" };
    return { exitCode: 0, stdout: JSON.stringify([{ name: "main", commit: { sha } }]), stderr: "" };
  })).toThrow("pagination was malformed or incomplete");
});
