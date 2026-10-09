# 🚀 Quick Start Guide - HHW Business Management System

Get up and running in 5 minutes!

## What You Have

A complete full-stack business management system with:
- ✅ React frontend with modern UI components
- ✅ Node.js/Express backend with TypeScript
- ✅ PostgreSQL database with Prisma ORM
- ✅ Firebase authentication
- ✅ Role-based access control
- ✅ Complete database schema for Products, Sales, Inventory, HR
- ✅ Seed data with demo accounts

## Before You Start

You need:
1. **Node.js 18+** installed
2. **PostgreSQL database** (Railway recommended)
3. **Firebase project** set up

---

## Step 1: Firebase Setup (5 minutes)

### 1.1 Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Follow the wizard (disable Google Analytics if not needed)

### 1.2 Enable Email Authentication
1. In your project, go to **Build** > **Authentication**
2. Click "Get started"
3. Click **Sign-in method** tab
4. Enable **Email/Password**
5. Click "Save"

### 1.3 Get Web Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register your app (name it "HHW Web")
5. **Copy the firebaseConfig values** - you'll need these!

### 1.4 Generate Service Account Key
1. Go to **Project Settings** > **Service accounts**
2. Click **Generate new private key**
3. Click "Generate key" (downloads a JSON file)
4. **Keep this file safe!** Don't commit it to Git

---

## Step 2: Database Setup (Railway - 3 minutes)

### 2.1 Create Railway Account
1. Go to https://railway.app/
2. Sign up with GitHub

### 2.2 Create PostgreSQL Database
1. Click "New Project"
2. Click "Deploy PostgreSQL"
3. Wait for deployment (~1 minute)
4. Click on PostgreSQL service
5. Go to **Variables** tab
6. **Copy the DATABASE_URL** value

---

## Step 3: Configure Environment Variables

### 3.1 Backend Configuration

Create `server/.env`:

```env
# Database (from Railway)
DATABASE_URL=postgresql://postgres:password@host.railway.app:5432/railway

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key_change_this_now_min_32_chars

# Firebase Admin (from the JSON file you downloaded)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# Server Config
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Important for FIREBASE_PRIVATE_KEY:**
- Keep the quotes
- Keep the `\n` characters (they represent line breaks)
- Copy the entire private_key value from the JSON file

### 3.2 Frontend Configuration

Create `client/.env`:

```env
# Backend API
VITE_API_URL=http://localhost:5000/api

# Firebase Config (from Firebase Console)
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

---

## Step 4: Install & Run (2 minutes)

### Option A: Automated Setup (Recommended)

Run these commands in PowerShell:

```powershell
# Install all dependencies
npm run install:all

# Setup database
cd server
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
cd ..

# Start both frontend and backend
npm run dev
```

### Option B: Manual Setup

```powershell
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies  
cd server
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with demo data
npm run db:seed
cd ..

# Start development servers
npm run dev
```

---

## Step 5: Access the Application

Open your browser:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 🔐 Demo Login Accounts

After seeding, login with:

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | admin@hhw.com | password123 |
| **Sales User** | sales@hhw.com | password123 |
| **Inventory User** | inventory@hhw.com | password123 |
| **HR User** | hr@hhw.com | password123 |

---

## 🎯 What Each Role Can Do

### Administrator
- Full system access
- Manage users
- View audit logs
- Access all modules
- System settings

### Sales User
- Create and view sales
- Generate invoices
- Manage customers
- View sales reports

### Inventory User
- Manage products
- Record stock in/out
- View inventory levels
- Stock reports

### HR User
- Manage employees
- Track attendance
- Employee registration
- HR reports

---

## 🛠️ Useful Commands

### View Database
```powershell
cd server
npx prisma studio
```
Opens a GUI at http://localhost:5555

### Reset Database
```powershell
cd server
npx prisma migrate reset
npm run db:seed
```

### Check Backend Logs
The terminal running `npm run dev` shows all backend logs

### Build for Production
```powershell
npm run build
```

---

## ❗ Common Issues & Solutions

### "Port 5000 already in use"
```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### "Prisma Client not generated"
```powershell
cd server
npx prisma generate
```

### "Firebase auth/invalid-api-key"
- Check that all `VITE_FIREBASE_*` variables in `client/.env` are correct
- Verify they match your Firebase Console values exactly

### "Database connection failed"
- Verify `DATABASE_URL` is correct in `server/.env`
- Check Railway database is running
- Try connecting with a database client (DBeaver, pgAdmin)

### "Firebase private key error"
- Ensure `FIREBASE_PRIVATE_KEY` is wrapped in quotes
- Keep all `\n` characters intact
- Don't add extra spaces or line breaks

---

## 🎨 Project Structure

```
hhw-business-system/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── pages/         # Page Components
│   │   ├── lib/           # Utilities (Firebase, API)
│   │   ├── store/         # State Management (Zustand)
│   │   └── types/         # TypeScript Types
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # Business Logic
│   │   ├── routes/        # API Endpoints
│   │   ├── middleware/    # Auth, Error Handling
│   │   ├── config/        # Firebase, Database
│   │   └── utils/         # Helper Functions
│   ├── prisma/
│   │   └── schema.prisma  # Database Schema
│   └── package.json
│
└── package.json           # Root Package
```

---

## 📚 Next Steps

Now that your system is running:

1. **Explore the interface** - Login with different roles
2. **Check the database** - Open Prisma Studio
3. **Review the code** - Understand the structure
4. **Customize** - Add features as needed
5. **Deploy** - Use Railway when ready

---

## 🚀 Ready to Deploy?

See `SETUP.md` for detailed deployment instructions to Railway.

---

## 💡 Pro Tips

1. Always keep both terminals running (frontend + backend)
2. Use Prisma Studio to inspect/edit database
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Read `SETUP.md` for advanced configuration

---

## 🆘 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Review `README.md` for architecture details
3. Check the logs in your terminal
4. Verify all environment variables are set correctly

---

**You're all set! Enjoy building with HHW Business Management System! 🎉**
