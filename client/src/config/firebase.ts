import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAyLOWAZ4mL6lM2Hx4KYnvJFsVBEb2xG7w",
  authDomain: "business-management-syst-80c96.firebaseapp.com",
  projectId: "business-management-syst-80c96",
  storageBucket: "business-management-syst-80c96.firebasestorage.app",
  messagingSenderId: "282402870257",
  appId: "1:282402870257:web:14d71dd6df4c9d3e1eea50",
  measurementId: "G-6MSG50957H"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)

export default app
