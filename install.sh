#!/bin/bash

echo "============================================================"
echo "🚀 AZ Interface Installation Script"
echo "============================================================"
echo

echo "📦 Installing Frontend Dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed!"
    exit 1
fi

echo
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed!"
    exit 1
fi
cd ..

echo
echo "🔧 Building Frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo
echo "✅ Installation Complete!"
echo
echo "🚀 To start the system:"
echo "   1. Start Backend: cd backend && npm start"
echo "   2. Start Frontend: npm run dev"
echo
echo "🌐 The application will be available at:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend: http://localhost:3001"
echo
echo "🔑 Default Login:"
echo "   Username: admin"
echo "   Password: password"
echo
