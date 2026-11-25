import { expect, test } from "bun:test";
import { MAX_PROBED_USERS, ownerOf, probeTargets, resolve, submissionEvidence, type TurnBaseline, type TurnObservation, type TurnUser, type TurnResolution } from "../src/adapters/chatgpt-web/turn-ownership";

const token = "turn_0123456789abcdef0123456789abcdef";
const user = (key: string, evidence: Partial<TurnUser> = {}): TurnUser => ({ identity: `group:user:${key}`, ...evidence });
const own = user("U", { token, text: "continue" });
const history = user("H", { text: "continue" });
const baseline: TurnBaseline = { initialTurnIdentities: ["group:user:B", "group:assistant:B"], turnToken: token, submittedText: "continue" };
const obs = (users: TurnUser[], responses = ["group:assistant:U"]): TurnObservation => ({ users, responses });
const cases: [string, TurnObservation, Partial<TurnBaseline>, TurnResolution["kind"], string?][] = [
  ["history before owner", obs([history, own]), {}, "BIND", "group:assistant:U"],
  ["many unseen history groups", obs(Array.from({ length: 24 }, (_, i) => user(`H${i}`)).concat(own)), {}, "BIND", "group:assistant:U"],
  ["HIGH-1 history was accepted, U unmounted", obs([history], ["group:assistant:H"]), { acceptedUserIdentity: "group:user:U" }, "WAIT"],
  ["HIGH-2 history falsely acknowledged", obs([history], ["group:assistant:H"]), { acceptedUserIdentity: "group:user:H" }, "WAIT"],
  ["HIGH-2 U arrives after false acknowledgement", obs([history, own]), { acceptedUserIdentity: "group:user:H" }, "BIND", "group:assistant:U"],
  ["accepted key alone is no token proof", obs([user("U")]), { acceptedUserIdentity: "group:user:U" }, "WAIT"],
  ["accepted old key cannot block rekey", obs([history, own]), { acceptedUserIdentity: "group:user:optimistic" }, "BIND", "group:assistant:U"],
  ["own content late", obs([user("U")]), {}, "WAIT"],
  ["own token late", obs([user("U", { text: "Rendering" })]), {}, "WAIT"],
  ["incomplete proof", obs([user("U")]), {}, "WAIT"],
  ["user before answer", obs([history, own], []), {}, "WAIT"],
  ["only old assistant", obs([], ["group:assistant:H"]), {}, "WAIT"],
  ["misaligned assistant", obs([own], ["group:assistant:H"]), {}, "WAIT"],
  ["baseline answer never binds", obs([own]), { initialTurnIdentities: ["group:assistant:U"] }, "WAIT"],
  ["baseline user never owns", obs([own]), { initialTurnIdentities: ["group:user:U"] }, "WAIT"],
  ["later user aborts", obs([own, history]), {}, "ABORT"],
  ["later baseline user also aborts", obs([own, user("B")]), {}, "ABORT"],
  ["duplicate token owners wait", obs([user("copy", { token }), own]), {}, "WAIT"],
  ["foreign token waits", obs([user("U", { token: "turn_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" })]), {}, "WAIT"],
  ["no token exact last user", obs([history, own]), { turnToken: undefined, submittedText: "continue", initialTurnIdentities: ["group:user:H", "group:assistant:H"] }, "BIND", "group:assistant:U"],
  ["no token baseline identical old turn", obs([history], ["group:assistant:H"]), { turnToken: undefined, initialTurnIdentities: ["group:user:H", "group:assistant:H"], acceptedUserIdentity: "group:user:H" }, "WAIT"],
  ["no token duplicate exact text", obs([history, own]), { turnToken: undefined }, "WAIT"],
  ["no token accepted needs exact text", obs([user("U", { text: "changed" })]), { turnToken: undefined, acceptedUserIdentity: "group:user:U" }, "WAIT"],
  ["no token accepted exact plus competitor", obs([own, history]), { turnToken: undefined, acceptedUserIdentity: "group:user:U" }, "ABORT"],
  ["no token exact is not last", obs([own, user("later", { text: "other" })]), { turnToken: undefined }, "WAIT"],
  ["no prompt waits", obs([own]), { turnToken: undefined, submittedText: undefined }, "WAIT"],
  ["prefix is not exact", obs([user("U", { text: "continue extra" })]), { turnToken: undefined }, "WAIT"],
  ["spaces remain exact", obs([user("U", { text: " continue" })]), { turnToken: undefined }, "WAIT"],
  ["legacy user cannot own", obs([{ identity: "legacy", token }]), {}, "WAIT"],
];
for (const [name, observation, overrides, kind, identity] of cases) {
  test(name, () => {
    const base = { ...baseline, ...overrides };
    const before = JSON.stringify({ observation, base });
    const decision = resolve(observation, base, ownerOf(observation, base));
    expect(decision.kind).toBe(kind);
    if (identity) expect(decision).toEqual({ kind: "BIND", identity });
    expect(JSON.stringify({ observation, base })).toBe(before);
  });
}
test("late token and late answer progress from WAIT to BIND without remembered anchors", () => {
  const observation = obs([history, user("U")], ["group:assistant:H"]);
  expect(resolve(observation, baseline, ownerOf(observation, baseline)).kind).toBe("WAIT");
  observation.users[1] = own;
  expect(resolve(observation, baseline, ownerOf(observation, baseline)).kind).toBe("WAIT");
  observation.responses = ["group:assistant:H", "group:assistant:U"];
  expect(resolve(observation, baseline, ownerOf(observation, baseline))).toEqual({ kind: "BIND", identity: "group:assistant:U" });
});
test("resolve ignores a stale owner that is no longer mounted", () => {
  expect(resolve(obs([history]), baseline, own.identity)).toEqual({ kind: "WAIT" });
});

// Review item 3: token-less text needs a mounted baseline anchor before the candidate.
test("token-less identical-text history is not ours when no baseline user anchors its position", () => {
  const base = { ...baseline, turnToken: undefined };
  const virtualized = obs([history], ["group:assistant:H"]);
  expect(ownerOf(virtualized, base)).toBeUndefined();
  expect(resolve(virtualized, base, ownerOf(virtualized, base)).kind).toBe("WAIT");
  const anchored = obs([user("B"), own], ["group:assistant:U"]);
  expect(resolve(anchored, base, ownerOf(anchored, base))).toEqual({ kind: "BIND", identity: "group:assistant:U" });
  const first = obs([own], ["group:assistant:U"]);
  expect(ownerOf(first, { ...base, initialTurnIdentities: [] })).toBe("group:user:U");
  // An owner proven earlier by the same evidence stays the owner after its anchor unmounts.
  expect(ownerOf(first, { ...base, acceptedUserIdentity: "group:user:U" })).toBe("group:user:U");
});

test("token-less candidate before the last baseline user is never an owner", () => {
  const base = { ...baseline, turnToken: undefined, acceptedUserIdentity: "group:user:H" };
  const observation = obs([history, user("B")]);
  expect(ownerOf(observation, base)).toBeUndefined();
});

// Review item 4: bounded probing.
test("only the last few non-baseline users after the last baseline user are read", () => {
  const hundreds = Array.from({ length: 300 }, (_, i) => user(`R${i}`));
  const targets = probeTargets(obs([...hundreds, user("B"), ...hundreds.map(u => user(`${u.identity}x`)), own]), baseline);
  expect(targets.length).toBe(MAX_PROBED_USERS);
  expect(targets.at(-1)).toBe("group:user:U");
  expect(targets.every(identity => !identity.startsWith("group:user:R") || identity.endsWith("x"))).toBe(true);
  expect(probeTargets(obs([history, user("B")]), baseline)).toEqual([]);
});

// Acknowledgement evidence. B is the mounted baseline anchor; everything after it is a candidate.
const anchorB = user("B");
const evidence = (users: TurnUser[], responses: string[], owner?: string, running = false) =>
  submissionEvidence(obs(users, responses), baseline, owner, running);

test("a lone remounted answer is never submission evidence", () => {
  expect(evidence([], ["group:assistant:H"])).toBeUndefined();
  expect(evidence([], ["group:assistant:H"], undefined, true)).toBe("generation_running");
  expect(evidence([], ["group:assistant:H1", "group:assistant:H2"])).toBeUndefined();
  expect(evidence([], [])).toBeUndefined();
});

test("a new answer paired with an unproven new user acknowledges Send; foreign history does not", () => {
  expect(evidence([anchorB, user("U")], ["group:assistant:U"])).toBe("assistant_turn");
  expect(evidence([anchorB, { ...history, foreign: true }], ["group:assistant:H"])).toBe("uncertain");
  expect(evidence([anchorB, user("U")], ["group:assistant:other"])).toBe("uncertain");
  expect(evidence([anchorB, own], [], "group:user:U")).toBe("user_turn");
});

test("remounted history pairs before the last baseline user are neither evidence nor uncertainty", () => {
  // Older history remounted above the anchor, each with its answer: unsent Send must read as unsent.
  const older = [user("O1"), user("O2")];
  expect(evidence([...older, anchorB], ["group:assistant:O1", "group:assistant:O2"])).toBeUndefined();
  // ... and with no mounted anchor at all every non-baseline user is after "nothing": uncertain.
  expect(evidence(older, [])).toBe("uncertain");
});

test("a pair outside the probed last users is not acknowledgement", () => {
  const many = Array.from({ length: MAX_PROBED_USERS + 1 }, (_, i) => user(`R${i}`));
  // R0 was not probed (only the last MAX_PROBED_USERS are), so its answer proves nothing.
  expect(evidence([anchorB, ...many], ["group:assistant:R0"])).toBe("uncertain");
  expect(evidence([anchorB, ...many], [`group:assistant:R${MAX_PROBED_USERS}`])).toBe("assistant_turn");
});
