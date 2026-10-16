import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import AdminDashboard from './AdminDashboard'
import SalesDashboard from './SalesDashboard'
import InventoryDashboard from './InventoryDashboard'
import HRDashboard from './HRDashboard'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { initialized, initializeData } = useDataStore()

  useEffect(() => {
    if (!initialized) {
      initializeData()
    }
  }, [initialized, initializeData])

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="skeleton w-32 h-32 rounded-full mx-auto mb-4"></div>
          <div className="text-sm text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  // Render role-specific dashboard
  switch (user?.role) {
    case 'Administrator':
      return <AdminDashboard />
    case 'Sales User':
      return <SalesDashboard />
    case 'Inventory User':
      return <InventoryDashboard />
    case 'HR User':
      return <HRDashboard />
    default:
      return <AdminDashboard />
  }
}
