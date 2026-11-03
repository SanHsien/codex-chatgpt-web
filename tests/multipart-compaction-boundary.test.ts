import { expect, spyOn, test } from "bun:test";
import * as inputTokens from "../src/adapters/chatgpt-web/input-tokens";
import { compileChatGptWebPrompt } from "../src/adapters/chatgpt-web/prompt";
import { CHATGPT_WEB_MODEL_ID } from "../src/adapters/chatgpt-web/model";
import { resolveChatGptWebContextLimits } from "../src/chatgpt-web-models";
import { SUMMARY_PREFIX } from "../src/responses/compaction";
import type { CodexParsedRequest } from "../src/types";

test.each([-1, 0])("multipart compaction treats the transport ceiling as exclusive (offset %s)", offset => {
  const capabilities = { localToolsEnabled: false, solAvailable: true, extraHighAvailable: true, proAvailable: true };
  const ceiling = resolveChatGptWebContextLimits(CHATGPT_WEB_MODEL_ID, "xhigh",
    { ...capabilities, experimentalBiggerContext: true }, "6").contextWindow;
  const checkpoint = `${SUMMARY_PREFIX}\nVerified progress`;
  const parsed: CodexParsedRequest = {
    modelId: CHATGPT_WEB_MODEL_ID, _chatgptModelFamily: "6", _compactionRequest: true,
    context: { systemPrompt: ["fixed instructions"], messages: [
      { role: "user", content: checkpoint, timestamp: 1 },
      { role: "user", content: "discardable history", timestamp: 2 },
      { role: "user", content: "checkpoint now", timestamp: 3 },
    ] },
    stream: false, options: { reasoning: "xhigh" },
  };
  // Isolate the exact comparison from tokenizer granularity. Integration cases use real counts.
  const estimate = spyOn(inputTokens, "estimateCompiledChatGptWebInputTokens")
    .mockImplementation(compiled => compiled.multipart!.commit.includes("history is incomplete")
      ? ceiling - 1 : ceiling + offset);
  try {
    const compiled = compileChatGptWebPrompt(parsed, capabilities, undefined, { experimentalMultipartParts: 6 });
    expect(compiled.trimmedCompactionMessages).toBe(offset === 0 ? 1 : undefined);
    const messages = compiled.multipart!.parts.flatMap(part => JSON.parse(part).records)
      .filter(record => record.kind === "message").map(record => record.message.content);
    expect(messages).toEqual(offset === 0 ? [checkpoint, "checkpoint now"]
      : [checkpoint, "discardable history", "checkpoint now"]);
    expect(estimate).toHaveBeenCalled();
  } finally {
    estimate.mockRestore();
  }
});
