# PowerShell script to start all serverless services
# Usage: .\start-all-services.ps1

Write-Host "Starting all serverless services..." -ForegroundColor Green

# Function to start a service in background
function Start-Service {
    param($ServiceName, $Port, $Path)
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Yellow
    
    # Start the service in a new PowerShell window
    $command = "cd '$Path'; serverless offline --httpPort $Port"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command
    
    Start-Sleep -Seconds 2
}

# Define service configurations
$services = @(
    @{ Name = "dai-ly"; Port = 8080; Path = "d:\ServerlessApp\backend\src\dai-ly" },
    @{ Name = "quan"; Port = 4001; Path = "d:\ServerlessApp\backend\src\quan" },
    @{ Name = "loai-dai-ly"; Port = 4002; Path = "d:\ServerlessApp\backend\src\loai-dai-ly" },
    @{ Name = "don-vi-tinh"; Port = 4003; Path = "d:\ServerlessApp\backend\src\don-vi-tinh" },
    @{ Name = "id-tracker"; Port = 4004; Path = "d:\ServerlessApp\backend\src\id-tracker" },
    @{ Name = "tham-so"; Port = 4005; Path = "d:\ServerlessApp\backend\src\tham-so" }
)

# Start each service
foreach ($service in $services) {
    Start-Service -ServiceName $service.Name -Port $service.Port -Path $service.Path
}

Write-Host "`nAll services started!" -ForegroundColor Green
Write-Host "`nService endpoints:" -ForegroundColor Cyan
Write-Host "- dai-ly: http://localhost:8080" -ForegroundColor White
Write-Host "- quan: http://localhost:4001" -ForegroundColor White
Write-Host "- loai-dai-ly: http://localhost:4002" -ForegroundColor White
Write-Host "- don-vi-tinh: http://localhost:4003" -ForegroundColor White
Write-Host "- id-tracker: http://localhost:4004" -ForegroundColor White
Write-Host "- tham-so: http://localhost:4005" -ForegroundColor White

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
