# PowerShell script to start a single service
# Usage: .\start-service.ps1 -ServiceName "dai-ly"

param(
    [Parameter(Mandatory=$true)]
    [string]$ServiceName
)

# Define service configurations
$serviceConfigs = @{
    "dai-ly" = @{ Port = 8080; Path = "d:\ServerlessApp\backend\src\dai-ly" }
    "quan" = @{ Port = 4001; Path = "d:\ServerlessApp\backend\src\quan" }
    "loai-dai-ly" = @{ Port = 4002; Path = "d:\ServerlessApp\backend\src\loai-dai-ly" }
    "don-vi-tinh" = @{ Port = 4003; Path = "d:\ServerlessApp\backend\src\don-vi-tinh" }
    "id-tracker" = @{ Port = 4004; Path = "d:\ServerlessApp\backend\src\id-tracker" }
    "tham-so" = @{ Port = 4005; Path = "d:\ServerlessApp\backend\src\tham-so" }
}

if (-not $serviceConfigs.ContainsKey($ServiceName)) {
    Write-Host "Error: Unknown service '$ServiceName'" -ForegroundColor Red
    Write-Host "Available services: $($serviceConfigs.Keys -join ', ')" -ForegroundColor Yellow
    exit 1
}

$config = $serviceConfigs[$ServiceName]
$port = $config.Port
$path = $config.Path

Write-Host "Starting $ServiceName service on port $port..." -ForegroundColor Green
Write-Host "Path: $path" -ForegroundColor Gray

# Change to service directory and start serverless offline
Set-Location $path
serverless offline --httpPort $port
