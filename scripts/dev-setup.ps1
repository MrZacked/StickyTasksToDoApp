Write-Host "Setting up StickyTasks Development Environment" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "Docker is running" -ForegroundColor Green
} catch {
    Write-Host "Error: Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

Write-Host "Starting MongoDB container..."
docker-compose -f docker-compose.dev.yml up -d mongo

Write-Host "Waiting for MongoDB to start..."
Start-Sleep -Seconds 5

$mongoStatus = docker-compose -f docker-compose.dev.yml ps mongo
if ($mongoStatus -match "Up") {
    Write-Host "MongoDB is running!" -ForegroundColor Green
    Write-Host "MongoDB Express will be available at http://localhost:8081"
} else {
    Write-Host "Error: Failed to start MongoDB" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

Write-Host "Installing root dependencies..."
npm install

Write-Host "Installing backend dependencies..."
Set-Location backend
npm install

Write-Host "Installing frontend dependencies..."
Set-Location ../frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server:"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Available Docker commands:"
Write-Host "  docker-compose -f docker-compose.dev.yml ps                   # Check status"
Write-Host "  docker-compose -f docker-compose.dev.yml logs mongo          # View MongoDB logs"
Write-Host "  docker-compose -f docker-compose.dev.yml down                  # Stop containers"
Write-Host ""
Write-Host "MongoDB connection string: mongodb://localhost:27017/stickytasks"
Write-Host "Mongo Express: http://localhost:8081" 