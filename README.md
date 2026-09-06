<h1 align="center">ChatGPT Web for Codex</h1>

<p align="center">
  <strong>將 ChatGPT Web（包括 Pro）作為 Codex 原生模型使用。</strong><br>
  切換模型檔位，保留原有工作流。
</p>

<p align="center">
  <a href="README.md">繁體中文</a> · <a href="README.en.md">English</a>
</p>

<p align="center">
  <a href="TROUBLESHOOTING.md">故障排除</a> · <a href="SECURITY.md">安全</a> · <a href="CONTRIBUTING.md">貢獻</a>
</p>

<p align="center">
  <a href="https://github.com/SanHsien/codex-chatgpt-web/actions/workflows/ci.yml"><img src="https://github.com/SanHsien/codex-chatgpt-web/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
  <img src="https://img.shields.io/badge/Windows-x64-0078d4?logo=windows11" alt="Windows x64">
  <img src="https://img.shields.io/badge/unofficial-ChatGPT_Web_automation-555555" alt="非官方 ChatGPT Web 自動化">
</p>

> **維護 fork 說明。** 此倉庫由
> [SanHsien/codex-chatgpt-web](https://github.com/SanHsien/codex-chatgpt-web) 維護。在保留上游
> MIT 專案及產品行為的同時，提供 Windows-only 維護。**僅支援 Windows。** 原始碼與開發使用此 fork；
> 在 fork 首次發布套裝版本前，PowerShell 安裝器與自動更新暫時使用已審閱的上游 Windows release **v5.0.4**。請參閱 [FORK.md](FORK.md)
> 和[開發文件](docs/DEVELOPMENT.md)、維護 fork 的[更新記錄](CHANGELOG.md)。這是非官方 ChatGPT Web 自動化：可用額度仍取決於賬戶和
> 方案，UI 變化可能導致其失效，使用者必須遵守 OpenAI 條款及其工作區政策。

Free 和 Go 賬戶會在 Codex 原生模型選擇器中看到 **ChatGPT Web — Luna**。具有推理選擇器的
賬戶仍會按訂閱許可權看到 **Instant**、**Medium**、**High**、**Extra High** 和 **Pro**。
橋接程式會把當前編譯後的 Codex 任務上下文傳送到一個全新的 ChatGPT 臨時聊天，附加圖片，
並將可見的推理過程、工具活動和 Markdown 流式傳回同一個 Codex 任務。

<p align="center">
  <img src="assets/demo.gif" alt="ChatGPT Web 實時輪次正在使用原生 Codex harness" width="960">
</p>

```text
Codex task ──Responses + SSE──▶ codex-chatgpt-web ──embedded browser──▶ ChatGPT
     ▲                                │                                      │
     └──────── native UI, context, images, tracing, and tool lifecycle ──────┘
```

Codex 會保留原生任務、上下文生命週期、介面和工具 harness。本地 Responses 橋接程式只會將
所選模型的任務轉發到與該任務繫結的 ChatGPT 臨時聊天；在完整模式下，MCP 會把 ChatGPT 連線回
同一個 Codex 任務的工具，直到下一次上下文壓縮邊界。

> [!TIP]
> 我還開發了 **[ChatGPT Persona Voice](https://github.com/miuuyy/ChatGPT-Persona-Voice)**：一款
> 能夠近實時改變 ChatGPT/Codex 聲音的本地應用。它不會接觸你的賬戶、瀏覽器會話或 ChatGPT
> 請求，因此不會帶來賬戶封禁風險。如果你喜歡我的作品，歡迎試用。

## 亮點

- **Codex 原生模型。** ChatGPT Web 直接出現在 Codex 模型選擇器中，同時保留原有任務介面、
  上下文生命週期、流式輸出、追蹤和工具展示。
- **透過 MCP 使用完整 Codex harness。** 完整模式支援登入賬戶公開的全部 effort（包括 Pro），
  並可訪問當前任務的檔案系統、shell、圖片、審批以及已配置的工具和應用。
- **連續任務會話與原生上下文壓縮。** 連續訊息會複用同一個與任務繫結的臨時聊天。到達上下文
  邊界時，保留的 agent 會先寫出檢查點，再由 Codex 從乾淨聊天繼續；若該私有聊天已被關閉，
  則使用 Codex 的規範任務歷史作為回退來源。
- **Windows 啟動器。** Windows 應用統一管理登入、模型設定、MCP 指南、
  健康檢查、安全診斷以及最多五個可見的任務繫結瀏覽器標籤頁。
- **故障時明確失敗。** 模型、工具缺失或 ChatGPT UI 發生變化時會返回明確錯誤，而不會靜默切換
  路由或能力。端到端覆蓋範圍記錄在[釋出驗證](docs/release-validation.md)中。

臨時聊天是 ChatGPT 的隱私模式，並不代表匿名或僅在本地推理：提示仍會由 OpenAI 處理，並受賬戶
設定及 OpenAI [臨時聊天政策](https://help.openai.com/en/articles/8914046-temporary-chat-faq)
約束。本專案為非官方專案；使用者仍需自行遵守適用的 OpenAI 條款和工作區政策。

## 快速開始

安裝或更新桌面啟動器。若要更新或修復現有安裝，請先退出啟動器，然後再次執行同一條命令；它會
替換應用程式和內建執行時，同時保留 ChatGPT 配置檔案和啟動器配置。

原始碼開發和克隆應使用此維護 fork。在該 fork 釋出版本之前，打包安裝程式來自已審閱的上游版本 **v5.0.4**。

**Windows PowerShell**

```powershell
$previousVersion = $env:CODEX_WEB_GPT_VERSION
try {
  $env:CODEX_WEB_GPT_VERSION = "5.0.4"
  irm https://github.com/miuuyy/codex-chatgpt-web/releases/download/v5.0.4/install-launcher.ps1 | iex
} finally {
  if ($null -eq $previousVersion) { Remove-Item Env:CODEX_WEB_GPT_VERSION -ErrorAction SilentlyContinue }
  else { $env:CODEX_WEB_GPT_VERSION = $previousVersion }
}
```

已發佈的 `v5.0.4` 安裝器預設會查詢最新版本；上列命令會只在執行期間明確設定其
`CODEX_WEB_GPT_VERSION`，完成後還原原本的環境變數，因此仍只安裝已審閱的 `5.0.4`。

然後在應用中完成三項檢查：

1. 直接在啟動器內建的 ChatGPT 瀏覽器中登入。登入頁和身份提供商視窗都保留在同一個由啟動器
   管理的私有瀏覽器配置中；會話不會在不同瀏覽器之間複製。
2. 執行瀏覽器冒煙測試。
3. 點選 **安裝模型**，重啟一次 Codex，然後選擇一個 **ChatGPT Web — …** 模型。

啟動器會在設定期間檢測當前賬戶的 ChatGPT 控制元件：Free/Go 賬戶只會顯示 Luna；只有已登入賬戶
支援 Pro 時，Pro 才會顯示。獨立的 **MCP** 頁面是可選項，它會在不需要終端命令的情況下引導你
完成完整 harness 設定。

打包後的啟動器在其內建瀏覽器中完成登入並執行 ChatGPT 模型輪次，不需要模型 API 金鑰、已安裝的
Chrome/Chromium、系統級 Node/Bun，也不會由本專案另行下載瀏覽器。

**從原始碼執行**

```powershell
git clone https://github.com/SanHsien/codex-chatgpt-web.git
Set-Location codex-chatgpt-web
bun run app
```

原始碼方式需要 Bun 1.4.0。該命令會安裝鎖定版本的依賴並開啟應用。

## 模式

| 模式 | 模型 | 本地 Codex 工具 | 額外設定 |
| --- | --- | --- | --- |
| **僅瀏覽器** | Free/Go：Luna；Plus：Instant–High；Pro：增加 Extra High 和 Pro | 不可用；Codex 會顯示警告 | 無 |
| **完整 harness** | Free/Go：Luna；Plus：Instant–High；Pro：增加 Extra High 和 Pro | 每個列出的 effort 均支援，包括 Pro | OpenAI 隧道 + ChatGPT 聯結器 |
| **Zero Risk** | 手動選擇 ChatGPT 模型與 effort；可選 Pro 規模上下文 | 可用；完整的回合繫結 Codex harness 仍可使用 | 獨立 OpenAI 隧道 + `Codex Zero Risk` 聯結器；手動貼上並送出 |

模型選擇器中的每一項都對應一個固定的 ChatGPT 模式。Codex 仍會顯示內建的 Effort 和 Speed
選項，但更改它們不會在後臺靜默切換所選的瀏覽器模型。在完整模式下，每一個可用 effort 都會
獲得同一個與當前回合繫結的 MCP 能力；Pro 沒有單獨限制，也沒有縮減後的工具契約。

Zero Risk 會保留本機 Responses 橋接程式和完整 Codex harness，但絕不讀取或變更 ChatGPT 頁面，
也不會代替你送出提示。啟動器會準備並複製提示；你自行選擇模型、effort 與 `Codex Zero Risk`
聯結器，再手動貼上並送出。這會移除特別與 ChatGPT 網頁自動化相關的帳戶風險。

## 完整 harness

完整模式透過官方
[OpenAI tunnel-client](https://github.com/openai/tunnel-client)
將 ChatGPT 的工具呼叫連線回當前 Codex 任務。該隧道為出站連線：不會暴露公網 IP、開放入站埠，
也不需要配置路由器埠轉發。

> **限制**
>
> 有關 **GPT-5.6 Sol Pro** 和 **GPT-6 Astra** 當前的 ChatGPT 訊息額度，請參閱
> [Limits](https://github.com/miuuyy/codex-chatgpt-web/discussions/309)。Token 上下文上限取決於
> 賬戶型別和所選 effort。Plus 的 Medium/High 使用實測的 90,000-token 視窗；啟用實驗性的
> **3× context** 後最高為 270,000 tokens，並且全程支援原生 Codex compaction。

1. 完成啟動器中的必需設定。
2. 在啟動器中開啟 **MCP**。請在將使用 ChatGPT 聯結器的同一個 OpenAI 賬戶中建立 Tunnel
   和普通 API 金鑰；建立金鑰本身免費，也不會消耗模型 API 額度。
3. 貼上 Tunnel ID 和 API 金鑰，然後點選 **連線 Harness**。
4. 在 ChatGPT 設定中啟用 **開發者模式**。新建聯結器時選擇 **Tunnel**，選擇剛建立的
   Tunnel，將 **身份驗證** 設為 **無**，並將名稱準確設定為 **Codex Native2**。
5. 在 **Codex Native2** 的 **許可權** 中選擇 **允許所有操作**；**允許低風險操作** 會在命令和
   補丁到達本地執行時前將其攔截。外層 Codex harness 仍會執行沙箱和審批規則。
6. 執行 **驗證執行時**，確認 **Codex Native2** 已連線並可用。

寫入/修改操作還需要 ChatGPT 工作區及其管理員政策允許。請參閱
[開發者模式和 MCP 應用](https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt)。
除非顯式啟用 `--auto-approve-tool-calls`，否則意外的審批提示會直接失敗；該選項只會點選
**Allow once**，絕不會授予永久許可權。

## 日常操作

使用 **活動** 頁面檢視安全的本地診斷，並透過 **設定 → 執行診斷** 執行端到端健康檢查。設定頁還可
取消保留的瀏覽器任務，或在解除安裝前移除 Codex 整合。僅在需要為每個瀏覽器檢查點儲存截圖時設定
`CODEX_CHATGPT_WEB_BROWSER_DIAGNOSTICS=1`。

新安裝預設使用 **Compatibility V1** 以支援跨後端 subagent。**Native** 會保留 Codex 自身的
功能設定，並啟用明文 Web-to-Web V2 委派。切換協議後，請重啟 Codex 並建立新任務：

```powershell
codex-chatgpt-web subagents status
codex-chatgpt-web subagents compatibility-v1
codex-chatgpt-web subagents native
```

## 限制和安全性

- 這是非官方瀏覽器自動化，並非 OpenAI API。ChatGPT UI 變更可能破壞選擇器；發生變化時會明確
  失敗，而不是靜默切換模型或傳輸方式。
- 瀏覽器狀態是敏感的登入憑據，loopback 監聽器也可被同一本地使用者執行的程序訪問。切勿共享
  啟動器 profile，並僅在可信工作站上使用。
- **僅支援 Windows x64。** 執行時、測試和打包只在 Windows CI 中檢查；依賴賬戶的瀏覽器與 MCP 流程使用單獨的
  [釋出驗證](docs/release-validation.md)。
- 構建目前尚未進行平臺簽名，因此 SmartScreen 可能會顯示警告。安裝程式會在安裝前
  驗證已釋出的 SHA-256 清單。

啟用完整模式前，請閱讀完整的[架構說明](docs/architecture.md)和
[安全模型](docs/security-model.md)。安全漏洞請透過 [SECURITY.md](SECURITY.md) 報告。

## 開發

```powershell
bun run app
bun run dev:launcher
bun run src/cli.ts dev status
bun run dev:chat compaction-lab "Reply with exactly: DEV READY"
bun run verify
bun run smoke:subagents
bun run app:package
```

`dev:launcher` 會在 `~/.codex-chatgpt-web-dev` 下啟動第二個獨立的啟動器配置：Electron 狀態、
瀏覽器 Cookie/登入、ChatGPT 賬戶、配置、沙箱化 `CODEX_HOME`、聊天、診斷、broker 和 tunnel
配置均與正式啟動器隔離。它可以與正式啟動器同時執行，絕不會啟動 Responses daemon 或修改
Codex。可選的完整模式只會啟動並監管隔離的 DEV MCP tunnel，並使用獨立聯結器名稱
`Codex Native2 DEV`。

`dev:chat` 是一個具名、持久的合成外層 Codex harness。它透過隔離的啟動器瀏覽器、臨時聊天、
prompt compiler、Responses parser 和壓縮處理器執行當前工作樹。可選的完整模式也會測試 MCP
聯結器和 broker；工具效果會顯示為明確的模擬回執。僅瀏覽器聊天不會暴露外層工具。該命令不會
開啟 Responses listener、修改 `openai_base_url`、停止正式 daemon，也不會佔用 17841 埠。
不帶訊息執行時，可使用 `/status`、`/fill 30000`、`/compact`、`/model` 和 `/reset`。首次使用時，
請在標有 **DEV** 的視窗中登入並初始化一次配置。完整模式僅用於模擬工具輪次；DEV 啟動器會保持
DEV tunnel 就緒，具名聊天按需連線 broker。正式憑據和 `Codex Native2` 聯結器絕不會被隱式複用。
詳見 [DEV chat harness](docs/dev-chat.md)。

- [架構說明](docs/architecture.md)
- [DEV chat harness](docs/dev-chat.md)
- [安全模型](docs/security-model.md)
- [故障排除](TROUBLESHOOTING.md)
- [貢獻指南](CONTRIBUTING.md)

## Star History

<a href="https://www.star-history.com/?repos=miuuyy%2Fcodex-chatgpt-web&type=date&legend=top-left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=miuuyy/codex-chatgpt-web&type=date&theme=dark&legend=top-left&sealed_token=hBVvg_eOjfMFDrfyeo5FPQkIwcvBEmXc6F7ZoOKnfFE4KPCs67o34w4XwVuM-bHGnKR-SKCAN_TSTWrzuqSBNU-RjNZCLT4f-xNs9qcDhciQtemxHKuuFj0N5YNqZIihdaQfakrh2ANhOrvP0K2LmLXX2zbsYyVaYZknyTnlYeIS_mOGvMcO32ZmPCHK">
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=miuuyy/codex-chatgpt-web&type=date&legend=top-left&sealed_token=hBVvg_eOjfMFDrfyeo5FPQkIwcvBEmXc6F7ZoOKnfFE4KPCs67o34w4XwVuM-bHGnKR-SKCAN_TSTWrzuqSBNU-RjNZCLT4f-xNs9qcDhciQtemxHKuuFj0N5YNqZIihdaQfakrh2ANhOrvP0K2LmLXX2zbsYyVaYZknyTnlYeIS_mOGvMcO32ZmPCHK">
    <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=miuuyy/codex-chatgpt-web&type=date&legend=top-left&sealed_token=hBVvg_eOjfMFDrfyeo5FPQkIwcvBEmXc6F7ZoOKnfFE4KPCs67o34w4XwVuM-bHGnKR-SKCAN_TSTWrzuqSBNU-RjNZCLT4f-xNs9qcDhciQtemxHKuuFj0N5YNqZIihdaQfakrh2ANhOrvP0K2LmLXX2zbsYyVaYZknyTnlYeIS_mOGvMcO32ZmPCHK">
  </picture>
</a>

## 免責宣告

本專案是獨立軟體，與 OpenAI 無關聯，也未獲得 OpenAI 背書。請僅使用自己的賬戶，並遵守適用的
[使用條款](https://openai.com/policies/terms-of-use/)和工作區政策；本專案不會繞過身份驗證或
訪問控制。
