# Real System Audit - PowerShell Version
Write-Host "🔍 REAL SYSTEM AUDIT STARTING..." -ForegroundColor Green

# Get current directory
$projectRoot = Get-Location
Write-Host "📁 Project Root: $projectRoot" -ForegroundColor Yellow

# Initialize counters
$totalFiles = 0
$templates = 0
$endpoints = 0
$tools = 0
$documentation = 0
$scripts = 0

# Scan main directories
$directories = @('backend', 'src', 'tools', 'scripts', 'consciousness', 'OCTOSPINE')

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "📁 Scanning $dir..." -ForegroundColor Cyan
        $files = Get-ChildItem -Path $dir -Recurse -File
        $totalFiles += $files.Count
        
        foreach ($file in $files) {
            $relativePath = $file.FullName.Replace($projectRoot.Path, '').TrimStart('\')
            
            # Categorize files
            if ($relativePath -like "*template*") {
                $templates++
                Write-Host "  📋 Template: $relativePath" -ForegroundColor Magenta
            }
            if ($relativePath -like "*endpoint*" -or $relativePath -like "*route*") {
                $endpoints++
                Write-Host "  🔗 Endpoint: $relativePath" -ForegroundColor Blue
            }
            if ($relativePath -like "*tool*" -or $relativePath -like "*utility*") {
                $tools++
                Write-Host "  🛠️  Tool: $relativePath" -ForegroundColor Yellow
            }
            if ($relativePath -like "*.md" -or $relativePath -like "*.txt") {
                $documentation++
            }
            if ($relativePath -like "*.js" -or $relativePath -like "*.py" -or $relativePath -like "*.ps1") {
                $scripts++
            }
        }
    }
}

# Check Knowledge Hub
Write-Host "`n🧠 Checking Knowledge Hub..." -ForegroundColor Green
if (Test-Path "KNOWLEDGE_HUB.md") {
    $hubContent = Get-Content "KNOWLEDGE_HUB.md" -Raw
    $hubSize = $hubContent.Length
    $hubLines = ($hubContent -split "`n").Count
    Write-Host "✅ Knowledge Hub exists" -ForegroundColor Green
    Write-Host "📊 Size: $hubSize characters, $hubLines lines" -ForegroundColor Yellow
}
else {
    Write-Host "❌ Knowledge Hub not found" -ForegroundColor Red
}

# Check recent additions
Write-Host "`n📋 Checking recent additions..." -ForegroundColor Green
$recentFiles = @(
    "backend/app/template_handler.py",
    "scripts/system-audit.js",
    "scripts/knowledge-hub-updater.js",
    "MANUAL_SYSTEM_AUDIT_SUMMARY.md"
)

foreach ($file in $recentFiles) {
    if (Test-Path $file) {
        $stats = Get-Item $file
        Write-Host "✅ $file ($($stats.Length) bytes, $($stats.LastWriteTime.ToShortDateString()))" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $file not found" -ForegroundColor Red
    }
}

# Check package.json scripts
Write-Host "`n🚀 Checking automation scripts..." -ForegroundColor Green
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $automationScripts = @('knowledge-hub:update', 'system:audit', 'knowledge-hub:sync')
    
    foreach ($script in $automationScripts) {
        if ($packageJson.scripts.$script) {
            Write-Host "✅ $script : $($packageJson.scripts.$script)" -ForegroundColor Green
        }
        else {
            Write-Host "❌ $script : not found" -ForegroundColor Red
        }
    }
}

# Generate summary
Write-Host "`n📊 REAL AUDIT SUMMARY:" -ForegroundColor Green
Write-Host "📁 Total Files: $totalFiles" -ForegroundColor Yellow
Write-Host "📋 Templates: $templates" -ForegroundColor Magenta
Write-Host "🔗 Endpoints: $endpoints" -ForegroundColor Blue
Write-Host "🛠️  Tools: $tools" -ForegroundColor Yellow
Write-Host "📚 Documentation: $documentation" -ForegroundColor Cyan
Write-Host "📜 Scripts: $scripts" -ForegroundColor Gray

Write-Host "`n✅ REAL audit completed!" -ForegroundColor Green
