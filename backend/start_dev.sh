#!/bin/bash

# GigM8 Backend Development Startup Script

echo "🚀 Starting GigM8 Backend Development Environment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please review and update as needed."
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start services with Docker Compose
echo "🐳 Starting services with Docker Compose..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are healthy
echo "🔍 Checking service health..."
if ! docker-compose exec postgres pg_isready -U gigm8 -d gigm8_jobs > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not ready. Please check the logs."
    exit 1
fi

if ! docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not ready. Please check the logs."
    exit 1
fi

echo "✅ Services are ready!"

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec postgres psql -U gigm8 -d gigm8_jobs -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database is ready!"
else
    echo "❌ Database is not ready. Please check the logs."
    exit 1
fi

# Start the API server
echo "🌐 Starting FastAPI server..."
echo "📖 API Documentation: http://localhost:8000/docs"
echo "🔍 Health Check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"

# Start the API server in the foreground
docker-compose up api
