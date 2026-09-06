import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export interface DeferredDependency { workspace: "root" | "launcher"; package: string; latest: string; reviewed: string; reason: string }
export interface Deferrals { schemaVersion: 1; deferrals: DeferredDependency[] }
export interface CommandResult { exitCode: number; stdout: string; stderr: string }
export type CommandRunner = (command: string, args: string[], cwd: string) => CommandResult;
export interface OutdatedDependency { package: string; current: string; update: string; latest: string }
export interface FreshnessRow extends OutdatedDependency { workspace: "root" | "launcher"; status: "deferred" | "attention" }
export interface FreshnessResult { rows: FreshnessRow[]; outdatedChecks: Array<{ workspace: "root" | "launcher"; status: "current" | "check-failure"; detail: string }>; audits: Array<{ workspace: "root" | "launcher"; status: "clean" | "check-failure"; detail: string }>; status: "current" | "attention" | "check-failure"; checkDetail?: string }

const isText = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const isDate = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
const detail = (value: string) => value.replace(/[\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 240) || "checker failed";

export function validateDeferrals(value: unknown): Deferrals {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Dependency deferrals must be a JSON object.");
  const parsed = value as Record<string, unknown>, items = parsed.deferrals;
  if (parsed.schemaVersion !== 1 || !Array.isArray(items) || !items.every((item) => { const entry = item as Record<string, unknown>; return (entry.workspace === "root" || entry.workspace === "launcher") && isText(entry.package) && isText(entry.latest) && isDate(entry.reviewed) && isText(entry.reason); })) throw new Error("Dependency deferrals are invalid or incomplete; refusing to continue.");
  const keys = new Set<string>();
  for (const item of items as Array<Record<string, unknown>>) {
    const key = `${item.workspace}\u0000${item.package}`;
    if (keys.has(key)) throw new Error("Dependency deferrals contain duplicate workspace/package entries; refusing to continue.");
    keys.add(key);
  }
  return parsed as unknown as Deferrals;
}

export function parseBunOutdated(output: string): OutdatedDependency[] {
  const rows: OutdatedDependency[] = [];
  for (const line of output.split(/\r?\n/)) {
    if (!line.startsWith("|") || /^\|[-|]+\|$/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 4 || cells[0] === "Package") continue;
    if (!cells.every(isText)) throw new Error("Bun outdated returned a malformed table row.");
    rows.push({ package: cells[0].replace(/ \(dev\)$/, ""), current: cells[1], update: cells[2], latest: cells[3] });
  }
  if (!/bun outdated v1\.4\.0/.test(output)) throw new Error("Bun outdated output is unavailable or not from pinned Bun 1.4.0.");
  return rows;
}

export function evaluateFreshness(workspace: "root" | "launcher", outdated: OutdatedDependency[], deferrals: Deferrals): FreshnessRow[] {
  return outdated.map((item) => {
    const deferred = deferrals.deferrals.find((entry) => entry.workspace === workspace && entry.package === item.package && entry.latest === item.latest);
    return { workspace, ...item, status: deferred ? "deferred" : "attention" };
  });
}

const defaultRunner: CommandRunner = (command, args, cwd) => { const result = Bun.spawnSync([command, ...args], { cwd, stdout: "pipe", stderr: "pipe" }); return { exitCode: result.exitCode, stdout: result.stdout.toString(), stderr: result.stderr.toString() }; };
export function checkFreshness(root: string, deferrals: Deferrals, runner: CommandRunner = defaultRunner): FreshnessResult {
  const rows: FreshnessRow[] = [], outdatedChecks: FreshnessResult["outdatedChecks"] = [], audits: FreshnessResult["audits"] = [];
  let failed = false;
  for (const workspace of ["root", "launcher"] as const) {
    const cwd = workspace === "root" ? root : resolve(root, "launcher"), outdated = runner("bun", ["outdated", "--json"], cwd), audit = runner("bun", ["audit"], cwd);
    try {
      if (outdated.exitCode !== 0) throw new Error(outdated.stderr.trim() || "bun outdated failed");
      rows.push(...evaluateFreshness(workspace, parseBunOutdated(outdated.stdout), deferrals));
      outdatedChecks.push({ workspace, status: "current", detail: "Bun outdated parsed" });
    } catch (error) { failed = true; outdatedChecks.push({ workspace, status: "check-failure", detail: detail(error instanceof Error ? error.message : String(error)) }); }
    audits.push({ workspace, status: audit.exitCode === 0 ? "clean" : "check-failure", detail: audit.exitCode === 0 ? "Bun audit passed" : detail(audit.stderr || audit.stdout || "bun audit failed") });
    if (audit.exitCode !== 0) failed = true;
  }
  return { rows, outdatedChecks, audits, status: failed ? "check-failure" : rows.some((row) => row.status === "attention") ? "attention" : "current" };
}

export function checkFailure(message: string): FreshnessResult {
  return { rows: [], outdatedChecks: [], audits: [], status: "check-failure", checkDetail: detail(message) };
}

export function renderReport(result: FreshnessResult): string {
  return ["# Dependency freshness", "", `Status: **${result.status}**`, ...(result.checkDetail ? ["", `Check detail: ${result.checkDetail.replace(/\|/g, "\\|")}`] : []), "", "| Workspace | Package | Current | Update | Latest | Status |", "| --- | --- | --- | --- | --- | --- |", ...result.rows.map((row) => `| ${row.workspace} | ${row.package} | ${row.current} | ${row.update} | ${row.latest} | ${row.status} |`), "", "| Workspace | Bun outdated | Detail |", "| --- | --- | --- |", ...result.outdatedChecks.map((check) => `| ${check.workspace} | ${check.status} | ${check.detail.replace(/\|/g, "\\|")} |`), "", "| Workspace | Bun audit | Detail |", "| --- | --- | --- |", ...result.audits.map((audit) => `| ${audit.workspace} | ${audit.status} | ${audit.detail.replace(/\|/g, "\\|")} |`), ""].join("\n");
}

function optionValue(name: string): string | undefined { const index = process.argv.indexOf(name); return index === -1 || process.argv[index + 1]?.startsWith("--") ? undefined : process.argv[index + 1]; }
async function main(): Promise<void> {
  const root = resolve(import.meta.dir, ".."), strict = process.argv.includes("--strict");
  let result: FreshnessResult;
  try { result = checkFreshness(root, validateDeferrals(JSON.parse(readFileSync(process.env.DEPENDENCY_DEFERRALS_PATH || resolve(root, ".github", "dependency-deferrals.json"), "utf8")))); }
  catch (error) { result = checkFailure(error instanceof Error ? error.message : String(error)); console.error(result.checkDetail); }
  const report = renderReport(result); console.log(report);
  const output = optionValue("--output"); if (output) writeFileSync(resolve(output), report);
  if (process.argv.includes("--github-output")) { const path = optionValue("--github-output") || process.env.GITHUB_OUTPUT; if (!path) throw new Error("--github-output requires GITHUB_OUTPUT or a path."); appendFileSync(path, `dependency_status=${result.status}\n`); }
  if (strict && result.status !== "current") throw new Error(`Dependency freshness requires attention: ${result.status}.`);
}
if (import.meta.main) await main();
