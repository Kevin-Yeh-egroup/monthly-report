Write-Host "🔧 Ctrl 鍵問題診斷工具" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 基本系統資訊
Write-Host "系統資訊：" -ForegroundColor Yellow
$os = Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion
Write-Host "作業系統: $($os.WindowsProductName)" -ForegroundColor White
Write-Host "版本: $($os.WindowsVersion)" -ForegroundColor White
Write-Host ""

# 檢查鍵盤
Write-Host "鍵盤檢查：" -ForegroundColor Yellow
$keyboard = Get-WmiObject -Class Win32_Keyboard | Select-Object -First 1
Write-Host "鍵盤: $($keyboard.Name)" -ForegroundColor White
Write-Host "狀態: $($keyboard.Status)" -ForegroundColor White
Write-Host ""

# 檢查 Cursor 進程
Write-Host "Cursor 進程檢查：" -ForegroundColor Yellow
$cursor = Get-Process | Where-Object { $_.ProcessName -like "*cursor*" -or $_.ProcessName -like "*Cursor*" }
if ($cursor) {
    Write-Host "發現 Cursor 進程: $($cursor.ProcessName)" -ForegroundColor Green
} else {
    Write-Host "未發現 Cursor 進程" -ForegroundColor Red
}
Write-Host ""

Write-Host "建議解決步驟：" -ForegroundColor Yellow
Write-Host "1. 重新啟動 Cursor" -ForegroundColor White
Write-Host "2. 檢查輸入法設定" -ForegroundColor White
Write-Host "3. 更新鍵盤驅動程式" -ForegroundColor White
Write-Host "4. 檢查 Windows 輕鬆存取設定" -ForegroundColor White
Write-Host ""

Write-Host "詳細解決方案請參考 CURSOR_CTRL_FIX.md" -ForegroundColor Cyan 