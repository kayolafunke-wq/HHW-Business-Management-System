import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useApiStore } from '@/store/apiStore'

export default function MainLayout() {
  const initializeData = useApiStore((state) => state.initializeData)

  // Initialize data from API when layout mounts
  useEffect(() => {
    initializeData()
  }, [initializeData])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
