# 🔥 Firebase Admin SDK Setup

## Why You Need This
To enable password reset functionality, the backend needs Firebase Admin credentials. Without them, the system can verify login tokens but cannot update user passwords.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Generate Service Account Key

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select project: **business-management-syst-80c96**

2. **Navigate to Project Settings:**
   - Click the ⚙️ gear icon (top left)
   - Select **Project settings**

3. **Go to Service Accounts Tab:**
   - Click **Service accounts** tab
   - Click **Generate new private key** button
   - Click **Generate key** in the confirmation dialog
   - A JSON file will be downloaded (keep it safe!)

### Step 2: Add Credentials to Your Project

**Option A: Using .env file (Recommended for Development)**

1. Open or create `.env` file in the `server` folder:
   ```bash
   cd server
   notepad .env
   ```

2. Open the downloaded JSON file and copy these values:
   ```env
   FIREBASE_PROJECT_ID=business-management-syst-80c96
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@business-management-syst-80c96.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
   ```

3. Save the file

4. Restart your backend server

**Option B: Using Service Account File (Alternative)**

1. Save the downloaded JSON file to `server/config/firebase-service-account.json`

2. Update `server/src/config/firebase.ts`:
   ```typescript
   import serviceAccount from '../config/firebase-service-account.json' assert { type: 'json' }
   
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
   })
   ```

---

## ✅ Verify Setup

After adding credentials, restart your server and check:

```bash
cd server
npm run dev
```

You should see:
```
✅ Firebase Admin initialized with credentials
🚀 HHW Business Management API running on http://localhost:5000
```

Now try resetting a password - it should work! 🎉

---

## 🔒 Security Notes

⚠️ **IMPORTANT:**
- Never commit the service account JSON file to git
- Never share your private key
- Add to `.gitignore`:
  ```
  server/.env
  server/config/firebase-service-account.json
  ```

---

## 🆘 Troubleshooting

### "Failed to update password in Firebase"
❌ **Service account not configured**
- Follow Step 1 & 2 above
- Make sure .env values are correct
- Restart backend server

### "Invalid PEM formatted message"
❌ **Private key format issue**
- In .env, wrap private key in quotes
- Keep the \n characters in the key
- Don't remove BEGIN/END lines

### Can't find service accounts tab
❌ **Wrong Firebase project**
- Make sure you're in: business-management-syst-80c96
- Check you have owner/editor permissions

---

## 📝 What This Enables

With Firebase Admin SDK properly configured:
- ✅ Password reset works through UI
- ✅ Admin can update any user's password
- ✅ No need to manually update in Firebase Console
- ✅ Full user management capabilities

---

## 🎯 Current Workaround (If you can't set up now)

Without Firebase Admin credentials, you can still reset passwords manually:

1. Admin clicks "Reset Password" in UI
2. System shows the new password
3. Admin goes to Firebase Console
4. Authentication → Users → Find user → Click ⋮ menu → Reset password
5. Set the password from step 2
6. Tell user their new password

**OR** when creating new users, the password is set correctly because it's done from the client side.

---

## 🔄 Production Setup

For production deployment:

1. Use environment variables (not .env files)
2. Store credentials in your hosting platform's secrets:
   - **Heroku:** Config Vars
   - **Vercel:** Environment Variables
   - **AWS:** Secrets Manager
   - **Azure:** Key Vault

3. Never expose credentials in client-side code

---

**Once you complete this setup, password reset will work perfectly!** 🚀
