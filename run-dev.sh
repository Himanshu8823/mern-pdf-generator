#!/bin/bash

echo "🚀 Starting Levitation Invoice Generator in Development Mode..."

# Check if both directories exist
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Backend or Frontend directory not found!"
    exit 1
fi

# Check if MongoDB is running (optional check)
echo "📡 Checking MongoDB connection..."

# Function to check if port is in use
check_port() {
    if lsof -i:$1 >/dev/null 2>&1; then
        echo "✅ Port $1 is available"
        return 0
    else
        echo "⚠️  Port $1 might be in use"
        return 1
    fi
}

# Check ports
check_port 5000
check_port 5173

echo ""
echo "🔧 Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "🎨 Starting Frontend Server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Development servers started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔙 Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for background processes
wait