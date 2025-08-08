# AZ Interface Multi-Server Deployment Script
param(
    [string[]]$Servers = @("server1", "server2", "server3", "server4"),
    [string]$RepoUrl = "https://github.com/your-username/az-interface.git",
    [string]$Environment = "development"
)

Write-Host "🚀 AZ Interface Multi-Server Deployment" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

$InstallPath = "C:\az-interface"
$BackupPath = "C:\az-interface-backup"

foreach ($server in $Servers) {
    Write-Host "📦 Deploying to $server..." -ForegroundColor Yellow
    
    try {
        $commands = @"
if (Test-Path "$InstallPath") {
    Copy-Item "$InstallPath" "$BackupPath" -Recurse -Force
}
if (Test-Path "$InstallPath") {
    Set-Location "$InstallPath"
    git pull origin main
} else {
    git clone "$RepoUrl" "$InstallPath"
    Set-Location "$InstallPath"
}
npm install
cd backend
npm install
cd ..
npm run build
Write-Host "✅ Deployment to $server completed!"
"@

        Invoke-Command -ComputerName $server -ScriptBlock {
            param($commands)
            Invoke-Expression $commands
        } -ArgumentList $commands

        Write-Host "✅ Successfully deployed to $server" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ Failed to deploy to $server: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
