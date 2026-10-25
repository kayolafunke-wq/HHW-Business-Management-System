import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useApiStore } from '@/store/apiStore'

export default function MainLayout() {
  const location = useLocation()
  const initializeData = useApiStore((state) => state.initializeData)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Scroll to top on every route transition
  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [location.pathname])

  // Initialize data from API when layout mounts - ONLY ONCE
  useEffect(() => {
    if (!initialized) {
      initializeData()
      setInitialized(true)
    }
  }, []) // Empty dependency array - runs only once on mount

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden w-full max-w-[100vw]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu Button - Only visible when menu is CLOSED */}
      {!mobileMenuOpen && (
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          className="lg:hidden fixed top-3.5 left-3.5 z-30 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 hover:bg-white text-gray-700 transition-all active:scale-95"
        >
          <Menu className="w-5 h-5 text-gray-900" />
        </button>
      )}

      {/* Mobile Sidebar Overlay with smooth fade */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer - Full Dark & seamless */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-[#0c1424] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar 
          onLinkClick={() => setMobileMenuOpen(false)} 
          onClose={() => setMobileMenuOpen(false)}
          className="w-full h-full static shadow-none"
        />
      </div>

      {/* Main Content Area - Completely stable, no horizontal shake/overflow */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60 w-full max-w-full overflow-x-hidden">
        <Topbar />
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
