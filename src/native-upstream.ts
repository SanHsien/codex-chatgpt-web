import type { AppConfig } from "./config";
import { readJournal } from "./codex-integration-journal";
import { routeUrl } from "./codex-integration-shared";
import { CHATGPT_CODEX_BACKEND } from "./native-passthrough";

export interface NativeCodexUpstream {
  url: string;
  source: "config" | "journal" | "default";
}

function sameRoute(left: string, right: string): boolean {
  return left.replace(/\/+$/, "").toLowerCase() === right.replace(/\/+$/, "").toLowerCase();
}

/**
 * Pick where non-Web models go. An explicit `nativeUpstreamUrl` wins; otherwise the route Codex
 * used before setup replaced it (recorded in the integration journal) keeps serving the models it
 * served before. Only when Codex had no custom route does traffic go to the official backend.
 */
export function resolveNativeCodexUpstream(
  config: Pick<AppConfig, "host" | "port"> & { nativeUpstreamUrl?: string },
): NativeCodexUpstream {
  if (config.nativeUpstreamUrl) return { url: config.nativeUpstreamUrl, source: "config" };
  const journal = readJournal();
  const previous = journal && journal.version !== 2 ? journal.previous.openai_base_url : undefined;
  if (previous?.present && previous.value && /^https?:\/\//i.test(previous.value)
    && !sameRoute(previous.value, routeUrl(config as AppConfig))) {
    return { url: previous.value, source: "journal" };
  }
  return { url: CHATGPT_CODEX_BACKEND, source: "default" };
}
