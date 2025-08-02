# Windows 鍵盤設定檢查腳本
# 用於診斷 Ctrl 鍵問題

Write-Host "🔧 Windows 鍵盤設定檢查工具" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查 Windows 版本
Write-Host "1. 系統資訊：" -ForegroundColor Yellow
$osInfo = Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, WindowsBuildLabEx
Write-Host "   作業系統: $($osInfo.WindowsProductName)" -ForegroundColor White
Write-Host "   版本: $($osInfo.WindowsVersion)" -ForegroundColor White
Write-Host "   建置: $($osInfo.WindowsBuildLabEx)" -ForegroundColor White
Write-Host ""

# 檢查鍵盤驅動程式
Write-Host "2. 鍵盤驅動程式檢查：" -ForegroundColor Yellow
$keyboards = Get-WmiObject -Class Win32_Keyboard
foreach ($keyboard in $keyboards) {
    Write-Host "   鍵盤: $($keyboard.Name)" -ForegroundColor White
    Write-Host "   描述: $($keyboard.Description)" -ForegroundColor White
    Write-Host "   狀態: $($keyboard.Status)" -ForegroundColor White
    Write-Host ""
}

# 檢查輸入法設定
Write-Host "3. 輸入法檢查：" -ForegroundColor Yellow
try {
    $inputMethods = Get-WinUserLanguageList
    foreach ($method in $inputMethods) {
        Write-Host "   語言: $($method.LanguageTag)" -ForegroundColor White
        foreach ($input in $method.InputMethodTips) {
            Write-Host "     輸入法: $input" -ForegroundColor White
        }
        Write-Host ""
    }
} catch {
    Write-Host "   無法取得輸入法資訊" -ForegroundColor Red
}

# 檢查註冊表中的鍵盤設定
Write-Host "4. 註冊表鍵盤設定檢查：" -ForegroundColor Yellow
$regPaths = @(
    "HKLM:\SYSTEM\CurrentControlSet\Control\Keyboard Layout",
    "HKCU:\Keyboard Layout",
    "HKCU:\Software\Microsoft\CTF"
)

foreach ($path in $regPaths) {
    if (Test-Path $path) {
        Write-Host "   檢查路徑: $path" -ForegroundColor White
        try {
            $regValues = Get-ItemProperty -Path $path -ErrorAction SilentlyContinue
            if ($regValues) {
                $regValues.PSObject.Properties | Where-Object { $_.Name -notlike "PS*" } | ForEach-Object {
                    Write-Host "     $($_.Name): $($_.Value)" -ForegroundColor Gray
                }
            }
        } catch {
            Write-Host "     無法讀取此路徑" -ForegroundColor Red
        }
        Write-Host ""
    }
}

# 檢查正在運行的進程
Write-Host "5. 可能衝突的進程檢查：" -ForegroundColor Yellow
$suspiciousProcesses = @(
    "inputmethod", "ime", "keyboard", "hotkey", "shortcut",
    "autohotkey", "keytweak", "sharpkeys", "powertoys"
)

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

# 檢查 Windows 輕鬆存取設定
Write-Host "6. 輕鬆存取設定檢查：" -ForegroundColor Yellow
try {
    $easeOfAccess = Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\EaseOfAccess" -ErrorAction SilentlyContinue
    if ($easeOfAccess) {
        Write-Host "   粘滯鍵: $($easeOfAccess.StickyKeys)" -ForegroundColor White
        Write-Host "   篩選鍵: $($easeOfAccess.FilterKeys)" -ForegroundColor White
        Write-Host "   切換鍵: $($easeOfAccess.ToggleKeys)" -ForegroundColor White
    } else {
        Write-Host "   無法讀取輕鬆存取設定" -ForegroundColor Red
    }
} catch {
    Write-Host "   無法檢查輕鬆存取設定" -ForegroundColor Red
}
Write-Host ""

# 檢查 Cursor 相關進程
Write-Host "7. Cursor 進程檢查：" -ForegroundColor Yellow
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
Write-Host "8. 建議的解決步驟：" -ForegroundColor Yellow
Write-Host "   1. 重新啟動 Cursor" -ForegroundColor White
Write-Host "   2. 檢查輸入法設定，確保沒有使用 Ctrl 鍵切換輸入法" -ForegroundColor White
Write-Host "   3. 暫時關閉其他可能衝突的軟體" -ForegroundColor White
Write-Host "   4. 更新鍵盤驅動程式" -ForegroundColor White
Write-Host "   5. 檢查 Windows 輕鬆存取設定" -ForegroundColor White
Write-Host "   6. 重新安裝 Cursor" -ForegroundColor White
Write-Host ""

Write-Host "檢查完成！" -ForegroundColor Green
Write-Host "如果問題持續存在，請參考 CURSOR_CTRL_FIX.md 檔案中的詳細解決方案。" -ForegroundColor Cyan 