# 路線圖

> 本 repo 後續工作的單一真相源。做完一項，就在同一個 commit 刪掉那一列；新工作只加在這裡。
> 現況段的數字是 2026-10-29 依 `main` `03cf40ba9fb3` 查的快照，開工前先重查 GitHub。

## 現況
本 fork 將 ChatGPT Web 接入 Windows Codex 工作流；原始碼已採用上游 6.1.13，公開安裝器仍釘在 v5.0.6，這是刻意的發版邊界（[README.md:26](README.md)、[docs/DECISIONS.md:647](docs/DECISIONS.md)）。2026-10-29 `gh` 查詢記錄各主要 workflow 最近一次（2026-10-25）結果成功、開啟安全告警為 0；但 2026-10-29 推送後沒有任何 workflow 被觸發，`gh workflow run CI` 回 HTTP 422「Actions has been disabled for this repository」，而 `actions/permissions` 顯示 enabled，所以此後的 commit 都沒有 CI 證據；issues 停用而未查到 issue；上游最新 release 為 v6.1.14（2026-10-26），因此舊 Upstream check 成功不能證明新版本已審（2026-10-29 `gh` 查詢）。登入、MCP 與打包後實機行為仍需獨立驗收（[docs/REVIEW.md:15](docs/REVIEW.md)）。

## 近期：可以直接動手
| 項目 | 為什麼 | 驗收方式 | 建議執行者 | 證據 |
| --- | --- | --- | --- | --- |
| 恢復 Actions 的觸發 | 推送不觸發任何 workflow，之後的改動都沒有 CI 把關；API 與實際行為不一致，要從 repo 設定頁處理 | 到 https://github.com/SanHsien/codex-chatgpt-web/settings/actions 確認設定，並看 https://github.com/SanHsien/codex-chatgpt-web/actions 有沒有要求重新啟用的提示；之後 `gh workflow run CI -R SanHsien/codex-chatgpt-web` 不再回 422，最新 commit 有 CI run 且 success | 維護者 | 2026-10-29 `gh workflow run` 回 422；`gh api repos/SanHsien/codex-chatgpt-web/actions/permissions` |
| 審查 baseline 之後的上游更新與新 release | 上游 v6.1.14（2026-10-26）晚於已審 `0901b9f`（6.1.13） | 重新取得四軸資料，讀差量與 release；逐筆採用／延後／拒絕記入既有決策，通過嚴格 baseline 檢查才推進水位，不直接升安裝器 | Codex | [tools/upstream_baseline.json:9](tools/upstream_baseline.json)；2026-10-29 `gh release list -R miuuyy/codex-chatgpt-web` |
| 校正 fork 文件的舊基準與維護紀錄入口 | FORK 還列舊基準，CHANGELOG 未反映後續主要同步 | 對照 git log 與 DECISIONS 修正來源基準、來源版與發布版的描述；保留已發布安裝器 pin；待辦只連本路線圖 | Claude Sonnet | [FORK.md:12](FORK.md)、[CHANGELOG.md:6](CHANGELOG.md)、[docs/DECISIONS.md:647](docs/DECISIONS.md) |

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
