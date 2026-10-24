const fs = require("node:fs");

// Windows editors and PowerShell 5.1 (`Set-Content -Encoding UTF8`) write a UTF-8 BOM,
// which JSON.parse rejects. Strip exactly one leading BOM and nothing else.
function parseJsonText(text) {
  return JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
}

function readJsonFile(filePath) {
  return parseJsonText(fs.readFileSync(filePath, "utf8"));
}

module.exports = { parseJsonText, readJsonFile };
