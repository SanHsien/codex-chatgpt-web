/** Runs in the page. Read the submitted text, excluding only observed renderer chrome. */
export function readChatGptUserMessage(
  target: Element,
  connectorName?: string,
): { text: string; leadingConnector: boolean } | undefined {
  let leadingConnector = false;
  let unsupported = false;
  let seenText = false;
  const rich = target.querySelector('[data-markdown-text-tone="user-message"].rich-text-user-turn');
  if (target.querySelectorAll('[data-markdown-text-tone="user-message"].rich-text-user-turn').length > 1) return;
  const text = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      const value = node.textContent ?? "";
      if (value.trim()) seenText = true;
      return value;
    }
    if (!(node instanceof HTMLElement)) { unsupported = true; return ""; }
    if (node.matches('[data-prompt-link-href^="app://"]')
      || node.matches('a:has(> [data-prompt-link-href^="app://"])')) {
      if (seenText || leadingConnector || !connectorName || node.textContent !== connectorName) unsupported = true;
      leadingConnector = true;
      return "";
    }
    if (node.tagName === "BR") return "\n";
    // ChatGPT auto-links bare URLs. Only accept links whose complete label is
    // the URL itself; formatted labels and link chrome cannot replace source text.
    if (node instanceof HTMLAnchorElement) {
      try {
        const label = node.textContent ?? "";
        const url = new URL(label);
        if (!["https:", "http:"].includes(url.protocol) || url.href !== node.href) {
          unsupported = true;
          return "";
        }
      } catch { unsupported = true; return ""; }
      return [...node.childNodes].map(text).join("");
    }
    if (node.matches('pre[data-markdown-copy="code-block"]')) {
      const code = node.querySelector('code[data-markdown-copy-content="true"][data-language]');
      if (!code || node.children.length !== 1) { unsupported = true; return ""; }
      seenText = true;
      return `\`\`\`${code.getAttribute("data-language")}\n${code.textContent ?? ""}\n\`\`\``;
    }
    if (node === rich) {
      const blocks = [...node.childNodes];
      if (blocks.some(block => !(block instanceof HTMLElement)
        || !(block.tagName === "P" || block.matches('[data-markdown-copy="blank-lines"]')))) {
        unsupported = true;
        return "";
      }
      const value = blocks.map(block => text(block) + ((block as HTMLElement).tagName === "P" ? "\n" : "")).join("");
      return (blocks.at(-1) as HTMLElement | undefined)?.tagName === "P" ? value.slice(0, -1) : value;
    }
    // These are text wrappers in the captured plain and rich-text user renderers.
    // Other markup must not be silently flattened into a matching prompt.
    if (!["DIV", "SPAN", "P"].includes(node.tagName)) { unsupported = true; return ""; }
    return [...node.childNodes].map(text).join("");
  };
  const value = text(target);
  if (unsupported) return;
  // attachPrompt inserts a separating space after the plugin. ChatGPT can retain
  // its own chip separator too. Only this leading transport spacing is excluded.
  return { text: leadingConnector ? value.trimStart() : value, leadingConnector };
}

/** Runs in the page; requires exactly one fully rendered, bounded token. */
export function chatGptUserMessageHasToken(element: Element, token: string): boolean {
  // textContent concatenates BR/block boundaries with the next word.
  // Read rendered boundaries, but inspect all source text for ambiguity.
  const raw = element.textContent ?? "";
  const candidates = [...raw.matchAll(/turn_[A-Za-z0-9_-]{32}/g)];
  const visible = (element as HTMLElement).innerText;
  const tokens = visible
    .match(/(?<![A-Za-z0-9_-])turn_[A-Za-z0-9_-]{32}(?![A-Za-z0-9_-])/g) ?? [];
  const matching = candidates.filter(candidate => candidate[0] === token);
  if (tokens.length !== 1 || tokens[0] !== token || matching.length !== 1) return false;

  // Expanded prompts can retain hidden history in the same renderer. Ignore its older
  // tokens only when the sole visible token is also the only token in the final bridge contract.
  if (candidates.length > 1) {
    const resumeToken = (text: string): string | undefined => {
      const start = text.lastIndexOf("<codex_transport_resume>");
      if (start < 0) return;
      const tail = text.slice(start).trimEnd();
      const match = /^<codex_transport_resume>\s*The task context is complete\. Pass turn_token (turn_[A-Za-z0-9_-]{32}) unchanged to every tool call\b[^<]*<\/codex_transport_resume>$/.exec(tail);
      if (match && [...tail.matchAll(/turn_[A-Za-z0-9_-]{32}/g)].length === 1) return match[1];
    };
    if (resumeToken(raw) !== token || resumeToken(visible) !== token) return false;
  }
  // innerText includes transparent text and falls back to textContent
  // for hidden roots. Every source character of the identity must render.
  const start = matching[0]!.index!;
  const end = start + token.length;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let offset = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const next = offset + (node.textContent?.length ?? 0);
    if (next > start && offset < end) {
      for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (parent.hidden || style.display === "none"
          || style.visibility === "hidden" || style.opacity === "0") return false;
      }
    }
    offset = next;
    if (offset >= end) break;
  }
  return element.isConnected;
}
