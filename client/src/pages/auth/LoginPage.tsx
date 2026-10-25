import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { API_BASE_URL } from '@/services/api'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Package,
  Users,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const quickFill = (email: string, pass: string = 'password123') => {
    setUsername(email)
    setPassword(pass)
  }

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
        toast.error(`Cannot connect to backend. Please check network connection.`)
      } else {
        toast.error(error.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#080c16] text-white flex flex-col lg:flex-row relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Ambient background glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-[130px]" />
        
        {/* Subtle high-tech grid texture */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ================= LEFT SIDE: DESKTOP SHOWCASE ================= */}
      <div className="hidden lg:flex lg:w-[54%] flex-col justify-between p-12 relative z-10 border-r border-white/10">
        <div>
          {/* Logo & Platform Pill */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3.5 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-2xl shadow-xl border border-white/20">
                  H
                </div>
              </div>
              <div>
                <div className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                  HHW Business Manager
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold border border-blue-400/30">
                    v2.6
                  </span>
                </div>
                <div className="text-xs text-blue-200/70 font-medium tracking-wide">
                  Enterprise Operations Suite
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-300 font-medium">Railway Cloud Active</span>
            </div>
          </div>

          {/* Headline & Value Proposition */}
          <div className="max-w-xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Unified Enterprise Architecture
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white mb-4">
              Run your entire business from{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                one smart platform.
              </span>
            </h1>

            <p className="text-sm text-gray-300/90 leading-relaxed">
              Seamlessly unify Point of Sale, real-time inventory tracking, staff attendance, customer billing, and executive analytics without spreadsheets or data silos.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 gap-3.5 max-w-xl mb-10">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">Fast Point of Sale</div>
              <div className="text-xs text-gray-400">Generate receipts, quotes & delivery notes in seconds.</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-3">
                <Package className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">Live Stock Control</div>
              <div className="text-xs text-gray-400">Automated stock-in/out tracking and low-inventory alerts.</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">Workforce & HR</div>
              <div className="text-xs text-gray-400">Daily attendance check-ins, monthly logs and performance ranks.</div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">Business Intelligence</div>
              <div className="text-xs text-gray-400">Daily revenue trends, gross margins & fast-moving movers.</div>
            </div>
          </div>
        </div>

        {/* Desktop Footer Security Info */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit SSL encrypted • Role-based access control</span>
          </div>
          <div>© {new Date().getFullYear()} HHW Operations Suite</div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: LOGIN FORM (MOBILE & DESKTOP) ================= */}
      <div className="w-full lg:w-[46%] min-h-screen flex items-center justify-center p-5 sm:p-8 md:p-12 relative z-10">
        <div className="w-full max-w-[420px] py-4">
          
          {/* Mobile Header Branding */}
          <div className="lg:hidden mb-6 text-center">
            <div className="inline-block relative mb-3">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-md opacity-75" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-2xl shadow-xl border border-white/20 mx-auto">
                H
              </div>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">HHW Business Manager</h1>
            <p className="text-xs text-blue-200/70 font-medium">Enterprise Operations Suite</p>
          </div>

          {/* Main Auth Card */}
          <div className="rounded-2xl bg-white/[0.04] sm:bg-white/[0.06] border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">Welcome back</h2>
              <p className="text-xs text-gray-400">
                Sign in with your work credentials to access your workspace
              </p>
            </div>

            {/* Quick Demo Access Pills */}
            <div className="mb-5 pb-5 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Quick Fill Roles:
                </span>
                <span className="text-[10px] text-blue-400 font-medium">Tap to load</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => quickFill('admin@hhw.com')}
                  className="px-2 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/25 text-[11px] font-semibold text-blue-300 transition-colors text-center"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => quickFill('grace.sales@hhw.com')}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-400/25 text-[11px] font-semibold text-purple-300 transition-colors text-center"
                >
                  Sales
                </button>
                <button
                  type="button"
                  onClick={() => quickFill('steven.inv@hhw.com')}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/25 text-[11px] font-semibold text-emerald-300 transition-colors text-center"
                >
                  Inventory
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. grace.sales@hhw.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-black/25 border border-white/15 rounded-xl text-white placeholder-gray-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>

              {/* Password Field with Toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-2.5 bg-black/25 border border-white/15 rounded-xl text-white placeholder-gray-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
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

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-600 bg-black/30 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-gray-300">Remember me</span>
                </label>
                <span className="text-blue-400 hover:text-blue-300 text-xs transition-colors cursor-pointer">
                  Forgot password?
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Card Footer Help */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-xs text-gray-400">
                Need an account or password reset?{' '}
                <span className="text-gray-200 font-medium block sm:inline mt-0.5 sm:mt-0">
                  Contact your HR or Administrator
                </span>
              </p>
            </div>
          </div>

          {/* Mobile Footer Status */}
          <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Enterprise Security Protected • HHW Suite</span>
          </div>

        </div>
      </div>
    </div>
  )
}

