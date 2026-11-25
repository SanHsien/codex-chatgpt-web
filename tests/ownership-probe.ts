import type { Locator } from "playwright-core";
import { ownerOf } from "../src/adapters/chatgpt-web/turn-ownership";

/**
 * Test-only: runs the production evidence probe (expansion, token or exact-text read) on one
 * group and asks ownerOf whether that group alone proves ownership of the submission.
 */
export async function matchesSubmission(worker: any, group: Locator | object, submitted: string, signal?: AbortSignal, token?: string): Promise<boolean> {
  const baseline = { initialTurnIdentities: [], submittedText: submitted, turnToken: token };
  const user = await worker.withExpandedUserMessage(group, (content: Locator) =>
    worker.probeUserEvidence(content, baseline, { identity: "group:user:probe" }, signal), signal);
  return user !== undefined && ownerOf({ users: [user], responses: [] }, baseline) !== undefined;
}

/** A detached assistant binding for a transient shell group; first binding never creates one without proof. */
export function shellBinding(page: any, key = "pending") {
  return {
    identity: `group:assistant:${key}`,
    locator: page.locator(`[data-turn-key=${JSON.stringify(key)}] [data-conversation-role="assistant"]`),
  };
}
