# Codex 固定報表操作教學

這份教學記錄 Kevin 的固定報表規則，讓日報、週報、月報、季報、半年報、年報與成就紀錄可以持續接起來。

## 報表種類

| 報表 | 週期 | 主要內容 |
| --- | --- | --- |
| 每日工作簡報與營運日報 | 每天 08:10 | 今日工作簡報 + 前一自然日營運日報 |
| 工作週報 | 每週日 20:00 | 上一自然週工作、營運數據、Ads 觀察、成果地圖 |
| 月報 | 每月 1 日 20:00 | 上一自然月正式月報；當月保留進行中月報 |
| 季報 | 4/1、7/1、10/1、1/1 20:00 | 上一自然季趨勢與成果 |
| 半年報 | 7/1、1/1 20:00 | 上一半年度趨勢與方向 |
| 年度預回顧 | 12/28 20:00 | 年度草稿、成就素材與次年建議 |
| 年報 | 1/1 20:00 | 上一年度正式年報 |
| Codex 演進紀錄 | 每天隨日報更新 | 使用方式調整、踩坑、解法、成果與可教學素材 |
| Kevin 每日 Codex 使用回饋 | 每天隨日報更新 | 根據每日提問、任務敘述與追問方式，整理優勢、盲點與隔天練習 |
| Codex 夥伴教學檔 | 月報、季報與流程變更時更新 | 給沒有資訊背景夥伴的教學設計與提示語模板 |

## 每日報表規則

每日報表現在是合併版，檔名仍使用前一自然日：

```text
daily-report-YYYY-MM-DD.html
```

頁面上半部是「今日工作簡報」，下半部是「前一自然日營運日報」。

每日必讀來源：

- Google Calendar：今天行事曆、會議準備、衝突與深度工作空檔。
- Gmail/Slack：需要回覆或跟進的訊息。Gmail 只讀取，不改變郵件狀態。
- Gmail 統計報告：搜尋必須包含 `in:anywhere`，避免垃圾桶中的統計報告漏掉。
- `C:\git`：前一自然日 Git log。
- GitHub PR / Issue、Cursor、Codex 對話與手動補充。
- familyfinhealth 後台與 Google Ads：可登入時讀取；不可讀時在交付回覆中簡短說明。

每日報表呈現：

- 今日工作簡報：今天最該處理的 3 件事、行事曆、跟進項目、深度工作空檔。
- 前一日摘要：營運重點、工作地圖、核心數據、服務與內容訊號。
- Codex 演進紀錄：今天調整了哪些工作流、踩到什麼坑、解法是什麼、產出哪些可複用成果。
- Kevin 每日回饋：根據提問、任務敘述與追問方式，整理做得好的地方、可以更清楚的地方與明日練習。
- 核心數據至少包含註冊、訪客、點擊/使用或可替代的工具使用指標。
- 今日獎章要有證據來源，並同步寫入獎章牆與成就紀錄。
- 下方保留下一步優化辦法。

不要在報告頁面呈現：

- 檔案異動、新增行數、刪除行數。
- Git 證據表。
- 設計依據。
- 資料來源存取狀態。
- Google Ads 轉換數據。

## 必更新檔案

每日跑完後，至少確認這些檔案：

- `daily-report-YYYY-MM-DD.html`
- `report-index.html`
- `daily-report-data-2026-05-backfill.json` 或當月資料檔
- `badge-ledger-YYYY-MM.json`
- `badge-ledger-YYYY-MM.html`
- `achievement-record-index.html`
- `monthly-report-YYYY-MM-in-progress.html`
- `report-generation-timeline.md`
- `report-generation-timeline.html`
- `reporting-process-record.md`
- `reporting-process-record.html`
- `codex-evolution-history.md`
- `kevin-codex-daily-feedback.md`
- `codex-nontechnical-partner-teaching.md`（流程或教學內容變更時）
- `publish-ready/`（只建立本機發布預備包，不自動上傳或部署）

## Publish-codex-report 規則

固定報表可以走 `publish-codex-report` 流程，但預設只做到本機 `publish-ready` 套件。

標準做法：

1. 先完成本地 HTML 報表。
2. 執行 `scripts/build-report-publish-ready.ps1`，建立 `publish-ready/`。
3. 檢查 `publish-ready/PUBLICATION_CHECKLIST.md`。
4. 需要跨裝置或給他人看時，再由 Kevin 明確批准 GitHub 上傳、Vercel 部署或分享網址。
5. 跨裝置版本以純靜態 `publish-ready/` 為標準；不要把 no-framework Vercel static package 加上 app-level Basic Auth middleware 當成正式解法，之前這條路會在驗證後掉到 Vercel `404_NOT_FOUND`。
6. 需要 `private-preview` 時，優先使用主機層級保護（例如 Vercel Deployment Protection 或 Kevin 批准的等效保護），並在交付時記錄 URL 的實際存取狀態。

預設敏感度：

- 日報、成就紀錄、Codex 使用回饋：`local-only` 或 `private-preview`，不自動發布。
- 週報、月報、季報、半年報、年報：可先準備 `private-preview` 套件，但部署前必須確認讀者與敏感度。
- 公開報告：只有 Kevin 明確說可以公開時，才可走 `public-report`。

重要限制：

- `file:///` 不是跨裝置分享方式。
- GitHub private repo 只代表原始碼私有，不代表 Vercel URL 有權限保護。
- `robots.txt`、`noindex`、不公開連結都不是存取控制。
- `publish-ready/.vercel/` 是本機 CLI 狀態，不是報表內容或版本化交付物；交付與上傳時以 `PUBLISH_MANIFEST.json`、`README.md`、`PUBLICATION_CHECKLIST.md` 和 `reports/...` 內容為準。
- 未經 Kevin 明確批准，不可上傳 GitHub、不可部署 Vercel、不可分享 URL。

## 2026-05-22 流程變更

- `automation-7` 改名為「每日工作簡報與營運日報」。
- 排程改成每天 08:10。
- 舊的 `automation`「每日工作簡報」已暫停，避免重複產出。
- 首次合併版已產生 `daily-report-2026-05-21.html`。
- 新增 `codex-evolution-history.md`，每日記錄 Codex 使用演進、調整、踩坑、解法與成果。
- 新增 `codex-nontechnical-partner-teaching.md`，作為沒有資訊背景夥伴的 Codex 教學主檔。
- 新增 `kevin-codex-daily-feedback.md`，每日根據 Kevin 的提問與任務敘述整理回饋，協助 Kevin 與 Codex 一起成長。
- 週報、月報、季報與年度報表都要把 Codex 演進素材整理成可報告、可複用、可教學的內容。
- 固定報表同意接上 `publish-codex-report` 流程；先建立本機 `publish-ready` 套件，但不自動上傳、不自動部署、不產生分享網址。
- 跨裝置報表流程重製為 `cross-device-static-v2`：產生器會寫出純靜態 package、明確的本機/preview/公開邊界、外部動作批准狀態與存取控制提醒。
