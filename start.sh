#!/bin/bash

# TruckMarket Platform - Quick Start Script

echo "=================================="
echo "  TruckMarket Platform Startup"
echo "=================================="
echo ""

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

# Check if database exists
if [ ! -f "server/trucks.db" ]; then
    echo "Creating database and seeding with sample data..."
    node server/seed.js
    sleep 2
fi

echo ""
echo "Starting services..."
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "Services stopped. Goodbye!"
    exit 0
}

# Set trap to catch Ctrl+C
trap cleanup INT TERM

# Start backend server
echo "Starting backend API on http://localhost:5001"
node server/index.js &
BACKEND_PID=$!
sleep 2

# Start frontend
echo "Starting frontend on http://localhost:3000"
cd client && npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=================================="
echo "  Services Running!"
echo "=================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=================================="
echo ""

# Wait for user interrupt
wait
