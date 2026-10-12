import admin from 'firebase-admin'

// Only initialize Firebase in production or when credentials are provided
let firebaseAdmin: admin.app.App | null = null
let auth: admin.auth.Auth | null = null

if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_PROJECT_ID) {
  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }

  // Initialize Firebase Admin
  if (!admin.apps.length) {
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
    })
    auth = admin.auth()
  }
} else {
  console.log('ℹ️  Firebase not initialized - running in development mode')
}

export { firebaseAdmin, auth }
export default admin
