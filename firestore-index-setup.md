# Firestore Composite Index Setup

## The Issue

The `getMomentsByCategory` function was failing because Firestore requires a composite index when using both `where` and `orderBy` clauses in a query.

## The Fix

I've implemented a fallback approach that:

1. First tries to use the composite query (most efficient)
2. Falls back to client-side filtering if the index doesn't exist
3. Logs a warning when using the fallback

## Setting Up the Composite Index (Optional but Recommended)

### Method 1: Automatic Index Creation

1. Run your app and try to filter by category
2. Check the Firebase Console → Firestore → Indexes
3. You should see a suggested index that you can create

### Method 2: Manual Index Creation

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mademesmile-2dec8`
3. Go to **Firestore Database** → **Indexes**
4. Click **Create Index**
5. Set up the index with these fields:
   - **Collection ID**: `moments` (under users/{userId}/moments)
   - **Fields**:
     - `category` (Ascending)
     - `createdAt` (Descending)
6. Click **Create**

### Method 3: Using Firebase CLI

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init firestore

# Create the index
firebase deploy --only firestore:indexes
```

## Current Implementation

The current code will work without the composite index, but it will be less efficient for users with many moments. The fallback approach ensures your app works immediately while you can set up the index for better performance.

## Performance Notes

- **With Index**: Only fetches moments of the selected category (efficient)
- **Without Index**: Fetches all moments and filters client-side (less efficient but works)

## Testing

1. Try filtering by different categories
2. Check the console logs for any warnings about missing indexes
3. The app should work in both cases
