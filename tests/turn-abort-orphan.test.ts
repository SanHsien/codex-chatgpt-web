import { expect, test } from "bun:test";
import { withBrowserTurnAbort } from "../src/adapters/chatgpt-web/browser-worker";
import { withCompactionAbort } from "../src/adapters/chatgpt-web/compaction-handoff";
import { withAbort } from "../src/adapters/chatgpt-web/index";

type AbortWrapper = <T>(promise: Promise<T>, signal: AbortSignal | undefined) => Promise<T>;

const wrappers: Array<[string, AbortWrapper]> = [
  ["withBrowserTurnAbort", withBrowserTurnAbort],
  ["withCompactionAbort", withCompactionAbort],
  ["withAbort", withAbort],
];

async function countUnhandledRejections(run: () => Promise<void>): Promise<number> {
  let count = 0;
  const onUnhandled = () => { count += 1; };
  process.on("unhandledRejection", onUnhandled);
  try {
    await run();
    // Unhandled rejections surface after the microtask queue drains.
    for (let i = 0; i < 5; i += 1) await new Promise(resolve => setTimeout(resolve, 5));
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
  return count;
}

for (const [name, wrap] of wrappers) {
  test(`${name} does not leak an unhandled rejection when the signal is already aborted`, async () => {
    const unhandled = await countUnhandledRejections(async () => {
      const controller = new AbortController();
      controller.abort();
      let rejectLate!: (error: Error) => void;
      const late = new Promise<string>((_resolve, reject) => { rejectLate = reject; });
      await expect(wrap(late, controller.signal)).rejects.toBeDefined();
      rejectLate(new Error("late failure of an abandoned promise"));
    });
    expect(unhandled).toBe(0);
  });

  test(`${name} still reports the original rejection when the signal is live`, async () => {
    const controller = new AbortController();
    const failure = new Error("original failure");
    await expect(wrap(Promise.reject(failure), controller.signal)).rejects.toBe(failure);
  });
}
