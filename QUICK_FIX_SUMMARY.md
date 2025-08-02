# Cursor Ctrl 鍵問題快速修復指南

## 🚨 立即解決步驟

### 1. 關閉所有 Cursor 進程
```powershell
# 在 PowerShell 中運行
Get-Process | Where-Object { $_.ProcessName -like "*cursor*" } | Stop-Process -Force
```

### 2. 清除 Cursor 快取
```powershell
# 清除工作區快取
Remove-Item -Path "$env:APPDATA\Cursor\User\workspaceStorage" -Recurse -Force
```

### 3. 檢查輸入法設定
1. 按 `Win + I` 開啟設定
2. 前往 `時間與語言 > 語言`
3. 點擊您的語言 > 選項
4. 確保沒有使用 Ctrl 鍵切換輸入法

### 4. 檢查 Windows 輕鬆存取設定
1. 按 `Win + I` 開啟設定
2. 前往 `輕鬆存取 > 鍵盤`
3. 確保以下選項都關閉：
   - 粘滯鍵
   - 篩選鍵
   - 切換鍵

### 5. 重新啟動 Cursor
重新啟動 Cursor 並測試 Ctrl 鍵功能。

## 🔧 自動修復腳本

我已經為您創建了以下修復工具：

1. **`fix-cursor-ctrl.ps1`** - 自動修復腳本
2. **`test-ctrl-keys.html`** - 瀏覽器測試工具
3. **`CURSOR_CTRL_FIX.md`** - 詳細故障排除指南

## 📋 測試步驟

### 基本快捷鍵測試
- `Ctrl + C` - 複製
- `Ctrl + V` - 貼上
- `Ctrl + X` - 剪下
- `Ctrl + Z` - 復原
- `Ctrl + A` - 全選
- `Ctrl + F` - 搜尋

### 程式碼編輯快捷鍵測試
- `Ctrl + /` - 註解/取消註解
- `Ctrl + D` - 選取下一個相同項目
- `Ctrl + L` - 選取整行
- `Ctrl + Shift + L` - 選取所有相同項目

## 🎯 常見問題解決

### 問題 1: 中文輸入法衝突
**解決方案：**
1. 切換到英文輸入法
2. 在輸入法設定中關閉 "使用 Ctrl 鍵切換輸入法"
3. 設定輸入法快捷鍵為其他組合（如 `Alt + Shift`）

### 問題 2: 多個 Cursor 進程
**解決方案：**
1. 使用工作管理員關閉所有 Cursor 進程
2. 重新啟動 Cursor

### 問題 3: 瀏覽器模式問題
**解決方案：**
1. 使用桌面應用程式版本
2. 檢查瀏覽器擴充功能
3. 清除瀏覽器快取

## 🔄 進階故障排除

如果基本修復無效，請嘗試：

1. **更新鍵盤驅動程式**
   - 前往裝置管理員
   - 右鍵點擊鍵盤裝置 > 更新驅動程式

2. **重新安裝 Cursor**
   - 完全解除安裝 Cursor
   - 刪除所有相關資料夾
   - 重新下載並安裝最新版本

3. **檢查硬體問題**
   - 在其他應用程式中測試 Ctrl 鍵
   - 嘗試使用不同的鍵盤

## 📞 聯絡支援

如果問題持續存在：
1. 前往 [Cursor GitHub Issues](https://github.com/getcursor/cursor/issues)
2. 提供詳細的問題描述和系統資訊
3. 附上錯誤日誌和設定檔案

## 📁 相關檔案

- `CURSOR_CTRL_FIX.md` - 完整故障排除指南
- `fix-cursor-ctrl.ps1` - 自動修復腳本
- `test-ctrl-keys.html` - 測試工具
- `.vscode/settings.json` - 更新的 Cursor 設定

---

**注意：** 執行修復腳本前，請確保已儲存所有工作，因為腳本會關閉所有 Cursor 進程。 