import { signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '../lib/firebase'
import api from '../lib/api'
import { User } from '../types'

export const authService = {
  // Sign in with Firebase and sync with backend
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()

      // Verify token with backend and get user data
      const response = await api.post('/auth/verify-token', { idToken })
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to sign in')
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    await firebaseSignOut(auth)
    await api.post('/auth/logout')
  },

  // Get current user from backend
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  // Register new user (admin only)
  async register(userData: {
    name: string
    email: string
    username: string
    password: string
    role: string
  }): Promise<User> {
    const response = await api.post('/auth/register', userData)
    return response.data.data
  },
}
