import { describe, expect, test } from "bun:test";
import { CALENDAR_ENVIRONMENT_PATTERN } from "../src/adapters/chatgpt-web/environment";

const profile = '<permission_profile type="disabled"><file_system type="unrestricted" /></permission_profile>';
const envelope = (roots: string) => `<environment_context>
<current_date>2026-10-21</current_date><timezone>America/New_York</timezone>
<filesystem><workspace_roots>${roots}</workspace_roots>${profile}</filesystem>
<subagents><agent name="/root/reviewer" /></subagents></environment_context>`;

describe("calendar environment pattern", () => {
  test("captures the whole root list for one or several roots, with any whitespace between them", () => {
    for (const roots of [
      "<root>C:\\work</root>",
      "<root>C:\\work</root><root>D:\\extra</root>",
      "\n  <root>C:\\work</root>\n  <root>D:\\extra</root>\n",
      " \t<root>C:\\work</root> \r\n <root>D:\\extra</root> ",
    ]) {
      const match = CALENDAR_ENVIRONMENT_PATTERN.exec(envelope(roots));
      expect(match).not.toBeNull();
      expect([...match![1]!.matchAll(/<root>([^<]+)<\/root>/g)].map(root => root[1])).toEqual(
        [...roots.matchAll(/<root>([^<]+)<\/root>/g)].map(root => root[1]),
      );
    }
    expect(CALENDAR_ENVIRONMENT_PATTERN.exec(envelope("<root>C:\\work</root><root></root>"))).toBeNull();
    expect(CALENDAR_ENVIRONMENT_PATTERN.exec(envelope(""))).toBeNull();
  });

  test("rejects a long malformed root list without exponential backtracking (CodeQL js/redos)", () => {
    // Each ' <root>;</root>' used to be splittable between the trailing and the leading \s* of its neighbours.
    const hostile = `<environment_context><current_date>2026-10-21</current_date><filesystem><workspace_roots>${" <root>;</root>".repeat(5000)}x`;
    const started = performance.now();
    expect(CALENDAR_ENVIRONMENT_PATTERN.exec(hostile)).toBeNull();
    expect(performance.now() - started).toBeLessThan(1000);
    const spaced = `<environment_context><current_date>2026-10-21</current_date><filesystem><workspace_roots>${"<root>;</root>   ".repeat(2000)}</workspace_roots>`;
    const startedSpaced = performance.now();
    expect(CALENDAR_ENVIRONMENT_PATTERN.exec(spaced)).toBeNull();
    expect(performance.now() - startedSpaced).toBeLessThan(1000);
  });
});
