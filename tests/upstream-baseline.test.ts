import { expect, test } from "bun:test";
import { evaluateUpstream, isBranchName, readUpstreamInventory, validateBaseline, type UpstreamBaseline } from "../scripts/check-upstream-baseline";

const sha = "c648c09501bb1b704c7ad5273fb5f5d6b8992dd2";
const baseline: UpstreamBaseline = { schemaVersion: 2, upstream: { repository: "miuuyy/codex-chatgpt-web", remote: "upstream", branch: "main" }, reviewed: { mainCommit: sha, latestPullRequest: 343, latestNonPullRequestIssue: 345, branches: [{ name: "main", commit: sha }] }, reviewedAt: "2026-09-06", status: "reviewed-not-merged" };
const inventory = { mainCommit: sha, pullRequestNumbers: [343], nonPullRequestIssueNumbers: [345], branches: [{ name: "main", commit: sha }] };

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
  expect(evaluateUpstream(baseline, { ...inventory, nonPullRequestIssueNumbers: [346] }).axes.issues).toBe("attention");
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
  expect(() => readUpstreamInventory(baseline, runner)).toThrow("malformed axis response");
});
