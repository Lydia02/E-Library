@echo off
echo ========================================
echo Deploying Firestore Indexes
echo ========================================

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Firebase CLI not found. Please install it:
    echo    npm install -g firebase-tools
    exit /b 1
)

echo.
echo 📋 Current Firestore indexes configuration:
echo.
type firestore.indexes.json

echo.
echo 🚀 Deploying indexes to Firebase Firestore...
echo.

REM Deploy the indexes
firebase deploy --only firestore:indexes

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Firestore indexes deployed successfully!
    echo.
    echo ⏳ Note: Index creation may take a few minutes in Firebase.
    echo    You can monitor progress in the Firebase Console:
    echo    https://console.firebase.google.com/project/_/firestore/indexes
) else (
    echo.
    echo ❌ Failed to deploy Firestore indexes
    echo    Please check the error messages above
    exit /b 1
)
