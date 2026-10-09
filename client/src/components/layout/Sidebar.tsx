import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutGrid,
  ShoppingCart,
  Plus,
  FileText,
  Package,
  Layers,
  ArrowDownCircle,
  ArrowUpCircle,
  Zap,
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  BarChart3,
  Shield,
  Clock,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  key: string
  label: string
  icon: React.ElementType
  path: string
  roles: string[]
}

interface NavSection {
  section: string
  items: NavItem[]
}

const NAV_CONFIG: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/dashboard', roles: ['Administrator', 'Sales User', 'Inventory User', 'HR User'] },
    ],
  },
  {
    section: 'Sales',
    items: [
      { key: 'sales', label: 'Sales', icon: ShoppingCart, path: '/sales', roles: ['Administrator', 'Sales User'] },
      { key: 'createsale', label: 'Create Sale', icon: Plus, path: '/sales/create', roles: ['Administrator', 'Sales User'] },
      { key: 'invoices', label: 'Invoices', icon: FileText, path: '/invoices', roles: ['Administrator', 'Sales User'] },
    ],
  },
  {
    section: 'Inventory',
    items: [
      { key: 'products', label: 'Products', icon: Package, path: '/products', roles: ['Administrator', 'Inventory User', 'Sales User'] },
      { key: 'inventory', label: 'Inventory', icon: Layers, path: '/inventory', roles: ['Administrator', 'Inventory User'] },
      { key: 'stockin', label: 'Stock In', icon: ArrowDownCircle, path: '/inventory/stock-in', roles: ['Administrator', 'Inventory User'] },
      { key: 'stockout', label: 'Stock Out', icon: ArrowUpCircle, path: '/inventory/stock-out', roles: ['Administrator', 'Inventory User'] },
      { key: 'fastslow', label: 'Fast / Slow Movers', icon: Zap, path: '/inventory/fast-slow', roles: ['Administrator', 'Inventory User'] },
    ],
  },
  {
    section: 'Human Resources',
    items: [
      { key: 'employees', label: 'Employees', icon: Users, path: '/employees', roles: ['Administrator', 'HR User'] },
      { key: 'employeereg', label: 'Employee Registration', icon: UserPlus, path: '/employees/register', roles: ['Administrator', 'HR User'] },
      { key: 'attendance', label: 'Attendance', icon: Calendar, path: '/attendance', roles: ['Administrator', 'HR User'] },
    ],
  },
  {
    section: 'Insights',
    items: [
      { key: 'performance', label: 'Business Performance', icon: TrendingUp, path: '/performance', roles: ['Administrator'] },
      { key: 'reports', label: 'Reports', icon: BarChart3, path: '/reports', roles: ['Administrator', 'Sales User', 'Inventory User', 'HR User'] },
    ],
  },
  {
    section: 'Administration',
    items: [
      { key: 'users', label: 'User Management', icon: Shield, path: '/users', roles: ['Administrator'] },
      { key: 'auditlog', label: 'Audit Log', icon: Clock, path: '/audit-log', roles: ['Administrator'] },
      { key: 'settings', label: 'Settings', icon: Settings, path: '/settings', roles: ['Administrator'] },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <aside className="w-60 bg-[#0c1424] text-gray-300 flex flex-col fixed top-0 left-0 bottom-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3 p-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f5df5] to-[#6a4fd6] flex items-center justify-center font-display font-bold text-white text-sm">
          H
        </div>
        <div>
          <div className="font-display font-semibold text-white text-sm">HHW</div>
          <div className="text-[10px] text-gray-500 tracking-wide">Business Manager</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3.5 px-2.5">
        {NAV_CONFIG.map((section) => {
          const visibleItems = section.items.filter((item) =>
            user?.role && item.roles.includes(user.role)
          )

          if (visibleItems.length === 0) return null

          return (
            <div key={section.section} className="mb-6">
              <div className="text-[10px] font-semibold text-gray-500 tracking-wider px-3 mb-2">
                {section.section}
              </div>
              {visibleItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)

                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors relative',
                      active
                        ? 'bg-[#2f5df5]/20 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {active && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#2f5df5] rounded-r" />
                    )}
                    <Icon className={cn('w-4 h-4', active && 'text-[#6f8dff]')} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="inline-flex items-center px-2.5 py-1 bg-[#6f8dff]/20 text-[#8fa1ff] text-[10px] font-semibold rounded-full mb-3 tracking-wide">
          {user?.role}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
