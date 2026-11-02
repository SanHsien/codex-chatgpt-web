import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface Deferral {
  package: string; url: string; vulnerable_versions: string; severity: string;
  reviewed: string; revisit: string; nodes: Record<string, string>; reason: string; reconsider: string;
}
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const date = (v: unknown): v is string => text(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;

export function evaluateAudit(exitCode: number, output: string, lock: string, policy: unknown, today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" })): string[] {
  if (!object(policy) || policy.schemaVersion !== 1 || !Array.isArray(policy.deferrals)) throw new Error("Invalid audit deferrals");
  const deferrals: Deferral[] = [];
  const keys = new Set<string>();
  for (const item of policy.deferrals) {
    if (!object(item) || ![item.package, item.url, item.vulnerable_versions, item.severity, item.reason, item.reconsider].every(text)
      || !date(item.reviewed) || !date(item.revisit) || item.reviewed > today || item.revisit <= today || item.reviewed >= item.revisit
      || !object(item.nodes) || !Object.keys(item.nodes).length || !Object.values(item.nodes).every(text)) throw new Error("Invalid or expired audit deferral");
    const key = `${item.package}:${item.url}`;
    if (keys.has(key)) throw new Error("Duplicate audit deferral");
    keys.add(key);
    deferrals.push(item as unknown as Deferral);
  }
  if (exitCode !== 0 && exitCode !== 1) throw new Error(`Bun audit failed (${exitCode})`);
  const audit: unknown = JSON.parse(output);
  const parsedLock = Bun.JSON5.parse(lock);
  if (!object(audit) || !object(parsedLock) || !object(parsedLock.packages)) throw new Error("Malformed audit or lockfile");
  const packages = parsedLock.packages;
  const messages: string[] = [];
  for (const [name, findings] of Object.entries(audit)) {
    if (!Array.isArray(findings) || !findings.length) throw new Error("Malformed audit findings");
    for (const finding of findings) {
      if (!object(finding) || !text(finding.url) || !text(finding.vulnerable_versions) || !text(finding.severity)) throw new Error("Malformed advisory");
      const rule = deferrals.find((d) => d.package === name && d.url === finding.url && d.vulnerable_versions === finding.vulnerable_versions && d.severity === finding.severity);
      if (!rule) throw new Error(`Undeferred advisory: ${name} ${finding.url}`);
      const affected: Record<string, string> = {};
      for (const [node, entry] of Object.entries(packages)) {
        if (node !== name && !node.endsWith(`/${name}`)) continue;
        if (!Array.isArray(entry) || !text(entry[0]) || !entry[0].startsWith(`${name}@`)) throw new Error("Malformed locked package");
        const version = entry[0].slice(name.length + 1);
        if (Bun.semver.satisfies(version, finding.vulnerable_versions)) affected[node] = version;
      }
      const entries = Object.entries(affected);
      if (!entries.length || entries.length !== Object.keys(rule.nodes).length || entries.some(([node, version]) => rule.nodes[node] !== version)) throw new Error(`Affected lock nodes changed: ${name}`);
      messages.push(`DEFERRED ${finding.url}: ${entries.length} exact lock nodes; revisit ${rule.revisit}. ${rule.reason}`);
    }
  }
  if (!messages.length && exitCode !== 0) throw new Error("Bun audit failed without advisory data");
  if (messages.length && exitCode !== 1) throw new Error("Inconsistent Bun audit exit code");
  return messages;
}

if (import.meta.main) {
  try {
    const root = resolve(import.meta.dir, "..");
    const result = Bun.spawnSync([process.execPath, "audit", "--json"], { cwd: resolve(root, "launcher"), stdout: "pipe", stderr: "pipe" });
    const messages = evaluateAudit(result.exitCode, result.stdout.toString(), readFileSync(resolve(root, "launcher/bun.lock"), "utf8"), JSON.parse(readFileSync(resolve(root, ".github/audit-deferrals.json"), "utf8")));
    console.log(messages.length ? messages.join("\n") : "Launcher audit: no vulnerabilities");
    console.log("LAUNCHER_AUDIT_OK");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
