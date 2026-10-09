# HHW Business Management System - Setup Guide

Complete setup instructions for local development and deployment.

## Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **PostgreSQL** database (local or Railway)
- **Firebase** project account

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Authentication** > **Sign-in method** > **Email/Password**
4. Go to **Project Settings** > **Service accounts**
5. Click **Generate new private key** (save this file securely)
6. Note down your Firebase configuration values

## 💾 Database Setup (Railway)

1. Go to [Railway](https://railway.app/)
2. Create new project
3. Add **PostgreSQL** database service
4. Copy the `DATABASE_URL` connection string

## ⚙️ Environment Configuration

### Backend (.env)

Create `server/.env` file:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

Create `client/.env` file:

```env
# API
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 📦 Installation

### 1. Install Root Dependencies

```bash
npm install
```

### 2. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 3. Install Server Dependencies

```bash
cd server
npm install
cd ..
```

## 🗄️ Database Setup

### 1. Generate Prisma Client

```bash
cd server
npx prisma generate
```

### 2. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 3. Seed Database with Demo Data

```bash
npm run db:seed
```

This will create:
- 4 demo user accounts
- 10 sample products
- 5 sample employees

## 🚀 Running the Application

### Development Mode (Both servers simultaneously)

From the root directory:

```bash
npm run dev
```

This runs both frontend and backend together.

### Or run separately:

**Backend (Terminal 1):**
```bash
cd server
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

## 📱 Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## 🔐 Demo Accounts

After seeding, you can login with:

| Role | Email | Password |
|------|-------|----------|
| Administrator | admin@hhw.com | password123 |
| Sales User | sales@hhw.com | password123 |
| Inventory User | inventory@hhw.com | password123 |
| HR User | hr@hhw.com | password123 |

## 🛠️ Useful Commands

### Database

```bash
# Open Prisma Studio (Database GUI)
cd server
npx prisma studio

# Reset database
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

### Development

```bash
# Lint frontend
cd client
npm run lint

# Lint backend
cd server
npm run lint

# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build
```

## 🚢 Deployment to Railway

### Backend Deployment

1. Push code to GitHub
2. Create new Railway project
3. Connect GitHub repository
4. Add PostgreSQL service
5. Set environment variables in Railway dashboard
6. Deploy

### Environment Variables for Railway (Backend):

```
DATABASE_URL=(auto-filled by Railway PostgreSQL)
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_email
FIREBASE_PRIVATE_KEY=your_private_key
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.railway.app
```

### Frontend Deployment

1. Update `VITE_API_URL` in client/.env to your Railway backend URL
2. Build: `cd client && npm run build`
3. Deploy dist folder to Railway, Vercel, or Netlify

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill both ports if needed
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Prisma Connection Issues

1. Verify DATABASE_URL is correct
2. Ensure PostgreSQL is running
3. Check firewall settings
4. Try: `npx prisma generate && npx prisma migrate deploy`

### Firebase Auth Issues

1. Verify all Firebase env variables are set
2. Check Firebase console for authentication enabled
3. Ensure private key has proper line breaks: `\n`
4. Verify CORS settings in Firebase

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
```

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Railway Documentation](https://docs.railway.app/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/docs)

## 💡 Tips

1. **Always run Prisma generate** after changing schema.prisma
2. **Never commit .env files** to version control
3. **Use Prisma Studio** for easy database inspection
4. **Check Railway logs** for deployment issues
5. **Test locally** before deploying to production

## 🤝 Support

For issues or questions, refer to the main README.md or check:
- Database connection issues
- Firebase authentication setup
- API endpoint testing with Postman/Insomnia

---

**Happy Coding! 🚀**
