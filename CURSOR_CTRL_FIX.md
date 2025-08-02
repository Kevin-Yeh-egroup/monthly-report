# Cursor Ctrl 鍵問題解決指南

## 問題描述
在 Cursor 編輯器中，Ctrl 鍵組合快捷鍵無效或無法正常工作。

## 解決方案

### 1. 檢查 Cursor 設定

#### 1.1 開啟鍵盤快捷鍵設定
- 按 `Ctrl + K, Ctrl + S` 開啟鍵盤快捷鍵設定
- 或前往 `File > Preferences > Keyboard Shortcuts`

#### 1.2 檢查是否有衝突的快捷鍵
在搜尋欄位中輸入 `ctrl` 來查看所有 Ctrl 相關的快捷鍵。

### 2. 重置鍵盤快捷鍵

#### 2.1 重置為預設設定
1. 開啟命令面板 (`Ctrl + Shift + P`)
2. 輸入 "Preferences: Open Keyboard Shortcuts (JSON)"
3. 刪除所有自定義快捷鍵設定
4. 重新啟動 Cursor

#### 2.2 清除鍵盤快捷鍵快取
1. 關閉 Cursor
2. 刪除以下資料夾中的快取檔案：
   - Windows: `%APPDATA%\Cursor\User\workspaceStorage`
   - macOS: `~/Library/Application Support/Cursor/User/workspaceStorage`
   - Linux: `~/.config/Cursor/User/workspaceStorage`

### 3. 檢查系統層級設定

#### 3.1 Windows 系統
1. **檢查鍵盤驅動程式**
   - 前往 `裝置管理員 > 鍵盤`
   - 右鍵點擊鍵盤裝置 > 更新驅動程式

2. **檢查 Windows 快捷鍵設定**
   - 前往 `設定 > 輕鬆存取 > 鍵盤`
   - 確保沒有啟用會影響 Ctrl 鍵的選項

3. **檢查第三方軟體衝突**
   - 檢查是否有其他軟體攔截 Ctrl 鍵
   - 常見的衝突軟體：輸入法、螢幕錄製軟體、遊戲軟體

#### 3.2 檢查輸入法設定
1. 切換到英文輸入法
2. 測試 Ctrl 鍵是否正常工作
3. 如果正常，問題可能出在中文輸入法上

### 4. Cursor 特定設定

#### 4.1 更新 .vscode/settings.json
```json
{
    "terminal.integrated.sendKeybindingsToShell": true,
    "editor.acceptSuggestionOnEnter": "on",
    "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": false
    },
    "editor.tabCompletion": "on",
    "editor.wordBasedSuggestions": "on"
}
```

#### 4.2 檢查工作區設定
1. 開啟命令面板 (`Ctrl + Shift + P`)
2. 輸入 "Preferences: Open Workspace Settings (JSON)"
3. 確保沒有衝突的鍵盤設定

### 5. 測試步驟

#### 5.1 基本 Ctrl 快捷鍵測試
測試以下常用快捷鍵：
- `Ctrl + C` - 複製
- `Ctrl + V` - 貼上
- `Ctrl + X` - 剪下
- `Ctrl + Z` - 復原
- `Ctrl + A` - 全選
- `Ctrl + F` - 搜尋
- `Ctrl + S` - 儲存

#### 5.2 程式碼編輯快捷鍵測試
- `Ctrl + /` - 註解/取消註解
- `Ctrl + D` - 選取下一個相同項目
- `Ctrl + L` - 選取整行
- `Ctrl + Shift + L` - 選取所有相同項目

### 6. 進階故障排除

#### 6.1 重新安裝 Cursor
1. 完全解除安裝 Cursor
2. 刪除所有相關資料夾
3. 重新下載並安裝最新版本

#### 6.2 檢查硬體問題
1. 在其他應用程式中測試 Ctrl 鍵
2. 嘗試使用不同的鍵盤
3. 檢查鍵盤是否有硬體故障

### 7. 常見問題解決

#### 7.1 中文輸入法問題
如果使用中文輸入法，嘗試：
1. 切換到英文輸入法
2. 在輸入法設定中關閉 "使用 Ctrl 鍵切換輸入法"
3. 設定輸入法快捷鍵為其他組合

#### 7.2 瀏覽器模式問題
如果 Cursor 在瀏覽器模式中運行：
1. 檢查瀏覽器的快捷鍵設定
2. 確保沒有瀏覽器擴充功能攔截快捷鍵
3. 嘗試使用桌面應用程式版本

### 8. 預防措施

#### 8.1 定期備份設定
1. 匯出鍵盤快捷鍵設定
2. 備份 `.vscode` 資料夾
3. 記錄自定義設定

#### 8.2 保持更新
1. 定期更新 Cursor 到最新版本
2. 更新系統和驅動程式
3. 檢查已知問題和解決方案

## 聯絡支援

如果以上方法都無法解決問題：
1. 前往 Cursor 官方 GitHub Issues
2. 提供詳細的問題描述和系統資訊
3. 附上錯誤日誌和設定檔案

## 相關連結
- [Cursor 官方文件](https://cursor.sh/docs)
- [VS Code 鍵盤快捷鍵參考](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
- [Cursor GitHub Issues](https://github.com/getcursor/cursor/issues) 