#!/bin/bash

# Vercel Deployment Helper Script

echo "🚀 Vercel Deployment Helper"
echo "=========================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm i -g vercel
else
    echo "✅ Vercel CLI is installed"
fi

echo ""
echo "Choose deployment option:"
echo "1) Deploy to preview"
echo "2) Deploy to production"
echo "3) Check deployment status"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🔍 Deploying to preview..."
        vercel
        ;;
    2)
        echo ""
        echo "🚀 Deploying to production..."
        vercel --prod
        ;;
    3)
        echo ""
        echo "📊 Checking deployment status..."
        vercel ls
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✨ Done!"
