# Windows 鍵盤設定檢查腳本 (簡化版)
Write-Host "🔧 Windows 鍵盤設定檢查工具" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查 Windows 版本
Write-Host "1. 系統資訊：" -ForegroundColor Yellow
$osInfo = Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion
Write-Host "   作業系統: $($osInfo.WindowsProductName)" -ForegroundColor White
Write-Host "   版本: $($osInfo.WindowsVersion)" -ForegroundColor White
Write-Host ""

# 檢查鍵盤驅動程式
Write-Host "2. 鍵盤驅動程式檢查：" -ForegroundColor Yellow
$keyboards = Get-WmiObject -Class Win32_Keyboard
foreach ($keyboard in $keyboards) {
    Write-Host "   鍵盤: $($keyboard.Name)" -ForegroundColor White
    Write-Host "   狀態: $($keyboard.Status)" -ForegroundColor White
    Write-Host ""
}

# 檢查正在運行的進程
Write-Host "3. 可能衝突的進程檢查：" -ForegroundColor Yellow
$suspiciousProcesses = @("inputmethod", "ime", "autohotkey", "keytweak", "powertoys")
$runningProcesses = Get-Process | Where-Object { $_.ProcessName -ne "Idle" }
$foundProcesses = @()

foreach ($process in $runningProcesses) {
    foreach ($suspicious in $suspiciousProcesses) {
        if ($process.ProcessName -like "*$suspicious*") {
            $foundProcesses += $process
            break
        }
    }
}

if ($foundProcesses.Count -gt 0) {
    Write-Host "   發現可能衝突的進程：" -ForegroundColor Red
    foreach ($process in $foundProcesses) {
        Write-Host "     $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Red
    }
} else {
    Write-Host "   未發現明顯衝突的進程" -ForegroundColor Green
}
Write-Host ""

# 檢查 Cursor 相關進程
Write-Host "4. Cursor 進程檢查：" -ForegroundColor Yellow
$cursorProcesses = Get-Process | Where-Object { $_.ProcessName -like "*cursor*" -or $_.ProcessName -like "*Cursor*" }
if ($cursorProcesses.Count -gt 0) {
    Write-Host "   發現 Cursor 相關進程：" -ForegroundColor Green
    foreach ($process in $cursorProcesses) {
        Write-Host "     $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor White
    }
} else {
    Write-Host "   未發現 Cursor 進程正在運行" -ForegroundColor Yellow
}
Write-Host ""

# 建議
Write-Host "5. 建議的解決步驟：" -ForegroundColor Yellow
Write-Host "   1. 重新啟動 Cursor" -ForegroundColor White
Write-Host "   2. 檢查輸入法設定，確保沒有使用 Ctrl 鍵切換輸入法" -ForegroundColor White
Write-Host "   3. 暫時關閉其他可能衝突的軟體" -ForegroundColor White
Write-Host "   4. 更新鍵盤驅動程式" -ForegroundColor White
Write-Host "   5. 檢查 Windows 輕鬆存取設定" -ForegroundColor White
Write-Host "   6. 重新安裝 Cursor" -ForegroundColor White
Write-Host ""

Write-Host "檢查完成！" -ForegroundColor Green 