import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { API_BASE_URL } from '@/services/api'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, username, password)
      const firebaseUser = userCredential.user
      
      // Get ID token
      const idToken = await firebaseUser.getIdToken()
      
      // Verify with backend and get user data
      const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        // Store token
        localStorage.setItem('token', idToken)
        
        // Set user in auth store
        useAuthStore.getState().setUser(result.data)
        
        toast.success(`Welcome back, ${result.data.name}!`)
        
        // Redirect based on role
        const role = result.data.role
        if (role === 'Sales User' || role === 'SALES_USER' || role?.includes('SALES')) {
          navigate('/sales')
        } else if (role?.includes('INVENTORY') || role?.includes('Inventory')) {
          navigate('/products')
        } else if (role?.includes('HR') || role?.includes('Hr')) {
          navigate('/employees')
        } else {
          navigate('/dashboard')
        }
      } else {
        toast.error(result.message || 'Authentication failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        toast.error('Invalid email or password')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Please try again later.')
      } else if (error.message && error.message.includes('Failed to fetch')) {
        toast.error(`Cannot connect to backend at ${API_BASE_URL}. Verify Railway VITE_API_URL variable.`)
      } else {
        toast.error(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col lg:flex-row overflow-x-hidden bg-white">
      {/* Left side - Branding - Visible on desktop */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0f1729] overflow-y-hidden text-white p-8 flex-col justify-between fixed left-0 top-0 h-screen z-10">
        {/* Background container - relative positioning */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#3b82f6]/40 to-[#8b5cf6]/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#8b5cf6]/40 to-[#3b82f6]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-gradient-to-br from-[#6366f1]/30 to-[#a855f7]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
          
          {/* Enhanced grid background */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(rgba(147,197,253,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(147,197,253,0.1) 2px, transparent 2px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* Diagonal lines pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(96,165,250,0.1) 0px, rgba(96,165,250,0.1) 2px, transparent 2px, transparent 40px)',
            }}
          />

          {/* Floating particles */}
          <div className="absolute inset-0">
            <div className="absolute top-[20%] left-[15%] w-3 h-3 bg-blue-400/60 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute top-[35%] right-[25%] w-2 h-2 bg-purple-400/60 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute bottom-[30%] left-[40%] w-3 h-3 bg-indigo-400/60 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
            <div className="absolute top-[60%] right-[15%] w-2 h-2 bg-blue-300/60 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-[15%] left-[25%] w-2.5 h-2.5 bg-purple-300/60 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
            <div className="absolute top-[45%] left-[60%] w-2 h-2 bg-indigo-300/60 rounded-full animate-ping" style={{ animationDuration: '4.5s', animationDelay: '2.5s' }} />
          </div>

          {/* Glowing accent lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>

        <div className="relative z-10">
          {/* Logo with glow effect */}
          <div className="flex items-center gap-3 mb-12 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center font-display font-bold text-white text-xl shadow-2xl ring-2 ring-blue-400/30">
                H
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-lg bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                HHW Business Manager
              </div>
              <div className="text-[11px] text-blue-300/90 tracking-wider font-medium">Enterprise Operations Suite</div>
            </div>
          </div>

          <div className="max-w-lg">
            {/* Main headline with gradient */}
            <h1 className="font-display font-bold text-[36px] leading-[1.1] mb-4 bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
              Run your entire business from one dashboard.
            </h1>
            
            <p className="text-[14px] text-blue-100/95 leading-relaxed mb-8 font-medium">
              Inventory, sales, invoicing, employees and performance — unified, in real time, for
              teams that need clarity over chaos.
            </p>

            {/* Feature highlights with icons */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm group hover:translate-x-1 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center backdrop-blur-sm border border-blue-400/40 shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-blue-50/95 font-medium">Real-time inventory tracking & alerts</span>
              </div>
              <div className="flex items-center gap-3 text-sm group hover:translate-x-1 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/20 flex items-center justify-center backdrop-blur-sm border border-purple-400/40 shadow-lg shadow-purple-500/20">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-blue-50/95 font-medium">Lightning-fast sales processing</span>
              </div>
              <div className="flex items-center gap-3 text-sm group hover:translate-x-1 transition-transform">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-indigo-600/20 flex items-center justify-center backdrop-blur-sm border border-indigo-400/40 shadow-lg shadow-indigo-500/20">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-blue-50/95 font-medium">Powerful analytics & insights</span>
              </div>
            </div>

            {/* Stats with glass effect */}
            <div className="flex gap-4">
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-4 border border-white/30 flex-1 shadow-xl shadow-blue-900/20 hover:scale-105 transition-transform">
                <div className="font-display text-[28px] font-bold bg-gradient-to-br from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">25</div>
                <div className="text-[11px] text-blue-100/90 font-medium tracking-wide">Products tracked</div>
              </div>
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-4 border border-white/30 flex-1 shadow-xl shadow-purple-900/20 hover:scale-105 transition-transform">
                <div className="font-display text-[28px] font-bold bg-gradient-to-br from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">12</div>
                <div className="text-[11px] text-blue-100/90 font-medium tracking-wide">Team members</div>
              </div>
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-4 border border-white/30 flex-1 shadow-xl shadow-indigo-900/20 hover:scale-105 transition-transform">
                <div className="font-display text-[28px] font-bold bg-gradient-to-br from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">21M</div>
                <div className="text-[11px] text-blue-100/90 font-medium tracking-wide">MK in sales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with subtle animation */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-[12px] text-blue-200/70 font-medium">
            © 2026 HHW Business Manager
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-400/30 backdrop-blur-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-[11px] text-emerald-300/90 font-medium">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form - Full width & clean on mobile, half on desktop */}
      <div className="w-full lg:w-1/2 lg:ml-auto min-h-[100dvh] flex flex-col bg-white">
        {/* Mobile Top Hero Header (matches PC design, flush with top of screen) */}
        <div className="lg:hidden w-full bg-gradient-to-br from-[#0a0e1a] via-[#1a1f3a] to-[#0f1729] text-white px-6 pt-10 pb-7 rounded-b-[28px] relative overflow-hidden shadow-lg">
          {/* Glowing orbs */}
          <div className="absolute -top-12 -left-12 w-44 h-44 bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
          {/* Grid line texture */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(147,197,253,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(147,197,253,0.12) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2f5df5] to-[#6a4fd6] flex items-center justify-center font-display font-bold text-white text-lg shadow-md ring-2 ring-white/10 flex-shrink-0">
                H
              </div>
              <div>
                <div className="font-display font-bold text-base text-white leading-tight">
                  HHW Business Manager
                </div>
                <div className="text-xs text-blue-300 font-medium">Enterprise Operations Suite</div>
              </div>
            </div>

            <p className="text-xs text-blue-100/90 font-medium leading-relaxed mb-2.5">
              Run your entire business from one smart dashboard.
            </p>

            <div className="flex items-center gap-3 text-[11px] text-blue-200/80 font-medium flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Sales & Invoicing
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Inventory
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                HR & Reports
              </span>
            </div>
          </div>
        </div>

        {/* Form container */}
        <div className="w-full max-w-[380px] mx-auto px-6 py-6 sm:py-10 flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to access your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. grace.sales@hhw.com"
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full max-w-full px-3 py-2 pr-10 text-base sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2f5df5] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#2f5df5] focus:ring-[#2f5df5]" defaultChecked />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-[#2f5df5] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full !py-3 text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            Need access?{' '}
            <span className="text-gray-800 font-semibold">
              Contact your HR or Administrator
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

