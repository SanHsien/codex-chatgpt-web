# 路線圖

> 本 repo 後續工作的單一真相源。做完一項，就在同一個 commit 刪掉那一列；新工作只加在這裡。
> 現況段的 fork Actions 與安全告警為 2026-10-29 查詢快照，開工前先重查；上游四軸資料有兩個日期：2026-10-29 審查水位（`860fa57`／PR #934／issue #933），以及 2026-11-03 重查後的最新水位（PR #959／issue #957／main 與工作區分支）。

## 現況
2026-11-03 外部閘門重審（基底 SHA `ece4d7c38c901d19da3bd737a290e4a63a7e30a9`）：chromium-bidi latest 回到 157，封裝仍缺少 Playwright 要求的 lib/cjs，改採精確 latest 延後；上游 main 未變，已逐筆審查 #935～#959 與工作區分支兩筆 commit，採用 #952 JSON 與 #953 busy status 獨立修正，其餘依 [DECISIONS](docs/DECISIONS.md#2026-11-03-upstream-review-935959-and-current-workspace-roots) 保留條件式延後，baseline 為 PR #959／issue #957／main 與工作區分支。系統 Bun 1.4.4 使版本檢查及 freshness 執行相容性失敗；以既有 repo-local Bun 1.4.2 執行 bootstrap 與完整 dev_check 均 exit 0，上游四軸與依賴 freshness current，核心 1,140 pass／100 skip／0 fail，launcher 419 pass／1 skip／0 fail，runtime smoke 通過；launcher audit 保留既有 minimatch 明示延後。原有快照保留，最新驗證見 [REVIEW](docs/REVIEW.md#2026-11-03-external-gate-changes)。

本 fork 將 ChatGPT Web 接入 Windows Codex 工作流；原始碼已採用上游 6.1.13，公開安裝器仍釘在 v5.0.6，這是刻意的發版邊界（[README.md:26](README.md)、[docs/DECISIONS.md:647](docs/DECISIONS.md)）。2026-10-29 `gh` 查詢記錄各主要 workflow 最近一次（2026-10-25）結果成功、開啟安全告警為 0；2026-10-29 曾因 GitHub 自動停用 fork 的 workflow 而推送不觸發（API 仍顯示 enabled），同日在 Actions 頁按「re-enable」後恢復；issues 停用而未查到 issue；上游最新 release 為 v6.1.17（2026-10-29），已逐筆審查 baseline 後 38 筆 commit、7 筆新 PR 與 14 筆新 issue；四軸已推進至 `860fa57`／PR #934／issue #933／僅 main，這是審查水位而非來源升級（[docs/DECISIONS.md](docs/DECISIONS.md#2026-10-29-upstream-review-6114-6117-912-934)）。6.1.14～6.1.17 差量已移植 #924 inline model picker、#932 正向 Luna 能力證明及其前置 #902 Think sprite，以及 2026-11-02 移植的 4 項獨立修正：#919 Doctor 壓縮覆蓋檢查（`7e6e1a0`）、#905 runtime 失敗清理（`0a8f233`）、#921 精確 model picker 與 Astra Max（`89f0ead`）、#914 渲染身分與串流診斷（`b6043e0`；DOM 案例須設定 `CHATGPT_DOM_TEST_BROWSER` 才會執行，2026-11-02 Edge 離線 fixture 已執行，結果見 [REVIEW](docs/REVIEW.md)）；2026-11-03 另已移植傳遞／重試（`e1780b1`）、多段壓縮上限（`f9325c9`）與延遲 final／token 診斷（`ffe041f`），見 [DECISIONS](docs/DECISIONS.md#2026-11-03-delivery-compaction-and-delayed-finals)；Temporary Chat 已採明確 opt-in 與既有偏好反向遷移，MCP setup／catalog 已分離；60 s MCP ABI 隨下一次安裝器版本採用，Full Access 工作區維持成組延後（[docs/DECISIONS.md](docs/DECISIONS.md#2026-10-31-port-inline-model-control-924927928-and-positive-luna-capability-evidence-932)、[docs/DECISIONS.md](docs/DECISIONS.md#2026-11-02-port-independent-fixes-7e6e1a0-0a8f233-89f0ead-b6043e0)）。登入、MCP 與打包後實機行為仍需獨立驗收（[docs/REVIEW.md:15](docs/REVIEW.md)）。

2026-11-03 本機依賴驗證快照（基底 SHA `1bbf072d0c913549fa2dea3d593cbd2cd25450ff`）：launcher 的 minimatch 5／9／10 路徑已以 scoped override 採用修補版；3 個舊 callable API 節點依正式安全延後紀錄保留，`launcher:audit` exit 0 並明示 deferred，仍有受延後告警。`bun run verify` exit 0（runtime smoke 通過）；完整 dev_check exit 1，停在上游 strict gate（PR #958／issue #957／額外分支）；獨立 freshness 當時 exit 1（chromium-bidi、motion、plugin-react、Electron 的 latest 超過既有延後界線），已由下一段（基底 SHA `545cd44a5159a83878182fe7a7ee9e58426dea82`）的重審取代。期限由檢查器讀取 `.github/audit-deferrals.json` 的 `revisit`（2026-11-17）強制執行；決策與驗證見 [DECISIONS](docs/DECISIONS.md#2026-11-03-launcher-minimatch-advisory-ghsa-g3hv-75wg-m249) 與 [REVIEW](docs/REVIEW.md)。

2026-11-03 依賴重審本機快照（基底 SHA `545cd44a5159a83878182fe7a7ee9e58426dea82`）：Electron 已採用 45.2.1，Windows package 與獨立 installer smoke 通過；chromium-bidi 159.0.8138-0 因 Playwright 載入路徑不相容、motion 14.9.0 因動畫視覺驗收條件未滿足、plugin-react 6.2.1 因要求 Vite 8，均依精確版本延後。`check:dependencies` exit 0、無 attention；root audit clean，launcher 仍明示既有 minimatch 安全延後。`bun run verify` exit 0；完整 dev_check exit 1，仍停在上游 strict gate（PR #958／issue #957／額外分支），未產生 Full 完成紀錄。installer smoke 首次超時、單獨重試通過；決策與完整結果見 [DECISIONS](docs/DECISIONS.md#2026-11-03-dependency-rereview) 與 [REVIEW](docs/REVIEW.md#2026-11-03-dependency-rereview)。

2026-11-03 導航與版本線界線本機驗證快照（基底 SHA `da1513e5d0625d0e052a1fc491a4d4d0163f10c0`）：導航 guard 已使用 Electron event details；依賴延後支援精確 `latest` 與數字 `latestPrefix`，chromium-bidi 採用 159 版本線界線。`check:dependencies` exit 0；獨立 `bun run verify` exit 0（核心 1,103 pass／98 skip／0 fail；launcher 419 pass／1 skip／0 fail；runtime smoke 通過）。完整 dev_check exit 1，仍停在上游 strict gate（PR #958／issue #957／額外分支），未產生 Full 完成紀錄。回歸紅綠與完整證據見 [REVIEW](docs/REVIEW.md#2026-11-03-navigation-details-and-dependency-version-line-bounds)。

2026-11-03 傳遞／重試、多段壓縮與延遲 final 移植本機快照（基底 SHA `e27d403c7886ec85901c9836a02c25b4b3ac37a8`）：`e1780b1`、`f9325c9`、`ffe041f` 已採用並完成紅綠回歸；獨立 `bun run verify` exit 0（核心 1,131 pass／100 skip／0 fail；launcher 419 pass／1 skip／0 fail；runtime smoke 通過）。完整 dev_check exit 1，停在上游 strict gate（PR #959／issue #957／額外分支）；`npm run check:dependencies` exit 1，chromium-bidi latest `157.0.8103-39` 超出既有 159 版本線界線，root audit clean，launcher 仍明示既有 minimatch 安全延後。未產生 Full 完成紀錄；其餘 defer 項保留，帳戶與發布驗收另依既有條件進行，詳見 [REVIEW](docs/REVIEW.md#2026-11-03-delivery-compaction-and-delayed-finals)。

2026-11-03 Temporary Chat／MCP 移植（基底 SHA `1be63e57449268b51dec32fd7bf598bceaeb9ea5`）：採用 `7c7c10e` 與 `a738f04`，未採 `ad9a611`；驗證結果與決策見 [REVIEW](docs/REVIEW.md#2026-11-03-opt-in-temporary-chat-and-mcp-readiness)。

## 近期：可以直接動手
| 項目 | 為什麼 | 驗收方式 | 建議執行者 | 證據 |
| --- | --- | --- | --- | --- |
| 續移植 6.1.14～6.1.17 其餘 defer 項的 Windows 適用修正 | 尚有 rendering／native task restoration、UI 契約、BOM 與診斷等差量待依 DECISIONS 條件逐項評估；Full Access `760ab5a`／`e6ed93a`／`b48477e` 維持成組延後 | 依 DECISIONS 剩餘清單逐項判斷 Windows 適用性與相依條件；修 bug 先紅後綠，保留模型／effort 與 Windows 路徑防線，通過完整本機閘門；帳戶與打包獨立驗收，不升公開安裝器 pin；`53b6050` 改由發版列追蹤 | Codex | [docs/DECISIONS.md](docs/DECISIONS.md#2026-10-29-upstream-review-6114-6117-912-934)、[docs/DECISIONS.md](docs/DECISIONS.md#2026-11-03-opt-in-temporary-chat-and-mcp-readiness) |

## 中期：等條件成立再做
| 項目 | 觸發條件 | 驗收方式 | 建議執行者 | 證據 |
| --- | --- | --- | --- | --- |
| 驗證新版 UI、模型選擇與完整工具連接 | 維護者同意帳戶驗收並完成必要登入 | 依 TEST_PLAN 與 release-validation，在隔離 DEV profile 用一筆最小聊天核對模型、effort、送出／完成、Temporary Chat 選項與 connector 可用性及工具回執；保存去識別證據，達標即停 | 維護者 | [docs/TEST_PLAN.md:11](docs/TEST_PLAN.md)、[AGENTS.md:16](AGENTS.md)；接續開發報告（2026-10-2x）「實機冒煙測試」 |
| 發布已驗證的 Windows 新版 | 實機與打包驗收完成（含 2026-11-04 Electron 45.2.2 未完成的 `app:smoke`：安裝程式三次超過 120 秒），維護者決定發布；下一次安裝器版本一併採用 `53b6050` 的 60 s command poll／tools/list ABI，與發版同步只刷新一次 connector | 先完成 poll 上限與 transport 回歸，再刷新 connector 核對 ABI；版本、README、安裝腳本、`REVIEWED_RELEASE_VERSION` 與 release-contract 同步；以 Bun 1.4.2 通過 canonical gate，驗證資產雜湊與更新路徑 | Codex | [docs/DECISIONS.md:620](docs/DECISIONS.md)、[docs/DECISIONS.md:647](docs/DECISIONS.md)、[AGENTS.md:3](AGENTS.md) |
| 重評回覆提早中止與本地 effort 標籤補丁 | 上游 #910 有平台通用根因／Windows 重現，或 #911 上游修正／新標籤被實際觀察 | 用實際失敗輸入先重現；修正後驗證完成偵測、滑桿位置與模型家族，不猜測未見翻譯 | Codex | [docs/DECISIONS.md:662](docs/DECISIONS.md)、[docs/DECISIONS.md:672](docs/DECISIONS.md) |
| 重審 #935～#963 與工作區分支的延後項 | DECISIONS 各項觸發條件成立；涉及 image retention／MCP、帳戶方案與傳輸界線者先由維護者決定 | 依逐項檔案與行號證據採用；工作區與跨 turn 來源保留權限防線；修 bug 先紅後綠，通過完整本機閘門，帳戶驗收獨立執行 | Codex | [docs/DECISIONS.md](docs/DECISIONS.md#2026-11-03-upstream-review-935959-and-current-workspace-roots)、[docs/DECISIONS.md](docs/DECISIONS.md#2026-11-04-upstream-review-960963) |
| 重審 minimatch 舊 API 安全延後 | 2026-11-17 到期，或相容父套件發布／告警與受影響 lock 節點變動 | 移除舊 API 路徑或重新審查精確延後；audit、verify 與 archive/filter 回歸通過，打包行為另依 release 驗收 | Codex | [.github/audit-deferrals.json](.github/audit-deferrals.json)、[docs/DECISIONS.md](docs/DECISIONS.md#2026-11-03-launcher-minimatch-advisory-ghsa-g3hv-75wg-m249) |
| 重審 chromium-bidi、motion、@vitejs/plugin-react、turndown 延後升級 | freshness 回報 latest 超出延後界線，或相容工具鏈／動畫視覺驗收條件成立 | 依宣告的精確版本或版本線界線重評升級或延後理由；兩個 workspace audit 與完整 verify 通過；Motion 升級另查頁面／提示動畫，plugin-react 與相容 Vite 一起驗證，chromium-bidi 須通過相容性測試 | Codex | [docs/DECISIONS.md](docs/DECISIONS.md#2026-11-03-dependency-rereview) |

## 刻意不做
| 不做什麼 | 理由 | 什麼情況下重新考慮 |
| --- | --- | --- |
| 因原始碼升級就直接改公開安裝 pin | 發布與來源版刻意分開，見 [docs/DECISIONS.md:647](docs/DECISIONS.md) | 已取得發布授權並完成打包與帳戶驗收 |
| 改用 Codex Native3 或猜測新的 effort 翻譯 | 既有 connector 與標籤決策見 [docs/DECISIONS.md:620](docs/DECISIONS.md)、[docs/DECISIONS.md:678](docs/DECISIONS.md) | 工具契約分岔或新標籤有實測證據 |
| 引進非 Windows 發布與重寫歷史 | 平台邊界見 [AGENTS.md:7](AGENTS.md)；無共同祖先是已知狀態 | 維護者另立平台或歷史遷移需求 |

## 維護方式
每週依 [tools/upstream_baseline.json](tools/upstream_baseline.json) 四軸查增量，採用理由連到 [docs/DECISIONS.md](docs/DECISIONS.md)，不從版本號推定已合併。依賴 latest 超出宣告的精確版本或版本線界線就重審；離線、canonical gate、帳戶與發布驗收分別留證，發布前才同步公開版本入口。
