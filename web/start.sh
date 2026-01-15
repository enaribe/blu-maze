#!/bin/bash

# Blu Maze Driver Simulator - Start Script

echo "🚗 Blu Maze Driver Simulator"
echo "=============================="
echo ""

# Check if firebase-config.js has been configured
if grep -q "YOUR_WEB_APP_ID" firebase-config.js; then
    echo "⚠️  WARNING: Firebase config not set up!"
    echo ""
    echo "Please edit firebase-config.js and replace YOUR_WEB_APP_ID"
    echo "See QUICK_START.md for instructions"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "🚀 Starting server on http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python HTTP server
python3 -m http.server 8000
