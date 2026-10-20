# Firebase Authentication Setup

## Create Users Manually in Firebase Console

Since we don't have admin credentials yet, please create these users manually:

### Step-by-Step:
1. Go to https://console.firebase.google.com/
2. Select your project: **business-management-syst-80c96**
3. Click **Authentication** in the left sidebar
4. Click **Users** tab
5. Click **Add User** button

### Users to Create (Password for all: `password123`):

| Email                   | Password    | Display Name      | Role           |
|-------------------------|-------------|-------------------|----------------|
| admin@hhw.com           | password123 | Chikondi Mvula    | Administrator  |
| grace.sales@hhw.com     | password123 | Grace Mwale       | Sales User     |
| steven.inv@hhw.com      | password123 | Steven Mbewe      | Inventory User |
| faith.hr@hhw.com        | password123 | Faith Nyasulu     | HR User        |
| finance@hhw.com         | password123 | Finance Manager   | Accountant     |

## After Creating Users:

### Update Database with Firebase UIDs:

Once you create the users in Firebase Console, you need to link them to your database users.

1. In Firebase Console > Authentication > Users, copy each user's **UID**
2. Run this SQL to update your database:

```sql
-- Get the UID from Firebase Console for each user and update:

UPDATE "User" SET "firebaseUid" = 'PASTE_FIREBASE_UID_HERE'
WHERE email = 'admin@hhw.com';

UPDATE "User" SET "firebaseUid" = 'PASTE_FIREBASE_UID_HERE'
WHERE email = 'grace.sales@hhw.com';

UPDATE "User" SET "firebaseUid" = 'PASTE_FIREBASE_UID_HERE'
WHERE email = 'steven.inv@hhw.com';

UPDATE "User" SET "firebaseUid" = 'PASTE_FIREBASE_UID_HERE'
WHERE email = 'faith.hr@hhw.com';

UPDATE "User" SET "firebaseUid" = 'PASTE_FIREBASE_UID_HERE'
WHERE email = 'finance@hhw.com';
```

## Quick Test (Optional - Simpler Approach):

**OR** you can test with just one user first:

1. Create **grace.sales@hhw.com** in Firebase Console with password `password123`
2. Get the UID from Firebase Console
3. Update database:
   ```sql
   UPDATE "User" SET "firebaseUid" = 'YOUR_FIREBASE_UID'
   WHERE email = 'grace.sales@hhw.com';
   ```
4. Login at http://localhost:5173 with:
   - Username: `grace.sales@hhw.com`
   - Password: `password123`

## Next Steps After Setup:

Once users are created and UIDs are in the database:
- ✅ Firebase will handle authentication
- ✅ Backend will verify tokens and return user data
- ✅ Sales Performance will show real data for logged-in users
- ✅ All demo data has been removed from the frontend

## Troubleshooting:

**"User not found" error?**
- Check that the Firebase UID is correctly updated in your database
- Verify the email matches exactly (case-sensitive)

**"Invalid token" error?**
- Check backend console logs
- Ensure server/src/config/firebase.ts has correct project ID

**Can't access Firebase Console?**
- Make sure you're logged into the correct Google account
- Project ID is: `business-management-syst-80c96`
