#!/bin/bash

echo "========================================"
echo "Deploying Firestore Indexes"
echo "========================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it:"
    echo "   npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Logging into Firebase..."
    firebase login
fi

echo ""
echo "📋 Current Firestore indexes configuration:"
echo ""
cat firestore.indexes.json

echo ""
echo "🚀 Deploying indexes to Firebase Firestore..."
echo ""

# Deploy the indexes
firebase deploy --only firestore:indexes

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Firestore indexes deployed successfully!"
    echo ""
    echo "⏳ Note: Index creation may take a few minutes in Firebase."
    echo "   You can monitor progress in the Firebase Console:"
    echo "   https://console.firebase.google.com/project/_/firestore/indexes"
else
    echo ""
    echo "❌ Failed to deploy Firestore indexes"
    echo "   Please check the error messages above"
    exit 1
fi
