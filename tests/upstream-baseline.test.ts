import { expect, test } from "bun:test";
import { evaluateUpstream, validateBaseline } from "../scripts/check-upstream-baseline";

const baseline = {
  schemaVersion: 1,
  upstream: {
    repository: "miuuyy/codex-chatgpt-web",
    remote: "upstream",
    branch: "main",
  },
  reviewedCommit: "c648c09501bb1b704c7ad5273fb5f5d6b8992dd2",
  reviewedAt: "2026-09-06",
  status: "reviewed-not-merged",
} as const;

test("validates a reviewed, non-merged upstream baseline", () => {
  expect(validateBaseline(baseline)).toEqual(baseline);
  expect(evaluateUpstream(baseline, baseline.reviewedCommit)).toBe("current");
});

test("fails closed for an incomplete baseline", () => {
  expect(() => validateBaseline({ ...baseline, reviewedCommit: "short" })).toThrow(
    "invalid or incomplete",
  );
  expect(() => validateBaseline({ ...baseline, upstream: { ...baseline.upstream, remote: undefined } })).toThrow(
    "invalid or incomplete",
  );
});

test("reports drift without reclassifying the baseline", () => {
  expect(evaluateUpstream(baseline, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toBe("drift");
});

test("rejects an invalid observed upstream ref", () => {
  expect(() => evaluateUpstream(baseline, "not-a-commit")).toThrow("invalid main commit");
});
