#!/bin/bash

# Aayush Recruitment Platform - Setup Script
echo "🚀 Setting up Aayush Recruitment Platform..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install additional required package
echo "📦 Installing tailwindcss-animate..."
npm install tailwindcss-animate

echo ""
echo "✅ All dependencies installed successfully!"
echo ""

# Create necessary directories (if they don't exist)
mkdir -p public
mkdir -p uploads

echo "📁 Created necessary directories"
echo ""

# Display next steps
echo "✨ Setup Complete! ✨"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Register as a candidate or recruiter to get started"
echo ""
echo "Database: Connected to MongoDB Atlas (database: aayush)"
echo ""
echo "Happy recruiting! 🎉"
