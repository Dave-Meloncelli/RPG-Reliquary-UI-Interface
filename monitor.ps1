# AZ Interface Multi-Server Monitoring Script
param(
    [string[]]$Servers = @("server1", "server2", "server3", "server4"),
    [int]$Timeout = 10
)

Write-Host "🔍 AZ Interface Server Monitoring" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

$results = @()

foreach ($server in $Servers) {
    Write-Host "📊 Checking $server..." -ForegroundColor Yellow
    
    $serverStatus = @{
        Server = $server
        Backend = $false
        Frontend = $false
        Database = $false
        LastCheck = Get-Date
    }
    
    try {
        # Check backend health
        $backendResponse = Invoke-WebRequest -Uri "http://$server`:3001/api/health" -TimeoutSec $Timeout -ErrorAction Stop
        if ($backendResponse.StatusCode -eq 200) {
            $serverStatus.Backend = $true
            $backendData = $backendResponse.Content | ConvertFrom-Json
            Write-Host "  ✅ Backend: Healthy (Uptime: $($backendData.uptime)s)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ Backend: Unhealthy - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    try {
        # Check frontend
        $frontendResponse = Invoke-WebRequest -Uri "http://$server`:5173/" -TimeoutSec $Timeout -ErrorAction Stop
        if ($frontendResponse.StatusCode -eq 200) {
            $serverStatus.Frontend = $true
            Write-Host "  ✅ Frontend: Healthy" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ❌ Frontend: Unhealthy - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    try {
        # Check database (if configured)
        $dbResponse = Invoke-WebRequest -Uri "http://$server`:3001/api/system/status" -TimeoutSec $Timeout -ErrorAction Stop
        if ($dbResponse.StatusCode -eq 200) {
            $serverStatus.Database = $true
            Write-Host "  ✅ Database: Connected" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ⚠️  Database: Not configured or unavailable" -ForegroundColor Yellow
    }
    
    $results += $serverStatus
    Write-Host ""
}

# Summary
Write-Host "📋 Monitoring Summary" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

$healthyServers = ($results | Where-Object { $_.Backend -and $_.Frontend }).Count
$totalServers = $Servers.Count

Write-Host "Total Servers: $totalServers" -ForegroundColor White
Write-Host "Healthy Servers: $healthyServers" -ForegroundColor Green
Write-Host "Unhealthy Servers: $($totalServers - $healthyServers)" -ForegroundColor Red

# Detailed status
Write-Host ""
Write-Host "📊 Detailed Status:" -ForegroundColor Cyan
foreach ($result in $results) {
    $status = if ($result.Backend -and $result.Frontend) { "🟢 Healthy" } elseif ($result.Backend -or $result.Frontend) { "🟡 Partial" } else { "🔴 Down" }
    Write-Host "$($result.Server): $status" -ForegroundColor $(if ($result.Backend -and $result.Frontend) { "Green" } elseif ($result.Backend -or $result.Frontend) { "Yellow" } else { "Red" })
}

# Recommendations
Write-Host ""
Write-Host "💡 Recommendations:" -ForegroundColor Cyan
if ($healthyServers -eq 0) {
    Write-Host "  ❌ All servers are down! Check network connectivity and service status." -ForegroundColor Red
} elseif ($healthyServers -lt $totalServers) {
    Write-Host "  ⚠️  Some servers are unhealthy. Check logs and restart services." -ForegroundColor Yellow
} else {
    Write-Host "  ✅ All servers are healthy! System is running optimally." -ForegroundColor Green
}

# Export results
$results | Export-Csv -Path "monitoring-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm').csv" -NoTypeInformation
Write-Host ""
Write-Host "📄 Report saved to: monitoring-report-$(Get-Date -Format 'yyyy-MM-dd-HH-mm').csv" -ForegroundColor Gray
