#!/bin/bash

echo "🚀 Setting up Levitation Invoice Generator..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend && npm install
cd ..

echo "📦 Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo "📁 Setting up environment files..."
# Copy environment files if they don't exist
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Backend .env file created"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Frontend .env file created"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure MongoDB is running on your system"
echo "2. Run 'npm run dev' to start both frontend and backend"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "🔧 Available commands:"
echo "- npm run dev          # Start both frontend and backend"
echo "- npm run server       # Start backend only"
echo "- npm run client       # Start frontend only"
echo "- npm run install-all  # Reinstall all dependencies"
echo ""