import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAyLOWAZ4mL6lM2Hx4KYnvJFsVBEb2xG7w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "business-management-syst-80c96.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "business-management-syst-80c96",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "business-management-syst-80c96.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "282402870257",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:282402870257:web:14d71dd6df4c9d3e1eea50",
  measurementId: "G-6MSG50957H"
}

// Initialize Firebase default app
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

/**
 * Creates a new user in Firebase Auth using an isolated secondary app instance.
 * This guarantees the admin's currently active auth session and token are NEVER modified or logged out.
 */
export async function createSecondaryFirebaseUser(email: string, password: string): Promise<string> {
  const secondaryAppName = `AdminCreateUser_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  const secondaryApp = initializeApp(firebaseConfig, secondaryAppName)
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    const uid = cred.user.uid
    try {
      await signOut(secondaryAuth)
      await deleteApp(secondaryApp)
    } catch (_) {}
    return uid
  } catch (error) {
    try {
      await signOut(secondaryAuth)
      await deleteApp(secondaryApp)
    } catch (_) {}
    throw error
  }
}

export default app
