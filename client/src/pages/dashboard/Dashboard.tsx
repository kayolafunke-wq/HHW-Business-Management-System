import { useAuthStore } from '@/store/authStore'
import AdminDashboard from './AdminDashboard'
import SalesDashboard from './SalesDashboard'
import InventoryDashboard from './InventoryDashboard'
import HRDashboard from './HRDashboard'

export default function Dashboard() {
  const { user } = useAuthStore()

  const role = (user?.role || '').toUpperCase()

  // Render role-specific dashboard with flexible matching
  if (role.includes('SALES')) {
    return <SalesDashboard />
  }
  if (role.includes('INVENTORY')) {
    return <InventoryDashboard />
  }
  if (role.includes('HR')) {
    return <HRDashboard />
  }

  // Default to Admin dashboard (Administrator, Accountant, etc.)
  return <AdminDashboard />
}

