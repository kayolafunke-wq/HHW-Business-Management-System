import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Simplified User type for demo
interface User {
  id: string
  name: string
  email: string
  username: string
  role: string
  status: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
  demoLogin: (role: string) => void
}

// Demo users matching prototype
const DEMO_USERS: Record<string, User> = {
  'Administrator': {
    id: 'U1',
    name: 'Chikondi Mvula',
    email: 'admin@hhw.com',
    username: 'admin',
    role: 'Administrator',
    status: 'Active'
  },
  'Sales User': {
    id: 'U2',
    name: 'Grace Mwale',
    email: 'grace.sales@hhw.com',
    username: 'grace.sales',
    role: 'Sales User',
    status: 'Active'
  },
  'Inventory User': {
    id: 'U4',
    name: 'Steven Mbewe',
    email: 'steven.inv@hhw.com',
    username: 'steven.inv',
    role: 'Inventory User',
    status: 'Active'
  },
  'HR User': {
    id: 'U5',
    name: 'Faith Nyasulu',
    email: 'faith.hr@hhw.com',
    username: 'faith.hr',
    role: 'HR User',
    status: 'Active'
  },
  'Accountant': {
    id: 'U6',
    name: 'Finance Manager',
    email: 'finance@hhw.com',
    username: 'finance',
    role: 'Accountant',
    status: 'Active'
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      demoLogin: (role: string) => {
        const user = DEMO_USERS[role]
        if (user) {
          set({ user, isAuthenticated: true })
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
