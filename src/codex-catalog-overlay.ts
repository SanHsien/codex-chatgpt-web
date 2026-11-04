import { existsSync, readFileSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import type { AppConfig } from "./config";
import { atomicWriteFile, getConfigDir, stripUtf8Bom } from "./config";
import {
  findTopLevelAssignment,
  parseDocument,
  readCodexModelContextOverride,
  renderDocument,
} from "./codex-integration-document";
import {
  getCodexConfigPath,
  snapshotFile,
  writeFileSnapshot,
  writeFilesWithCompensation,
} from "./codex-integration-shared";
import { augmentNativeModelCatalog } from "./model-catalog";

/**
 * Codex reads a pinned `model_catalog_json` file instead of asking the bridge for `/models`, so a
 * catalog pinned by another tool hides every Web model. While the bridge route is active, Codex is
 * pointed at a bridge-owned copy: the pinned catalog plus the Web rows. The pinned file itself is
 * never written, so the tool that owns it can keep re-syncing it; the bridge re-merges on change.
 *
 * This state is deliberately separate from the route journal. Restoring is lenient: the line is put
 * back only while it still names the merged copy, because a newer value belongs to someone else.
 */
interface CatalogOverlayJournal {
  version: 1;
  configPath: string;
  /** The pinned catalog line exactly as found, and the file it names (the merge source). */
  previous: { rawLine: string; value: string };
  installed: string;
}

export function getCodexCatalogOverlayPath(): string {
  return join(getConfigDir(), "codex", "catalog-overlay.json");
}

export function getMergedCodexCatalogPath(): string {
  return join(getConfigDir(), "codex", "model-catalog.json");
}

function samePath(left: string, right: string): boolean {
  const normalize = (value: string) => {
    const normalized = resolve(value);
    return process.platform === "win32" ? normalized.toLowerCase() : normalized;
  };
  return normalize(left) === normalize(right);
}

function readOverlay(): CatalogOverlayJournal | undefined {
  const path = getCodexCatalogOverlayPath();
  if (!existsSync(path)) return undefined;
  const value = JSON.parse(stripUtf8Bom(readFileSync(path, "utf8"))) as Partial<CatalogOverlayJournal>;
  if (value.version !== 1 || typeof value.configPath !== "string" || typeof value.installed !== "string"
    || typeof value.previous?.rawLine !== "string" || typeof value.previous?.value !== "string") {
    throw new Error(`Invalid Codex catalog overlay journal: ${path}`);
  }
  return value as CatalogOverlayJournal;
}

function mergedCatalog(sourcePath: string, config: AppConfig): string {
  const source = JSON.parse(stripUtf8Bom(readFileSync(sourcePath, "utf8"))) as unknown;
  const catalog = augmentNativeModelCatalog(source, config, readCodexModelContextOverride());
  return `${JSON.stringify(catalog, null, 2)}\n`;
}

function writeMerged(sourcePath: string, config: AppConfig): boolean {
  const path = getMergedCodexCatalogPath();
  const data = mergedCatalog(sourcePath, config);
  if (existsSync(path) && readFileSync(path, "utf8") === data) return false;
  atomicWriteFile(path, data);
  return true;
}

/** Point Codex at the merged catalog when its config pins one. Returns whether an overlay is in place. */
export function applyCodexCatalogOverlay(configValue: AppConfig | (() => AppConfig)): boolean {
  // Resolve lazily: most Codex configs pin no catalog and never need the bridge configuration.
  const config = () => typeof configValue === "function" ? configValue() : configValue;
  const configPath = getCodexConfigPath();
  if (!existsSync(configPath)) return false;
  const text = readFileSync(configPath, "utf8");
  const document = parseDocument(text);
  const current = findTopLevelAssignment(document.lines, "model_catalog_json");
  const merged = getMergedCodexCatalogPath();
  const existing = readOverlay();
  if (existing && current.value && samePath(current.value, merged)) {
    writeMerged(existing.previous.value, config());
    return true;
  }
  if (!current.present || current.index === undefined || !current.value || !current.rawLine) {
    if (existing) rmSync(getCodexCatalogOverlayPath(), { force: true });
    return false;
  }
  // A missing or unreadable pinned catalog would break Codex either way; leave the user's line.
  if (!existsSync(current.value)) return false;
  writeMerged(current.value, config());
  const overlay: CatalogOverlayJournal = {
    version: 1,
    configPath,
    previous: { rawLine: current.rawLine, value: current.value },
    installed: merged,
  };
  document.lines[current.index] = `model_catalog_json = ${JSON.stringify(merged)}`;
  writeFilesWithCompensation([
    { path: getCodexCatalogOverlayPath(), data: `${JSON.stringify(overlay, null, 2)}\n` },
    { path: configPath, data: renderDocument(document), followSymlink: true },
  ]);
  return true;
}

/** Put the pinned catalog line back and remove the bridge-owned copy. */
export function restoreCodexCatalogOverlay(): boolean {
  const overlay = readOverlay();
  if (!overlay) return false;
  if (existsSync(overlay.configPath)) {
    const snapshot = snapshotFile(overlay.configPath, { followSymlink: true });
    const document = parseDocument(snapshot.data?.toString("utf8") ?? "");
    const current = findTopLevelAssignment(document.lines, "model_catalog_json");
    if (current.index !== undefined && current.value && samePath(current.value, overlay.installed)) {
      document.lines[current.index] = overlay.previous.rawLine;
      writeFileSnapshot(snapshot, renderDocument(document));
    }
  }
  rmSync(overlay.installed, { force: true });
  rmSync(getCodexCatalogOverlayPath(), { force: true });
  return true;
}

/** Whether Codex still reads the merged catalog; `detached` means another tool re-pinned its own. */
export function inspectCodexCatalogOverlay(): "absent" | "active" | "detached" {
  const overlay = readOverlay();
  if (!overlay) return "absent";
  if (!existsSync(overlay.configPath)) return "detached";
  const current = findTopLevelAssignment(parseDocument(readFileSync(overlay.configPath, "utf8")).lines, "model_catalog_json");
  return current.value && samePath(current.value, overlay.installed) && existsSync(overlay.installed)
    ? "active"
    : "detached";
}

/**
 * Re-merge after the pinned catalog or the bridge configuration changed. A running bridge calls this
 * periodically; it never rewrites Codex config, only the bridge-owned merged copy.
 */
export function refreshCodexCatalogOverlay(config: AppConfig): "absent" | "unchanged" | "refreshed" {
  const overlay = readOverlay();
  if (!overlay || !existsSync(overlay.previous.value)) return "absent";
  return writeMerged(overlay.previous.value, config) ? "refreshed" : "unchanged";
}
