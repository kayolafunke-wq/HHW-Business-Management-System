# ✅ Railway Deployment Checklist

## Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] All tests passing locally
- [ ] Environment variables documented
- [ ] Firebase project created and configured
- [ ] Database schema finalized

## Backend Deployment

- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] Backend service configured
  - [ ] Root directory: `server`
  - [ ] Build command: `npm run build`
  - [ ] Start command: `npm run start`
- [ ] Environment variables added:
  - [ ] `DATABASE_URL`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_CLIENT_EMAIL`
  - [ ] `FIREBASE_PRIVATE_KEY`
  - [ ] `CORS_ORIGIN` (add after frontend deployed)
- [ ] Backend deployed successfully
- [ ] Health check working: `/health` endpoint
- [ ] Backend URL copied

## Frontend Deployment

- [ ] Frontend service created
- [ ] Frontend service configured
  - [ ] Root directory: `client`
  - [ ] Build command: `npm run build`
  - [ ] Start command: `npx vite preview --host 0.0.0.0 --port $PORT`
- [ ] Environment variables added:
  - [ ] `VITE_API_URL` (backend Railway URL)
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied
- [ ] Login page loads correctly

## Post-Deployment

- [ ] Backend `CORS_ORIGIN` updated with frontend URL
- [ ] Backend redeployed with updated CORS
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Login flow tested
- [ ] API calls working (check DevTools Network tab)
- [ ] Create test product
- [ ] Create test sale
- [ ] Register test employee
- [ ] All CRUD operations working

## Optional

- [ ] Custom domain configured
- [ ] DNS records updated
- [ ] SSL certificate active
- [ ] Monitoring setup
- [ ] Backup strategy implemented

## Final Verification

- [ ] Frontend accessible via Railway URL
- [ ] Backend health check passing
- [ ] Login with admin credentials works
- [ ] Dashboard loads with real data
- [ ] No console errors in browser
- [ ] No CORS errors
- [ ] Mobile responsive working
- [ ] All pages functional

## URLs

**Frontend:** ___________________________________

**Backend API:** ___________________________________

**Database:** PostgreSQL on Railway

**Deployment Date:** ___________________________________

---

## Quick Commands

### View Backend Logs
```bash
railway logs --service=backend
```

### View Frontend Logs
```bash
railway logs --service=frontend
```

### Run Database Migrations
```bash
railway run --service=backend npm run prisma:migrate
```

### Open Prisma Studio
```bash
railway run --service=backend npx prisma studio
```

### Restart Service
```bash
railway restart --service=backend
```

---

**Status:** 🚧 In Progress | ✅ Complete | ❌ Failed

**Deployed by:** SWANTIN
**Date:** October 20, 2026
