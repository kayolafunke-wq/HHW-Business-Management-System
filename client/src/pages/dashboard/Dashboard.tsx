import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useDataStore } from '@/store/dataStore'
import AdminDashboard from './AdminDashboard'
import SalesDashboard from './SalesDashboard'
import InventoryDashboard from './InventoryDashboard'
import HRDashboard from './HRDashboard'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { initialized, initializeData } = useDataStore()
  const [isLoading, setIsLoading] = useState(!initialized)

  useEffect(() => {
    let isMounted = true
    
    const loadData = async () => {
      if (!initialized && isMounted) {
        setIsLoading(true)
        await initializeData()
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, []) // Run only once on mount

  // Update loading state when initialized changes
  useEffect(() => {
    if (initialized) {
      setIsLoading(false)
    }
  }, [initialized])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
