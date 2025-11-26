# Firestore Indexes Deployment Guide

## Why You Need This

Your favorites functionality requires specific database indexes in Firebase Firestore to work properly. Without these indexes, queries will fail with errors like "The query requires an index."

## Quick Deploy (Recommended)

### Option 1: Using Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **Add Index** and create the following indexes:

#### Index 1: Favorites
- **Collection ID**: `favorites`
- **Fields to index**:
  - `userId` (Ascending)
  - `createdAt` (Descending)
- **Query scope**: Collection

#### Index 2: User Books (Basic)
- **Collection ID**: `user_books`
- **Fields to index**:
  - `userId` (Ascending)
  - `updatedAt` (Descending)
- **Query scope**: Collection

#### Index 3: User Books (With Status)
- **Collection ID**: `user_books`
- **Fields to index**:
  - `userId` (Ascending)
  - `status` (Ascending)
  - `updatedAt` (Descending)
- **Query scope**: Collection

#### Index 4: Books by Creator
- **Collection ID**: `books`
- **Fields to index**:
  - `createdBy` (Ascending)
  - `createdAt` (Descending)
- **Query scope**: Collection

### Option 2: Using Firebase CLI

If you have Firebase CLI installed:

**Windows:**
```bash
cd backend
deploy-firestore-indexes.bat
```

**Linux/Mac:**
```bash
cd backend
chmod +x deploy-firestore-indexes.sh
./deploy-firestore-indexes.sh
```

**Or manually:**
```bash
cd backend
firebase deploy --only firestore:indexes
```

### Option 3: Using Firebase CLI (If Not Installed)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your Firebase project
   - Use default firestore rules file
   - Use default firestore indexes file

4. Replace the generated `firestore.indexes.json` with the one in this directory

5. Deploy:
   ```bash
   firebase deploy --only firestore:indexes
   ```

## Monitoring Index Creation

After deploying:

1. Indexes may take a few minutes to build
2. Monitor progress at: https://console.firebase.google.com/project/_/firestore/indexes
3. Status will show "Building" → "Enabled" when ready

## What These Indexes Fix

- ✅ **Favorites**: Allows fetching user favorites sorted by creation date
- ✅ **User Books**: Enables querying user's reading lists with filters
- ✅ **Book Management**: Supports fetching books created by specific users

## Troubleshooting

### Error: "Firebase CLI not found"
Install Firebase CLI: `npm install -g firebase-tools`

### Error: "No project active"
1. Run `firebase login`
2. Run `firebase use --add`
3. Select your project

### Error: "Permission denied"
Make sure you're logged in: `firebase login`

### Indexes Not Working After Deployment
- Wait a few minutes for indexes to build
- Check status in Firebase Console
- Verify all fields match exactly (case-sensitive)

## Quick Test

After deploying indexes, test the favorites functionality:

1. Go to your app
2. Click the heart icon on any book
3. Navigate to `/favorites` page
4. Books should display without errors

If you still see errors, check the browser console and backend logs for specific error messages.
