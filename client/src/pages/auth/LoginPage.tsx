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
      <div className="flex-1 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0c1424] relative overflow-hidden text-white p-12 flex flex-col justify-between">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-[#2f5df5]/30 to-[#6a4fd6]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-br from-[#6a4fd6]/30 to-[#2f5df5]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-300/40 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>

        <div className="relative z-10">
          {/* Logo with glow effect */}
          <div className="flex items-center gap-3 mb-20 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2f5df5] to-[#6a4fd6] rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-[#2f5df5] to-[#6a4fd6] flex items-center justify-center font-display font-bold text-white text-xl shadow-2xl">
                H
              </div>
            </div>
            <div>
              <div className="font-display font-bold text-lg bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                HHW Business Manager
              </div>
              <div className="text-[11px] text-blue-300/80 tracking-wider font-medium">Enterprise Operations Suite</div>
            </div>
          </div>

          <div className="max-w-lg">
            {/* Main headline with gradient */}
            <h1 className="font-display font-bold text-[42px] leading-[1.1] mb-5 bg-gradient-to-br from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Run your entire business from one dashboard.
            </h1>
            
            <p className="text-[15px] text-blue-100/90 leading-relaxed mb-10 font-medium">
              Inventory, sales, invoicing, employees and performance — unified, in real time, for
              teams that need clarity over chaos.
            </p>

            {/* Feature highlights with icons */}
            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-blue-100/90 font-medium">Real-time inventory tracking & alerts</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center backdrop-blur-sm border border-purple-400/30">
                  <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-blue-100/90 font-medium">Lightning-fast sales processing</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center backdrop-blur-sm border border-indigo-400/30">
                  <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-blue-100/90 font-medium">Powerful analytics & insights</span>
              </div>
            </div>

            {/* Stats with glass effect */}
            <div className="flex gap-6">
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 flex-1">
                <div className="font-display text-[28px] font-bold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent">25</div>
                <div className="text-[11.5px] text-blue-200/80 font-medium tracking-wide">Products tracked</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 flex-1">
                <div className="font-display text-[28px] font-bold bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent">12</div>
                <div className="text-[11.5px] text-blue-200/80 font-medium tracking-wide">Team members</div>
              </div>
              <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20 flex-1">
                <div className="font-display text-[28px] font-bold bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-transparent">21M</div>
                <div className="text-[11.5px] text-blue-200/80 font-medium tracking-wide">MK in sales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with subtle animation */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-[11.5px] text-blue-300/60 font-medium">
            © 2026 HHW Business Manager
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-[11px] text-blue-300/80 font-medium">All systems operational</span>
          </div>
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
