import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { demoLogin } = useAuthStore()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)

  console.log('LoginPage rendering')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate login delay
    setTimeout(() => {
      // Demo login - just use Administrator role
      demoLogin('Administrator')
      toast.success('Welcome back, Chikondi!')
      navigate('/dashboard')
      setLoading(false)
    }, 500)
  }

  // Demo accounts matching the prototype
  const demoAccounts = [
    { name: 'Chikondi Mvula', username: '@admin', role: 'Administrator' },
    { name: 'Grace Mwale', username: '@grace.sales', role: 'Sales User' },
    { name: 'Steven Mbewe', username: '@steven.inv', role: 'Inventory User' },
    { name: 'Faith Nyasulu', username: '@faith.hr', role: 'HR User' },
    { name: 'Finance Manager', username: '@finance', role: 'Accountant' },
  ]

  const handleDemoLogin = (role: string) => {
    demoLogin(role)
    toast.success(`Signed in as ${role}`)
    navigate('/dashboard')
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
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2f5df5] to-[#6a4fd6] flex items-center justify-center font-display font-bold text-white text-lg">
              H
            </div>
            <div>
              <div className="font-display font-semibold text-base">HHW Business Manager</div>
              <div className="text-[11px] text-gray-400 tracking-wide">Enterprise Operations Suite</div>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="font-display font-semibold text-[34px] leading-tight mb-4">
              Run your entire business from one dashboard.
            </h1>
            <p className="text-[#a6b0cc] text-sm mb-8">
              Inventory, sales, invoicing, employees and performance — unified, in real time, for
              teams that need clarity over chaos.
            </p>

            <div className="flex gap-7">
              <div>
                <div className="font-display text-[22px] font-bold">25</div>
                <div className="text-[11.5px] text-[#8290ae]">Products tracked</div>
              </div>
              <div>
                <div className="font-display text-[22px] font-bold">12</div>
                <div className="text-[11.5px] text-[#8290ae]">Team members</div>
              </div>
              <div>
                <div className="font-display text-[22px] font-bold">21,932,894</div>
                <div className="text-[11.5px] text-[#8290ae]">MK in tracked sales</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11.5px] text-[#5b6a8c]">
          © 2026 HHW Business Manager — Prototype Build
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[380px]">
          <div className="mb-6">
            <h2 className="font-display font-semibold text-[22px] mb-1">Welcome back</h2>
            <p className="text-[13px] text-gray-600">Sign in to access your workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-[12px] mt-2.5 mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-[#2f5df5] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full !py-2.5" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-[11.5px]">
              <span className="bg-white px-2 text-gray-500 font-semibold tracking-wide">QUICK DEMO ACCESS — pick a role</span>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                onClick={() => handleDemoLogin(account.role)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#2f5df5] hover:bg-blue-50 transition-colors text-left"
              >
                <div>
                  <div className="font-semibold text-sm text-gray-900">{account.name}</div>
                  <div className="text-[11px] text-gray-500">
                    {account.role} · {account.username}
                  </div>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
