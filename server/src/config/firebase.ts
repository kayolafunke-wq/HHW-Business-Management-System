import admin from 'firebase-admin'

// Initialize Firebase Admin
let firebaseAdmin: admin.app.App
let auth: admin.auth.Auth

try {
  // Check if we have service account credentials
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
    const firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }

    if (!admin.apps.length) {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
      })
      console.log('✅ Firebase Admin initialized with service account credentials')
    } else {
      firebaseAdmin = admin.app()
    }
  } else {
    // Fallback: Initialize with just project ID (limited functionality)
    if (!admin.apps.length) {
      firebaseAdmin = admin.initializeApp({
        projectId: 'business-management-syst-80c96'
      })
      console.log('⚠️  Firebase Admin initialized with project ID only (limited functionality)')
    } else {
      firebaseAdmin = admin.app()
    }
  }
  
  auth = admin.auth()
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error)
  throw error
}

export { firebaseAdmin, auth }
export default admin
