Write-Host "🔧 Ctrl Key Problem Diagnostic Tool" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Basic system info
Write-Host "System Information:" -ForegroundColor Yellow
$os = Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion
Write-Host "OS: $($os.WindowsProductName)" -ForegroundColor White
Write-Host "Version: $($os.WindowsVersion)" -ForegroundColor White
Write-Host ""

# Check keyboard
Write-Host "Keyboard Check:" -ForegroundColor Yellow
$keyboard = Get-WmiObject -Class Win32_Keyboard | Select-Object -First 1
Write-Host "Keyboard: $($keyboard.Name)" -ForegroundColor White
Write-Host "Status: $($keyboard.Status)" -ForegroundColor White
Write-Host ""

# Check Cursor processes
Write-Host "Cursor Process Check:" -ForegroundColor Yellow
$cursor = Get-Process | Where-Object { $_.ProcessName -like "*cursor*" -or $_.ProcessName -like "*Cursor*" }
if ($cursor) {
    Write-Host "Found Cursor process: $($cursor.ProcessName)" -ForegroundColor Green
} else {
    Write-Host "No Cursor process found" -ForegroundColor Red
}
Write-Host ""

Write-Host "Recommended Solutions:" -ForegroundColor Yellow
Write-Host "1. Restart Cursor" -ForegroundColor White
Write-Host "2. Check input method settings" -ForegroundColor White
Write-Host "3. Update keyboard drivers" -ForegroundColor White
Write-Host "4. Check Windows Ease of Access settings" -ForegroundColor White
Write-Host ""

Write-Host "For detailed solutions, see CURSOR_CTRL_FIX.md" -ForegroundColor Cyan 