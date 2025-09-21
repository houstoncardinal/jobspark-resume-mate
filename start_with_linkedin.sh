#!/bin/bash

# Start GigM8 with LinkedIn Jobs API Integration

echo "🚀 Starting GigM8 with LinkedIn Jobs API Integration"
echo "=================================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Check ports
echo "🔍 Checking ports..."
check_port 8000 || exit 1
check_port 8081 || exit 1

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

# Install LinkedIn Jobs API
echo "🔗 Installing LinkedIn Jobs API..."
npm install linkedin-jobs-api

# Start backend
echo "🖥️  Starting backend API server..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test LinkedIn API
echo "🧪 Testing LinkedIn API..."
python ../test_linkedin.py

# Start frontend
echo "🌐 Starting frontend development server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 GigM8 is now running with LinkedIn Jobs API!"
echo "=================================================="
echo "Backend API: http://localhost:8000"
echo "Frontend: http://localhost:8081"
echo "API Docs: http://localhost:8000/docs"
echo "LinkedIn Test: http://localhost:8000/jobs/linkedin/test"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
