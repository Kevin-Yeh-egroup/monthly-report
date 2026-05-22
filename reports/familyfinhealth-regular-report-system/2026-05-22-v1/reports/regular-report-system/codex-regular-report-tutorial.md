# Codex 固定報表操作教學

這份教學記錄 Kevin 的固定報表規則，讓日報、週報、月報、季報、半年報、年報與成就紀錄可以持續接起來。

## 報表種類

| 報表 | 週期 | 主要內容 |
| --- | --- | --- |
| 每日工作簡報與營運日報 | 每天 08:10 | 今日工作簡報 + 前一自然日營運日報 |
| 工作週報 | 每週日 20:00 | 上一自然週工作、營運數據、Ads 觀察、成果地圖 |
| 月報 | 每月 1 日 00:00 | 上一自然月正式月報；當月保留進行中月報 |
| 季報 | 4/1、7/1、10/1、1/1 00:00 | 上一自然季趨勢與成果 |
| 半年報 | 7/1、1/1 00:00 | 上一半年度趨勢與方向 |
| 年度預回顧 | 12/28 20:00 | 年度草稿、成就素材與次年建議 |
| 年報 | 1/1 00:00 | 上一年度正式年報 |
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

## 資料來源優先級

好理家在營運報表要優先使用可直接讀取的客觀來源，再把整理後的資訊放入報表入口。信箱中的日報、週報、月報、季報等摘要是第二順位，用來補洞、交叉驗證或在第一順位無法讀取時回推，不應取代第一順位。

第一順位來源：

1. `https://www.familyfinhealth.com/dbs/admin?tab=overview`：營運總覽與核心累計/當日數據。
2. `https://www.familyfinhealth.com/dbs/admin?tab=trends`：趨勢、期間比較與功能使用變化。
3. `https://ads.google.com/aw/campaigns?campaignId=23129428942&ocid=7708060066&workspaceId=0&euid=1528493179&__u=7708303971&uscid=7708060066&__c=5555126034&authuser=0`：Google Ads 曝光、點擊、CTR、CPC、費用與投放狀態。
4. Codex、GitHub、Vercel 紀錄：Codex 對話與產出、Git commit/PR/Issue、Vercel deployment、`publish-ready/PUBLISH_MANIFEST.json`、自動化紀錄與發布檢查。

第二順位來源：

- Gmail 中的好理家在日報、週報、月報、季報、半年報、年報與 Google Ads 建議信。

衝突處理：

- 若第一順位與第二順位數字不同，報表以第一順位為準，並在工作紀錄或資料口徑註記差異。
- 若第一順位暫時無法讀取，可用第二順位回推，但該報表要在資料口徑標為「信箱摘要回推，待後台驗證」。
- Codex/GitHub/Vercel 紀錄是工作、發布與系統演進的第一順位來源；familyfinhealth 與 Google Ads 是營運與廣告數據的第一順位來源。
- 報表頁面呈現整理後的客觀結論，不放登入失敗、抓取錯誤等操作細節；操作細節放在交付回覆、流程紀錄或 manifest。

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

## 歷史索引規則

所有固定報表都必須像日報一樣能從 `report-index.html` 點到歷史紀錄，不可以只有最新報表連結。

每次產生日報、週報、月報、季報、半年報、年度預回顧或年報時，都要同步更新 `report-index.html` 的歷史報表區：

1. 日報：依月份分組，先選月份再選日期。
2. 週報：依實際月曆週列出每一份週報，顯示日期區間；目前週期以週日到週六為一週，週日 20:00 產生上一個已結束週期。
3. 月報：依年月列出正式月報與當月進行中月報。
4. 季報：依年度與季度列出。
5. 半年報：依年度上半年/下半年列出。
6. 年度預回顧與年報：依年度列出，預回顧與正式年報都要能點。
7. 成就、獎章、流程、Codex 演進與教學檔要保留在同一個入口的歷史或輔助區，方便月報、季報、半年報與年報追溯。

如果某一類報表尚未產生，入口可以顯示「尚未產生」；一旦產生第一份，就要加入可點的歷史選項。

跨月週報切分規則：

- 週報依實際月曆週判斷週期，但如果同一週橫跨不同月份，必須按月份切成月內片段，避免月報引用到其他月份資料。
- 週期公式為 `max(週起日, 月初)` 到 `min(週迄日, 月末)`。
- 跨月週可以在工作紀錄中保留完整週脈絡，但 `report-index.html` 的正式週報歷史以月內片段為準。
- 以 2026/05 為例：2026/05/01-05/02 是 4/26-5/2 這一週的 5 月片段；2026/05/03-05/09 是完整週；2026/05/31 是 5/31-6/6 這一週的 5 月片段。

## Publish-codex-report 規則

固定報表可以走 `publish-codex-report` 流程，但預設只做到本機 `publish-ready` 套件。

標準做法：

1. 先完成本地 HTML 報表。
2. 執行 `scripts/build-report-publish-ready.ps1`，建立 `publish-ready/`。
3. 檢查 `publish-ready/PUBLICATION_CHECKLIST.md`。
4. 需要跨裝置或給他人看時，再由 Kevin 明確批准 GitHub 上傳、Vercel 部署或分享網址。
5. 跨裝置版本以純靜態 `publish-ready/` 為標準；不要把 no-framework Vercel static package 加上 app-level Basic Auth middleware 當成正式解法，之前這條路會在驗證後掉到 Vercel `404_NOT_FOUND`。
6. 需要 `private-preview` 時，優先使用主機層級保護（例如 Vercel Deployment Protection 或 Kevin 批准的等效保護），並在交付時記錄 URL 的實際存取狀態。

發布候選提醒採報告式自動化，不自動外發：

1. 自動化可檢查本機 `publish-ready/` 與報表檔是否有新版本。
2. 只產生發布候選摘要、差異摘要、敏感度建議、歷史索引檢查與需要 Kevin 批准的動作。
3. 未經 Kevin 在當次任務中明確批准，不可自動 GitHub commit/push、不可 Vercel deploy/promote、不可建立或分享新 URL。
4. 若 Kevin 批准 public-production，才可走公開 GitHub + Vercel production；仍要保留 `robots.txt` 與 `X-Robots-Tag: noindex, nofollow`，除非 Kevin 明確說要允許收錄。

公開站自動同步的待批准規則：

- Kevin 的目標狀態是：本機 `publish-ready/` 確認更新後，公開 production 站也要跟著更新部署。
- 這會產生 GitHub commit/push 與 Vercel production deploy，屬於外部寫入與部署權限；在 Kevin 明確批准啟用前，現行自動化仍維持「候選提醒」模式。
- 若 Kevin 批准啟用，適用範圍應限於好理家在報表入口與已標記為 `public-production` 的內容，不包含 private-preview、local-only、敏感資料、repo visibility、domain、權限或 noindex 移除。
- 自動同步前必須完成檢查：第一順位資料來源或 fallback 口徑已記錄、歷史索引已更新、`publish-ready/PUBLISH_MANIFEST.json` 已標註變更、`robots.txt` 與 `X-Robots-Tag: noindex, nofollow` 保留、公開 URL 檢查可回傳 200。

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
- 採用發布候選提醒自動化：自動檢查本機報表是否值得發布，但只回報候選摘要與缺口，等待 Kevin 批准後才做 GitHub/Vercel。
- 所有固定報表的歷史紀錄都要能從 `report-index.html` 點開；週報、月報、季報、半年報、年度預回顧與年報不得只保留最新連結。
- `automation-8` 月報/季報/半年報/年報排程改為每月 1 日 00:00。
