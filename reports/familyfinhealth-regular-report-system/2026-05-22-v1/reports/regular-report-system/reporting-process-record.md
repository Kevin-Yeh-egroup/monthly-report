# 固定報表流程紀錄

本檔記錄 Kevin 對固定報表流程的要求與變更，避免日報、週報、月報與長週期報表在後續自動化中跑偏。

## 目前原則

1. 報表要整理成可報告的重點，不做流水帳。
2. 每日報表必須同時服務「今天怎麼工作」與「昨天營運如何」。
3. Gmail 統計報告搜尋必須包含 `in:anywhere`。
4. Gmail 只讀取，不刪除、移動、封存、標記已讀或改變郵件狀態。
5. C:\git、GitHub、Cursor、Codex 對話與手動補充都屬於工作素材池。
6. 日報歷史在 `report-index.html` 必須依月份分類。
7. 獎章用來留下可追溯成果，不做排名，也不鼓勵刷分。
8. 成就紀錄要能被月報、季報、半年報與年報追溯。
9. Codex 使用演進要獨立記錄，包含每日用法調整、踩坑、解法、成果與可教學素材。
10. 給沒有資訊背景夥伴的 Codex 教學檔要保持白話、任務導向、可實作，不以工程術語為主。
11. 每日要根據 Kevin 的提問、任務敘述與追問方式給回饋，指出做得好的地方、可以更清楚的地方與隔天練習。
12. 是否需要 agent 要先做判斷：清楚的一次性任務可直接處理；長期追蹤、策略、教學、跨工具回顧與成長回饋要納入 agent/反思視角。
13. 所有固定報表都要有可點的歷史索引；日報依月份，週報依自然週，月報依年月，季報/半年報/年報依年度週期列出。
14. 固定報表發布採「候選提醒」模式：自動化只產生發布候選摘要、差異摘要、敏感度與歷史索引檢查，不自動 GitHub push、Vercel deploy 或分享 URL。
15. 資料來源優先級：familyfinhealth 後台 overview、familyfinhealth 後台 trends、Google Ads campaign、Codex/GitHub/Vercel 紀錄是第一順位；信箱中的日報、週報、月報、季報等摘要是第二順位，只作為補洞、交叉驗證或第一順位不可讀時的回推來源。
16. 週報依實際月曆週產生，目前以週日到週六為一週；若同一週橫跨月份，正式週報歷史必須拆成月內片段，例如 2026/05/01-05/02 與 2026/05/03-05/09 是兩份週報。
17. Kevin 的目標狀態是本機 `publish-ready/` 更新後公開 production 站也自動更新，但啟用前必須先得到明確批准，且範圍只限已核准公開的好理家在報表入口，不可自動處理敏感內容、權限、網域或移除 noindex。

## 2026-05-22 變更

| 日期 | 變更 | 原因 | 相關產出 |
| --- | --- | --- | --- |
| 2026-05-22 | 合併「每日工作簡報」與「每日工作與營運日報」 | Kevin 要每天早上只跑一份完整簡報/日報 | `automation-7` |
| 2026-05-22 | 每日合併版排程改為 08:10 | 配合早上工作啟動時間 | `automation-7` |
| 2026-05-22 | 舊的單獨「每日工作簡報」暫停 | 避免同一天重複產出兩份簡報 | `automation` |
| 2026-05-22 | 先手動執行一次合併版 | 產生 2026/05/22 今日簡報 + 2026/05/21 營運日報 | `daily-report-2026-05-21.html` |
| 2026-05-22 | 新增 Codex 使用演進史 | Kevin 要每日記錄開始使用 Codex 後的調整、坑與成果 | `codex-evolution-history.md` |
| 2026-05-22 | 新增非資訊背景夥伴教學檔 | 後續要能對夥伴進行 Codex 入門教學 | `codex-nontechnical-partner-teaching.md` |
| 2026-05-22 | 更新日/週/月季年自動化規則 | 讓固定報表持續整理 Codex 演進素材與教學更新 | `automation-7`、`automation-6`、`automation-8`、`automation-9` |
| 2026-05-22 | 新增 Kevin 每日 Codex 使用回饋 | 根據每日提問與任務敘述整理回饋，協助 Kevin 看見不足與成長方向 | `kevin-codex-daily-feedback.md` |
| 2026-05-22 | 補上 agent 使用判斷規則 | 回應 Kevin 對「為什麼沒有帶入 agent」的提醒，避免後續長期任務缺少分流與反思視角 | `kevin-codex-daily-feedback.md`、`automation-7` |
| 2026-05-22 | 固定報表接上 `publish-codex-report` 流程 | Kevin 同意先建立本機 publish-ready 套件，保留審核與批准關卡，避免報表在未確認敏感度前外流 | `scripts/build-report-publish-ready.ps1`、`publish-ready/`、`automation-6`、`automation-7`、`automation-8`、`automation-9` |
| 2026-05-22 | 重製跨裝置報表存取流程 | 將正式教學與產生器更新為 `cross-device-static-v2`：純靜態 publish-ready package、修正 README 反引號跳脫造成的路徑斷裂、標明外部動作批准狀態，並把 app-level Basic Auth middleware 從標準解法中移除 | `codex-regular-report-tutorial.md`、`scripts/build-report-publish-ready.ps1`、`publish-ready/README.md`、`publish-ready/PUBLICATION_CHECKLIST.md`、`publish-ready/PUBLISH_MANIFEST.json` |
| 2026-05-22 | 採用發布候選提醒自動化 | Kevin 選擇先由自動化檢查本機報表更新與可發布差異，但 GitHub/Vercel production 仍需當次批准 | `codex-regular-report-tutorial.md`、`reporting-process-record.md`、`report-publish-candidate` |
| 2026-05-22 | 擴充歷史索引規則到所有固定報表 | Kevin 要週報、月報、季報、半年報、年度預回顧與年報都像日報一樣有歷史紀錄可點 | `report-index.html`、`codex-regular-report-tutorial.md`、`automation-6`、`automation-8`、`automation-9` |
| 2026-05-22 | 明確化資料來源優先級 | Kevin 指定後台 overview/trends、Google Ads 與 Codex/GitHub/Vercel 紀錄為第一順位，信箱報表為第二順位 | `codex-regular-report-tutorial.md`、`reporting-process-record.md` |
| 2026-05-22 | 明確化跨月週報切分 | Kevin 確認若週期跨月份，週報需依月內片段拆分，5/1-5/9 應拆成 5/1-5/2 與 5/3-5/9 | `codex-regular-report-tutorial.md`、`report-generation-timeline.md/html`、`report-index.html` |
| 2026-05-22 | 記錄公開站自動同步目標但暫不啟用 | 自動 GitHub/Vercel production 屬外部寫入與部署，需 Kevin 額外明確批准後才可改自動化 | `codex-regular-report-tutorial.md`、`reporting-process-record.md` |
| 2026-05-22 | 月報/長週期報表排程改為每月 1 日 00:00 | Kevin 要月報排程排每月 1 日 0:00；同一自動化也負責季報、半年報與年報檢查 | `automation-8`、`codex-regular-report-tutorial.md`、`report-generation-timeline.md/html` |

## 2026-05-22 本次資料來源

- Google Calendar：2026/05/22 行事曆。
- Gmail：好理家在每日統計報告、諮詢通知、投稿通知、回饋通知、Google Ads 建議信。
- `C:\git`：2026/05/21 Git log。
- Web research：Google Ads 官方回應式多媒體廣告最佳做法與自動套用建議說明。

## 已知缺口

- Slack 連接工具本次未提供可呼叫工具，因此今日簡報未納入 Slack。
- familyfinhealth 後台與 Google Ads 後台本次未直接讀取，營運數據以 Gmail 統計報告與 Google Ads 郵件為主。
