#!/bin/bash

echo "Setting up StickyTasks Development Environment"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed."
    exit 1
fi

echo "Starting MongoDB container..."
docker-compose -f docker-compose.dev.yml up -d mongo

echo "Waiting for MongoDB to start..."
sleep 5

if docker-compose -f docker-compose.dev.yml ps mongo | grep -q "Up"; then
    echo "MongoDB is running!"
    echo "MongoDB Express will be available at http://localhost:8081"
else
    echo "Error: Failed to start MongoDB"
    exit 1
fi

echo ""
echo "Installing dependencies..."
echo "========================="

echo "Installing root dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend
npm install

echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "Setup complete!"
echo "==============="
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Available Docker commands:"
echo "  docker-compose -f docker-compose.dev.yml ps                   # Check status"
echo "  docker-compose -f docker-compose.dev.yml logs mongo          # View MongoDB logs"
echo "  docker-compose -f docker-compose.dev.yml down                  # Stop containers"
echo ""
echo "MongoDB connection string: mongodb://localhost:27017/stickytasks"
echo "Mongo Express: http://localhost:8081" 