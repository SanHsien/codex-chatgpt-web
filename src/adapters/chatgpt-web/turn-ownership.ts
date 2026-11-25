export interface TurnUser {
  identity: string;
  /** Exact rendered text, or undefined when incomplete/unsupported. */
  text?: string;
  /** Set only after the DOM adapter verifies one fully rendered, bounded token. */
  token?: string;
  /**
   * Set only when the adapter read this user's complete, uncollapsed content and it conclusively
   * is not this Send (no token / different text). Never set from missing or truncated content.
   */
  foreign?: true;
}

export interface TurnObservation {
  /** Mounted user groups in document order. */
  users: TurnUser[];
  responses: readonly string[];
}

export interface TurnBaseline {
  initialTurnIdentities: readonly string[];
  submittedText?: string;
  turnToken?: string;
  acceptedUserIdentity?: string;
}

/** Upper bound of user groups whose content is read per observation. */
export const MAX_PROBED_USERS = 4;

const isUserGroup = (identity: string) => identity.startsWith("group:user:");

function lastBaselineUserPosition(observation: TurnObservation, baseline: TurnBaseline): number {
  return observation.users.findLastIndex(user => baseline.initialTurnIdentities.includes(user.identity));
}

/**
 * Which user groups are worth reading: non-baseline groups after the last mounted baseline user,
 * and only the last few of them. Our own user is the last user group (anything later aborts), so
 * hundreds of remounted history groups are never probed.
 */
export function probeTargets(observation: TurnObservation, baseline: TurnBaseline): string[] {
  const after = lastBaselineUserPosition(observation, baseline);
  return observation.users
    .filter((user, position) => position > after && isUserGroup(user.identity)
      && !baseline.initialTurnIdentities.includes(user.identity))
    .slice(-MAX_PROBED_USERS)
    .map(user => user.identity);
}

/** Ownership never comes from the previous binding's accepted identity set. */
export function ownerOf(observation: TurnObservation, baseline: TurnBaseline): string | undefined {
  const candidates = observation.users.filter(user => isUserGroup(user.identity)
    && !baseline.initialTurnIdentities.includes(user.identity));
  if (baseline.turnToken !== undefined) {
    const matches = candidates.filter(user => user.token === baseline.turnToken);
    return matches.length === 1 ? matches[0]!.identity : undefined;
  }
  if (baseline.submittedText === undefined) return;
  const text = baseline.submittedText.replace(/\r\n?/g, "\n");
  // Token-less text cannot tell our turn from identical remounted history, so a candidate must
  // at least come after every mounted baseline user: history that precedes Send is never ours.
  const after = lastBaselineUserPosition(observation, baseline);
  const matches = candidates.filter(user => user.text === text && observation.users.indexOf(user) > after);
  const accepted = matches.find(user => user.identity === baseline.acceptedUserIdentity);
  if (accepted) return accepted.identity;
  // When the baseline had users but none is mounted any more (virtualized away), nothing anchors
  // the position of a remounted identical-text turn: wait instead of guessing.
  const anchored = after >= 0 || !baseline.initialTurnIdentities.some(isUserGroup);
  return anchored && matches.length === 1 && matches[0] === observation.users.at(-1) ? matches[0]!.identity : undefined;
}

export type TurnResolution = { kind: "WAIT" } | { kind: "ABORT" } | { kind: "BIND"; identity: string };

/** History before the proven owner has no bearing on the answer. */
export function resolve(observation: TurnObservation, baseline: TurnBaseline, owner: string | undefined): TurnResolution {
  if (!owner) return { kind: "WAIT" };
  const position = observation.users.findIndex(user => user.identity === owner);
  if (position < 0 || !isUserGroup(owner) || baseline.initialTurnIdentities.includes(owner)) return { kind: "WAIT" };
  if (position < observation.users.length - 1) return { kind: "ABORT" };
  const identity = owner.replace("group:user:", "group:assistant:");
  if (baseline.initialTurnIdentities.includes(identity) || !observation.responses.includes(identity)) return { kind: "WAIT" };
  return { kind: "BIND", identity };
}

export type TurnSubmissionEvidence = "user_turn" | "assistant_turn" | "generation_running" | "uncertain";

/**
 * What an observation says about Send (call resolve first: ABORT outranks all of this).
 * - owner proven                                         -> user_turn
 * - a new answer paired with a probed candidate user (after the last mounted baseline user, not
 *   conclusively foreign; its tail may be collapsed)    -> assistant_turn
 * - generation running                                   -> generation_running
 * - any other non-baseline user after the last mounted
 *   baseline user                                       -> uncertain: Send may have happened,
 *   so a caller must treat it as "possibly sent" (never reset or re-send), not as "not sent".
 * History before the last baseline user, and a lone remounted answer, are never evidence.
 */
export function submissionEvidence(
  observation: TurnObservation,
  baseline: TurnBaseline,
  owner: string | undefined,
  generationRunning: boolean,
): TurnSubmissionEvidence | undefined {
  if (owner) return "user_turn";
  const targets = probeTargets(observation, baseline);
  const paired = observation.responses.some(response => !baseline.initialTurnIdentities.includes(response)
    && response.startsWith("group:assistant:")
    && observation.users.some(user => targets.includes(user.identity) && !user.foreign
      && user.identity === response.replace("group:assistant:", "group:user:")));
  if (paired) return "assistant_turn";
  if (generationRunning) return "generation_running";
  const after = lastBaselineUserPosition(observation, baseline);
  const unproven = observation.users.some((user, position) => position > after && isUserGroup(user.identity)
    && !baseline.initialTurnIdentities.includes(user.identity));
  return unproven ? "uncertain" : undefined;
}
