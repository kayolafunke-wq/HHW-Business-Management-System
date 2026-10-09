import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await authService.signIn(email, password)
      setUser(user)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  // Demo accounts for quick testing
  const demoAccounts = [
    { name: 'Admin User', email: 'admin@hhw.com', role: 'Administrator' },
    { name: 'Sales User', email: 'sales@hhw.com', role: 'Sales User' },
    { name: 'Inventory User', email: 'inventory@hhw.com', role: 'Inventory User' },
    { name: 'HR User', email: 'hr@hhw.com', role: 'HR User' },
  ]

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-[#1c2c52] to-[#0c1424] relative overflow-hidden text-white p-12 flex flex-col justify-between">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2f5df5] to-[#6a4fd6] flex items-center justify-center font-display font-bold text-white">
              H
            </div>
            <div>
              <div className="font-display font-semibold text-base">HHW Business Manager</div>
              <div className="text-xs text-gray-400">Enterprise Operations Suite</div>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="font-display font-semibold text-3xl leading-tight mb-4">
              Run your entire business from one dashboard.
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Inventory, sales, invoicing, employees and performance — unified, in real time, for
              teams that need clarity over chaos.
            </p>

            <div className="flex gap-7">
              <div>
                <div className="font-display text-xl font-bold">250+</div>
                <div className="text-xs text-gray-500">Products tracked</div>
              </div>
              <div>
                <div className="font-display text-xl font-bold">12</div>
                <div className="text-xs text-gray-500">Team members</div>
              </div>
              <div>
                <div className="font-display text-xl font-bold">5M+</div>
                <div className="text-xs text-gray-500">MK in sales</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-500">
          © 2026 HHW Business Management System
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display font-semibold text-2xl mb-1">Welcome back</h2>
            <p className="text-sm text-gray-600">Sign in to access your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@hhw.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-[#2f5df5] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">QUICK DEMO ACCESS</span>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account.email)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#2f5df5] hover:bg-blue-50 transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-sm text-gray-900">{account.name}</div>
                  <div className="text-xs text-gray-500">
                    {account.role} · {account.email}
                  </div>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
