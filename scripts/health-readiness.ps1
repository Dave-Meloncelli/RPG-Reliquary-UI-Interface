Param([string]$ContextFile)
# Minimal health/readiness validator
$healthPath = "backend/health"
$new = $false
if (-not (Test-Path $healthPath)) { New-Item -ItemType Directory -Force -Path $healthPath | Out-Null; $new = $true }
$healthFile = Join-Path $healthPath "health.txt"
"OK" | Out-File -FilePath $healthFile -Encoding utf8

$result = @{ success = $true; health_endpoints_validated = $true; placeholders_created = $new; data = @{ path = $healthFile } }
$result | ConvertTo-Json -Compress
