Write-Host "🔧 Cursor Ctrl Key Fix Tool" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill all Cursor processes
Write-Host "Step 1: Closing all Cursor processes..." -ForegroundColor Yellow
$cursorProcesses = Get-Process | Where-Object { $_.ProcessName -like "*cursor*" -or $_.ProcessName -like "*Cursor*" }
if ($cursorProcesses) {
    foreach ($process in $cursorProcesses) {
        try {
            Stop-Process -Id $process.Id -Force
            Write-Host "  Killed process: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Green
        } catch {
            Write-Host "  Failed to kill process: $($process.ProcessName)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  No Cursor processes found" -ForegroundColor White
}
Write-Host ""

# Step 2: Clear Cursor cache
Write-Host "Step 2: Clearing Cursor cache..." -ForegroundColor Yellow
$cursorCachePath = "$env:APPDATA\Cursor\User\workspaceStorage"
if (Test-Path $cursorCachePath) {
    try {
        Remove-Item -Path $cursorCachePath -Recurse -Force
        Write-Host "  Cache cleared successfully" -ForegroundColor Green
    } catch {
        Write-Host "  Failed to clear cache: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "  Cache directory not found" -ForegroundColor White
}
Write-Host ""

# Step 3: Check input method settings
Write-Host "Step 3: Checking input method settings..." -ForegroundColor Yellow
Write-Host "  Please check your input method settings:" -ForegroundColor White
Write-Host "  1. Press Win + I to open Settings" -ForegroundColor White
Write-Host "  2. Go to Time & Language > Language" -ForegroundColor White
Write-Host "  3. Click on your language > Options" -ForegroundColor White
Write-Host "  4. Make sure Ctrl key is not used for input method switching" -ForegroundColor White
Write-Host ""

# Step 4: Check Windows Ease of Access
Write-Host "Step 4: Checking Windows Ease of Access..." -ForegroundColor Yellow
Write-Host "  Please check Ease of Access settings:" -ForegroundColor White
Write-Host "  1. Press Win + I to open Settings" -ForegroundColor White
Write-Host "  2. Go to Ease of Access > Keyboard" -ForegroundColor White
Write-Host "  3. Make sure Sticky Keys, Filter Keys, and Toggle Keys are OFF" -ForegroundColor White
Write-Host ""

Write-Host "Step 5: Restart Cursor" -ForegroundColor Yellow
Write-Host "  Please restart Cursor now and test Ctrl key functionality" -ForegroundColor White
Write-Host ""

Write-Host "Additional troubleshooting steps:" -ForegroundColor Yellow
Write-Host "1. Update keyboard drivers" -ForegroundColor White
Write-Host "2. Test Ctrl key in other applications" -ForegroundColor White
Write-Host "3. Try a different keyboard" -ForegroundColor White
Write-Host "4. Reinstall Cursor if problem persists" -ForegroundColor White
Write-Host ""

Write-Host "Fix completed! Please restart Cursor and test." -ForegroundColor Green 