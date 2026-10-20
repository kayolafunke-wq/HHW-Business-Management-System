# 🔑 Password Management - Admin Guide

## Overview
Admins and HR users can create new users and reset passwords. Admins control all passwords and give them to users.

---

## ✅ Features Implemented

### 1. **Create User (Admin/HR)**
- Admin/HR goes to Users page
- Clicks "Create User" button
- Fills in: Name, Email, Password, Role
- User is created in Firebase + Database
- Admin gives the password to the user

### 2. **Reset Password (Admin/HR)**
- Admin/HR clicks "Reset Password" button next to any user
- Modal opens with password reset form
- Can type custom password OR click "Generate" for random password
- Password is updated in Firebase
- Admin copies the password and gives it to the user

### 3. **Password Requirements**
- Minimum 6 characters
- Can contain letters, numbers, and special characters
- No maximum length

---

## 🚀 How It Works

### Creating a New User:

1. **Admin logs in** (admin@hhw.com)
2. **Go to Users page** (Admin menu → Users)
3. **Click "Create User"**
4. **Fill in the form:**
   - Full Name: e.g., "Grace Mwale"
   - Email: e.g., "grace.sales@hhw.com"
   - Password: e.g., "grace@123" (custom) or click "Generate"
   - Role: Select from dropdown (Sales User, Inventory User, etc.)
5. **Click "Create User"**
6. **Copy the password** and give it to Grace
7. **Tell Grace to login** with:
   - Email: grace.sales@hhw.com
   - Password: grace@123

### Resetting a User's Password:

1. **Admin logs in**
2. **Go to Users page**
3. **Find the user** in the list
4. **Click "Reset Password"** button
5. **Enter new password** or click "Generate" button
6. **Click "Reset Password"** button
7. **Copy the new password** (shown in success message)
8. **Give the password to the user**

---

## 📋 Workflow Example

### Scenario: Creating Grace (Sales User)

**Admin:**
1. Login as admin
2. Go to Users page
3. Click "Create User"
4. Fill in:
   - Name: Grace Mwale
   - Email: grace.sales@hhw.com
   - Password: [Click "Generate" → gets "aB3xK9mP"]
   - Role: Sales User
5. Copy password: `aB3xK9mP`
6. Tell Grace: "Your login is grace.sales@hhw.com and password is aB3xK9mP"

**Grace:**
1. Goes to http://localhost:5173
2. Enters email: grace.sales@hhw.com
3. Enters password: aB3xK9mP
4. Logs in successfully!

---

### Scenario: Grace Forgot Password

**Grace:** "I forgot my password"

**Admin:**
1. Login as admin
2. Go to Users page
3. Find Grace Mwale
4. Click "Reset Password"
5. Click "Generate" button → gets "pL8wQr2M"
6. Click "Reset Password"
7. Success message shows: "Password reset for Grace Mwale. New password: pL8wQr2M"
8. Tell Grace: "Your new password is pL8wQr2M"

**Grace:**
1. Goes to login page
2. Email: grace.sales@hhw.com
3. Password: pL8wQr2M (new password)
4. Logs in successfully!

---

## 🔒 Security Features

✅ **Only Admin/HR can create users** - Regular users cannot signup  
✅ **Only Admin/HR can reset passwords** - Users must contact admin  
✅ **Passwords stored in Firebase** - Secure, encrypted storage  
✅ **Audit logging** - All password resets are logged  
✅ **Minimum 6 characters** - Enforced by Firebase  
✅ **Generate random passwords** - One-click secure password generation  

---

## 🎯 Admin Responsibilities

### When Creating Users:
- ✅ Generate strong passwords
- ✅ Give password to user securely (in person, secure message, etc.)
- ✅ Remind user to keep password safe
- ✅ Tell user who to contact if they forget password

### When Resetting Passwords:
- ✅ Verify user identity before reset
- ✅ Generate new strong password
- ✅ Give new password to user securely
- ✅ Confirm user can login with new password

---

## 💡 Best Practices

### Password Generation:
- Use the "Generate" button for random secure passwords
- OR create memorable passwords like: `FirstName@Year` (e.g., grace@2026)
- Always minimum 6 characters

### Password Distribution:
- Give passwords in person when possible
- Use secure messaging apps (not email)
- Have user change password after first login (future feature)

### Record Keeping:
- Keep track of which users you've created
- Note when passwords were reset
- All actions are logged in Audit Log

---

## 🧪 Testing Your Setup

### Test 1: Create User
```
1. Login as admin (admin@hhw.com)
2. Go to Users page
3. Click "Create User"
4. Fill in test user details
5. Click "Generate" for password
6. Copy generated password
7. Create user
8. Should see success toast
```

### Test 2: New User Login
```
1. Logout
2. Login with new user email + password
3. Should redirect based on role
4. Should see appropriate menu items
```

### Test 3: Reset Password
```
1. Login as admin
2. Go to Users page
3. Click "Reset Password" for test user
4. Generate new password
5. Copy new password
6. Confirm reset
7. Logout and login with new password
8. Should work!
```

---

## 🆘 Troubleshooting

### "Failed to reset password"
❌ **Backend not responding**
- Check server is running on port 5000
- Check browser console for errors
- Verify token is valid (try logging out and back in)

### "User does not have Firebase account"
❌ **User not linked to Firebase**
- User might be old demo data
- Delete and recreate user through Users page
- OR link Firebase UID manually

### Password reset works but user can't login
❌ **Cache issue**
- Clear browser cache
- Try incognito/private window
- Check password was copied correctly

---

## 📊 API Endpoints

### Create User
```
POST /api/auth/register
Authorization: Bearer <token>
Body: {
  "name": "Grace Mwale",
  "email": "grace.sales@hhw.com",
  "firebaseUid": "...",
  "role": "SALES_USER"
}
```

### Reset Password
```
POST /api/auth/reset-password
Authorization: Bearer <token>
Body: {
  "userId": "user-id",
  "email": "grace.sales@hhw.com",
  "newPassword": "newpassword123"
}
```

### Get User Details
```
GET /api/auth/users/:id
Authorization: Bearer <token>
```

---

## ✨ Summary

Your admin panel now has complete password management:

- ✅ Create users with custom passwords
- ✅ Generate random secure passwords
- ✅ Reset any user's password
- ✅ Password shown to admin (to give to user)
- ✅ All changes logged in audit trail
- ✅ Only Admin/HR can manage passwords

**Admins are in full control of user access! 🎯**
