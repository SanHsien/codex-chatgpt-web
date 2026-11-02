# 路線圖

> 本 repo 後續工作的單一真相源。做完一項，就在同一個 commit 刪掉那一列；新工作只加在這裡。
> 現況段的 GitHub 資料為 2026-10-29 快照；上游四軸已重查，fork Actions 與安全告警仍沿用當日先前查詢，開工前先重查。

## 現況
本 fork 將 ChatGPT Web 接入 Windows Codex 工作流；原始碼已採用上游 6.1.13，公開安裝器仍釘在 v5.0.6，這是刻意的發版邊界（[README.md:26](README.md)、[docs/DECISIONS.md:647](docs/DECISIONS.md)）。2026-10-29 `gh` 查詢記錄各主要 workflow 最近一次（2026-10-25）結果成功、開啟安全告警為 0；2026-10-29 曾因 GitHub 自動停用 fork 的 workflow 而推送不觸發（API 仍顯示 enabled），同日在 Actions 頁按「re-enable」後恢復；issues 停用而未查到 issue；上游最新 release 為 v6.1.17（2026-10-29），已逐筆審查 baseline 後 38 筆 commit、7 筆新 PR 與 14 筆新 issue；四軸已推進至 `860fa57`／PR #934／issue #933／僅 main，這是審查水位而非來源升級（[docs/DECISIONS.md](docs/DECISIONS.md#2026-10-29-upstream-review-6114-6117-912-934)）。6.1.14～6.1.17 差量只移植了 #924 inline model picker、#932 正向 Luna 能力證明及其前置 #902 Think sprite（先紅後綠驗證），其餘 MCP ABI、Temporary Chat 預設、Full Access 工作區等項目維持維護者決定／延後狀態（[docs/DECISIONS.md](docs/DECISIONS.md#2026-10-31-port-inline-model-control-924927928-and-positive-luna-capability-evidence-932)）。登入、MCP 與打包後實機行為仍需獨立驗收（[docs/REVIEW.md:15](docs/REVIEW.md)）。

## 近期：可以直接動手
| 項目 | 為什麼 | 驗收方式 | 建議執行者 | 證據 |
| --- | --- | --- | --- | --- |
| 續移植 6.1.14～6.1.17 其餘 defer 項的 Windows 適用修正 | 已移植 #924、#932、#902；其餘仍 defer 的差量含 MCP 契約（`53b6050`、`a738f04`）、權限與壓縮（`760ab5a` 的 Full Access 附加工作區，需與 `e6ed93a`／`b48477e` 一起移植）、傳遞／重試與多段壓縮（`e1780b1`、`f9325c9`、`ffe041f`）、runtime 持久化（`0a8f233`）、精確 model picker（`89f0ead`）、渲染身分診斷（`b6043e0`）、Doctor 壓縮檢查（`7e6e1a0`）與偏好遷移；完整清單見 DECISIONS 該段表格與新增段落第 5 點 | 依 DECISIONS 逐項移植；每個修 bug 先紅後綠，保留既有模型／effort 與 Windows 路徑防線；MCP ABI 與 Temporary Chat 預設先由維護者決定；通過完整本機閘門，帳戶與打包依原條件獨立驗收，不升公開安裝器 pin | Codex | [docs/DECISIONS.md](docs/DECISIONS.md#2026-10-29-upstream-review-6114-6117-912-934)、[docs/DECISIONS.md](docs/DECISIONS.md#2026-10-31-port-inline-model-control-924927928-and-positive-luna-capability-evidence-932) |

## 中期：等條件成立再做
| 項目 | 觸發條件 | 驗收方式 | 建議執行者 | 證據 |
| --- | --- | --- | --- | --- |
| 驗證新版 UI、模型選擇與完整工具連接 | 維護者同意帳戶驗收並完成必要登入 | 依 TEST_PLAN 與 release-validation，在隔離 DEV profile 用一筆最小聊天核對模型、effort、送出／完成與工具回執；保存去識別證據，達標即停 | 維護者 | [docs/TEST_PLAN.md:11](docs/TEST_PLAN.md)、[AGENTS.md:16](AGENTS.md)；接續開發報告（2026-10-2x）「實機冒煙測試」 |
| 發布已驗證的 Windows 新版 | 實機與打包驗收完成，維護者決定發布 | 版本、README、安裝腳本、`REVIEWED_RELEASE_VERSION` 與 release-contract 同步；以 Bun 1.4.2 通過 canonical gate，驗證資產雜湊與更新路徑 | Codex | [docs/DECISIONS.md:620](docs/DECISIONS.md)、[docs/DECISIONS.md:647](docs/DECISIONS.md)、[AGENTS.md:3](AGENTS.md) |
| 重評回覆提早中止與本地 effort 標籤補丁 | 上游 #910 有平台通用根因／Windows 重現，或 #911 上游修正／新標籤被實際觀察 | 用實際失敗輸入先重現；修正後驗證完成偵測、滑桿位置與模型家族，不猜測未見翻譯 | Codex | [docs/DECISIONS.md:662](docs/DECISIONS.md)、[docs/DECISIONS.md:672](docs/DECISIONS.md) |
| 重審 chromium-bidi 與 Electron 延後升級 | freshness 提醒新 latest，或具備打包實測條件 | 依精確版本重評延後理由；兩個 workspace audit 與相關測試通過，Electron 跨版另驗打包執行 | Codex | commit `03cf40b`；[AGENTS.md:11](AGENTS.md)、[docs/DECISIONS.md:647](docs/DECISIONS.md) |

## 刻意不做
| 不做什麼 | 理由 | 什麼情況下重新考慮 |
| --- | --- | --- |
| 因原始碼升級就直接改公開安裝 pin | 發布與來源版刻意分開，見 [docs/DECISIONS.md:647](docs/DECISIONS.md) | 已取得發布授權並完成打包與帳戶驗收 |
| 改用 Codex Native3 或猜測新的 effort 翻譯 | 既有 connector 與標籤決策見 [docs/DECISIONS.md:620](docs/DECISIONS.md)、[docs/DECISIONS.md:678](docs/DECISIONS.md) | 工具契約分岔或新標籤有實測證據 |
| 引進非 Windows 發布與重寫歷史 | 平台邊界見 [AGENTS.md:7](AGENTS.md)；無共同祖先是已知狀態 | 維護者另立平台或歷史遷移需求 |

## 維護方式
每週依 [tools/upstream_baseline.json](tools/upstream_baseline.json) 四軸查增量，採用理由連到 [docs/DECISIONS.md](docs/DECISIONS.md)，不從版本號推定已合併。依賴 latest 超過精確延後版本就重審；離線、canonical gate、帳戶與發布驗收分別留證，發布前才同步公開版本入口。
