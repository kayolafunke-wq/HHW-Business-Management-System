import { Search, Bell } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getInitials } from '@/lib/utils'

export default function Topbar() {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, invoices, employees..."
            className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 w-full"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-full border border-gray-200 bg-white">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2f5df5] to-[#6a4fd6] flex items-center justify-center text-white text-xs font-bold font-display">
            {user && getInitials(user.name)}
          </div>
          <div className="pr-1">
            <div className="text-xs font-semibold text-gray-900">{user?.name}</div>
            <div className="text-[10px] text-gray-500">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
