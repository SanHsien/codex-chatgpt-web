import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface UpstreamBaseline {
  schemaVersion: 1;
  upstream: {
    repository: string;
    remote: string;
    branch: string;
  };
  reviewedCommit: string;
  reviewedAt: string;
  status: "reviewed-not-merged";
}

export type UpstreamStatus = "current" | "drift";

const COMMIT = /^[0-9a-f]{40}$/;
const REPOSITORY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const NAME = /^[A-Za-z0-9_.-]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function matches(value: unknown, pattern: RegExp): value is string {
  return typeof value === "string" && pattern.test(value);
}

function isCanonicalDate(value: unknown): value is string {
  if (!matches(value, DATE)) return false;
  return new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

export function validateBaseline(value: unknown): UpstreamBaseline {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Upstream baseline must be a JSON object.");
  }
  const baseline = value as Record<string, unknown>;
  const upstream = baseline.upstream as Record<string, unknown> | undefined;
  if (
    baseline.schemaVersion !== 1 ||
    !upstream ||
    !matches(upstream.repository, REPOSITORY) ||
    !matches(upstream.remote, NAME) ||
    !matches(upstream.branch, NAME) ||
    !matches(baseline.reviewedCommit, COMMIT) ||
    !isCanonicalDate(baseline.reviewedAt) ||
    baseline.status !== "reviewed-not-merged"
  ) {
    throw new Error("Upstream baseline is invalid or incomplete; refusing to continue.");
  }
  return baseline as unknown as UpstreamBaseline;
}

export function readBaseline(path: string): UpstreamBaseline {
  try {
    return validateBaseline(JSON.parse(readFileSync(path, "utf8")));
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot read valid upstream baseline at ${path}: ${detail}`);
  }
}

export function evaluateUpstream(baseline: UpstreamBaseline, observedCommit: string): UpstreamStatus {
  if (!COMMIT.test(observedCommit)) {
    throw new Error("Upstream returned an invalid main commit; refusing to continue.");
  }
  return baseline.reviewedCommit === observedCommit ? "current" : "drift";
}

async function readUpstreamTip(remote: string, branch: string): Promise<string> {
  const result = Bun.spawnSync(["git", "ls-remote", remote, `refs/heads/${branch}`], {
    cwd: resolve(import.meta.dir, ".."),
    stdout: "pipe",
    stderr: "pipe",
  });
  if (result.exitCode !== 0) {
    throw new Error(`Could not read ${remote}/${branch}: ${result.stderr.toString().trim()}`);
  }
  const line = result.stdout.toString().trim();
  const match = /^([0-9a-f]{40})\trefs\/heads\/[A-Za-z0-9_.-]+$/.exec(line);
  if (!match) throw new Error(`Unexpected upstream reference output: ${line || "<empty>"}`);
  return match[1];
}

async function main(): Promise<void> {
  const strict = process.argv.includes("--strict");
  const path = process.env.UPSTREAM_BASELINE_PATH || resolve(import.meta.dir, "..", "tools", "upstream_baseline.json");
  const baseline = readBaseline(path);
  const tip = await readUpstreamTip(baseline.upstream.remote, baseline.upstream.branch);
  const status = evaluateUpstream(baseline, tip);
  console.log(`UPSTREAM_BASELINE=${baseline.reviewedCommit}`);
  console.log(`UPSTREAM_TIP=${tip}`);
  console.log(`UPSTREAM_STATUS=${status}`);
  if (strict && status === "drift") {
    throw new Error("Upstream drift detected. Review and record a decision before advancing the baseline.");
  }
}

if (import.meta.main) {
  await main();
}
