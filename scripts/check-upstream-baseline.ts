import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export interface UpstreamBaseline {
  schemaVersion: 2;
  upstream: { repository: string; remote: string; branch: string };
  reviewed: { mainCommit: string; latestPullRequest: number; latestNonPullRequestIssue: number; branches: Array<{ name: string; commit: string }> };
  reviewedAt: string;
  status: "reviewed-not-merged";
}
export interface UpstreamInventory { mainCommit?: string; pullRequestNumbers?: number[]; nonPullRequestIssueNumbers?: number[]; branches?: Array<{ name: string; commit: string }> }
export type AxisStatus = "current" | "attention" | "unavailable";
export interface UpstreamEvaluation { status: "current" | "attention" | "check-failure"; axes: Record<"main" | "pullRequests" | "issues" | "branches", AxisStatus> }
export interface CommandResult { exitCode: number; stdout: string; stderr: string }
export type CommandRunner = (command: string, args: string[], cwd: string) => CommandResult;

const COMMIT = /^[0-9a-f]{40}$/;
const REPOSITORY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const REMOTE_NAME = /^[A-Za-z0-9_.-]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const isString = (value: unknown, pattern: RegExp): value is string => typeof value === "string" && pattern.test(value);
const isDate = (value: unknown): value is string => isString(value, DATE) && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
export function isBranchName(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value !== "@" && !value.startsWith("/") && !value.endsWith("/") && !value.endsWith(".") && !value.includes("..") && !value.includes("@{") && !/[\\\s\x00-\x1f\x7f~^:?*\[]/.test(value) && value.split("/").every((segment) => segment !== "" && segment !== "." && segment !== ".." && !segment.startsWith(".") && !segment.endsWith(".lock"));
}

export function validateBaseline(value: unknown): UpstreamBaseline {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Upstream baseline must be a JSON object.");
  const baseline = value as Record<string, unknown>, upstream = baseline.upstream as Record<string, unknown> | undefined, reviewed = baseline.reviewed as Record<string, unknown> | undefined;
  const branches = reviewed?.branches;
  if (baseline.schemaVersion !== 2 || !upstream || !reviewed || !isString(upstream.repository, REPOSITORY) || !isString(upstream.remote, REMOTE_NAME) || !isBranchName(upstream.branch) || !isString(reviewed.mainCommit, COMMIT) || !Number.isSafeInteger(reviewed.latestPullRequest) || (reviewed.latestPullRequest as number) < 1 || !Number.isSafeInteger(reviewed.latestNonPullRequestIssue) || (reviewed.latestNonPullRequestIssue as number) < 1 || !Array.isArray(branches) || branches.length === 0 || !branches.every((branch) => { const item = branch as Record<string, unknown>; return isBranchName(item.name) && isString(item.commit, COMMIT); }) || !isDate(baseline.reviewedAt) || baseline.status !== "reviewed-not-merged") throw new Error("Upstream baseline is invalid or incomplete; refusing to continue.");
  return baseline as unknown as UpstreamBaseline;
}

export function readBaseline(path: string): UpstreamBaseline {
  try { return validateBaseline(JSON.parse(readFileSync(path, "utf8"))); }
  catch (error) { throw new Error(`Cannot read valid upstream baseline at ${path}: ${error instanceof Error ? error.message : String(error)}`); }
}

const latest = (numbers: number[]) => numbers.length ? Math.max(...numbers) : undefined;
const validBranches = (branches: Array<{ name: string; commit: string }>) => branches.length > 0 && branches.every((branch) => isBranchName(branch.name) && isString(branch.commit, COMMIT));

export function evaluateUpstream(baseline: UpstreamBaseline, inventory: UpstreamInventory): UpstreamEvaluation {
  const axes: UpstreamEvaluation["axes"] = { main: "unavailable", pullRequests: "unavailable", issues: "unavailable", branches: "unavailable" };
  if (isString(inventory.mainCommit, COMMIT)) axes.main = inventory.mainCommit === baseline.reviewed.mainCommit ? "current" : "attention";
  if (Array.isArray(inventory.pullRequestNumbers) && inventory.pullRequestNumbers.every((number) => Number.isSafeInteger(number) && number > 0)) axes.pullRequests = latest(inventory.pullRequestNumbers) === baseline.reviewed.latestPullRequest ? "current" : "attention";
  if (Array.isArray(inventory.nonPullRequestIssueNumbers) && inventory.nonPullRequestIssueNumbers.every((number) => Number.isSafeInteger(number) && number > 0)) axes.issues = latest(inventory.nonPullRequestIssueNumbers) === baseline.reviewed.latestNonPullRequestIssue ? "current" : "attention";
  if (Array.isArray(inventory.branches) && validBranches(inventory.branches)) {
    const observed = [...inventory.branches].sort((a, b) => a.name.localeCompare(b.name));
    const reviewed = [...baseline.reviewed.branches].sort((a, b) => a.name.localeCompare(b.name));
    axes.branches = JSON.stringify(observed) === JSON.stringify(reviewed) ? "current" : "attention";
  }
  const states = Object.values(axes);
  return { status: states.includes("unavailable") ? "check-failure" : states.includes("attention") ? "attention" : "current", axes };
}

const defaultRunner: CommandRunner = (command, args, cwd) => { const result = Bun.spawnSync([command, ...args], { cwd, stdout: "pipe", stderr: "pipe" }); return { exitCode: result.exitCode, stdout: result.stdout.toString(), stderr: result.stderr.toString() }; };
function runJson<T>(runner: CommandRunner, cwd: string, args: string[]): T {
  const result = runner("gh", args, cwd);
  if (result.exitCode !== 0) throw new Error(`GitHub inventory unavailable: ${result.stderr.trim() || "gh failed"}`);
  try { return JSON.parse(result.stdout) as T; } catch { throw new Error("GitHub inventory unavailable: malformed JSON response."); }
}

function runPagedJson<T>(runner: CommandRunner, cwd: string, args: string[]): T[] {
  const pages = runJson<unknown>(runner, cwd, ["api", "-X", "GET", "--paginate", "--slurp", ...args]);
  if (!Array.isArray(pages) || pages.length === 0 || !pages.every(Array.isArray)) {
    throw new Error("GitHub branch inventory unavailable: pagination was malformed or incomplete.");
  }
  return pages.flat() as T[];
}

function validSearchResponse(value: unknown): value is { incomplete_results: false; items: Array<{ number?: unknown }> } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const search = value as { incomplete_results?: unknown; items?: unknown };
  return search.incomplete_results === false && Array.isArray(search.items);
}

export function readUpstreamInventory(baseline: UpstreamBaseline, runner: CommandRunner = defaultRunner, cwd = resolve(import.meta.dir, "..")): UpstreamInventory {
  const repo = baseline.upstream.repository;
  const main = runJson<{ object?: { sha?: unknown } }>(runner, cwd, ["api", "-X", "GET", `repos/${repo}/git/ref/heads/${baseline.upstream.branch}`]);
  const pulls = runJson<unknown>(runner, cwd, ["api", "-X", "GET", `search/issues?q=repo:${repo}+is:pr&sort=created&order=desc&per_page=1`]);
  const issues = runJson<unknown>(runner, cwd, ["api", "-X", "GET", `search/issues?q=repo:${repo}+is:issue&sort=created&order=desc&per_page=1`]);
  const branches = runPagedJson<{ name?: unknown; commit?: { sha?: unknown } }>(runner, cwd, [`repos/${repo}/branches?per_page=100`]);
  if (!isString(main.object?.sha, COMMIT) || !validSearchResponse(pulls) || !validSearchResponse(issues)) throw new Error("GitHub inventory unavailable: malformed or incomplete axis response.");
  const pullRequestNumbers = pulls.items.map((item) => item.number).filter((item): item is number => typeof item === "number" && Number.isSafeInteger(item) && item > 0);
  const nonPullRequestIssueNumbers = issues.items.map((item) => item.number).filter((item): item is number => typeof item === "number" && Number.isSafeInteger(item) && item > 0);
  const branchInventory = branches.map((item) => ({ name: item.name, commit: item.commit?.sha })).filter((item): item is { name: string; commit: string } => isBranchName(item.name) && isString(item.commit, COMMIT));
  if (pullRequestNumbers.length !== pulls.items.length || nonPullRequestIssueNumbers.length !== issues.items.length || branchInventory.length !== branches.length) throw new Error("GitHub inventory unavailable: malformed axis item.");
  return { mainCommit: main.object.sha, pullRequestNumbers, nonPullRequestIssueNumbers, branches: branchInventory };
}

export function renderReport(baseline: UpstreamBaseline, inventory: UpstreamInventory | undefined, evaluation: UpstreamEvaluation, detail?: string): string {
  const observed = inventory ? [inventory.mainCommit ?? "unavailable", latest(inventory.pullRequestNumbers ?? []) ?? "unavailable", latest(inventory.nonPullRequestIssueNumbers ?? []) ?? "unavailable", inventory.branches?.map((item) => `${item.name}@${item.commit}`).join(", ") ?? "unavailable"] : ["unavailable", "unavailable", "unavailable", "unavailable"];
  return ["# Upstream check", "", `Status: **${evaluation.status}**`, "", "| Axis | Reviewed | Observed | Status |", "| --- | --- | --- | --- |", `| main | ${baseline.reviewed.mainCommit} | ${observed[0]} | ${evaluation.axes.main} |`, `| pull requests | #${baseline.reviewed.latestPullRequest} | #${observed[1]} | ${evaluation.axes.pullRequests} |`, `| non-PR issues | #${baseline.reviewed.latestNonPullRequestIssue} | #${observed[2]} | ${evaluation.axes.issues} |`, `| branches | ${baseline.reviewed.branches.map((item) => `${item.name}@${item.commit}`).join(", ")} | ${observed[3]} | ${evaluation.axes.branches} |`, ...(detail ? ["", `Check detail: ${detail}`] : []), ""].join("\n");
}

function optionValue(name: string): string | undefined { const index = process.argv.indexOf(name); return index === -1 || process.argv[index + 1]?.startsWith("--") ? undefined : process.argv[index + 1]; }
async function main(): Promise<void> {
  const strict = process.argv.includes("--strict"), root = resolve(import.meta.dir, ".."), baseline = readBaseline(process.env.UPSTREAM_BASELINE_PATH || resolve(root, "tools", "upstream_baseline.json"));
  let inventory: UpstreamInventory | undefined, evaluation: UpstreamEvaluation, detail: string | undefined;
  try { inventory = readUpstreamInventory(baseline); evaluation = evaluateUpstream(baseline, inventory); } catch (error) { evaluation = { status: "check-failure", axes: { main: "unavailable", pullRequests: "unavailable", issues: "unavailable", branches: "unavailable" } }; detail = error instanceof Error ? error.message : String(error); }
  const report = renderReport(baseline, inventory, evaluation, detail); console.log(report);
  const output = optionValue("--output"); if (output) writeFileSync(resolve(output), report);
  if (process.argv.includes("--github-output")) { const path = optionValue("--github-output") || process.env.GITHUB_OUTPUT; if (!path) throw new Error("--github-output requires GITHUB_OUTPUT or a path."); appendFileSync(path, `upstream_status=${evaluation.status}\n`); }
  if (strict && evaluation.status !== "current") throw new Error(`Upstream check requires attention: ${evaluation.status}.`);
}
if (import.meta.main) await main();
