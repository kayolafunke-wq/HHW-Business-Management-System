import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onIdTokenChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { useAuthStore } from './store/authStore'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/auth/LoginPage'
import Dashboard from './pages/dashboard/Dashboard'
import SalesList from './pages/sales/SalesList'
import CreateSale from './pages/sales/CreateSale'
import InvoicesList from './pages/sales/InvoicesList'
import QuotationsPage from './pages/business/QuotationsPage'
import DeliveryNotesPage from './pages/business/DeliveryNotesPage'
import DebtorsPage from './pages/business/DebtorsPage'
import CreditorsPage from './pages/business/CreditorsPage'
import ProductsList from './pages/inventory/ProductsList'
import InventoryPage from './pages/inventory/InventoryPage'
import InventoryTracking from './pages/inventory/InventoryTracking'
import FastSlowMovers from './pages/inventory/FastSlowMovers'
import EmployeesList from './pages/hr/EmployeesList'
import EmployeeRegistration from './pages/hr/EmployeeRegistration'
import AttendancePage from './pages/hr/AttendancePage'
import ReportsPage from './pages/reports/ReportsPage'
import PerformancePage from './pages/reports/PerformancePage'
import SalesPerformance from './pages/reports/SalesPerformance'
import UsersPage from './pages/admin/UsersPage'
import AuditLogPage from './pages/admin/AuditLogPage'
import SettingsPage from './pages/admin/SettingsPage'

// Protected Route wrapper
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const token = localStorage.getItem('token')

  // If not authenticated or token missing, clean up and redirect to login
  if (!isAuthenticated || !token) {
    if (isAuthenticated && !token) {
      logout()
    }
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user) {
    // Normalize role formats: convert 'SALES_USER' to 'Sales User' and vice versa
    const userRole = user.role || ''
    const normalizedUserRole = userRole.replace(/_/g, ' ')
    const upperUserRole = userRole.replace(/ /g, '_').toUpperCase()
    
    // Check if user's role (in any format) is in allowed roles (in any format)
    const hasAccess = allowedRoles.some(allowedRole => {
      const normalizedAllowed = allowedRole.replace(/_/g, ' ')
      const upperAllowed = allowedRole.replace(/ /g, '_').toUpperCase()
      
      return userRole === allowedRole || 
             normalizedUserRole.toLowerCase() === normalizedAllowed.toLowerCase() ||
             upperUserRole === upperAllowed ||
             userRole.toUpperCase().includes('ADMIN')
    })
    
    if (!hasAccess) {
      // Redirect to role-appropriate page
      if (userRole.includes('SALES') || userRole.includes('Sales')) {
        return <Navigate to="/sales" replace />
      } else if (userRole.includes('INVENTORY') || userRole.includes('Inventory')) {
        return <Navigate to="/products" replace />
      } else if (userRole.includes('HR') || userRole.includes('Hr')) {
        return <Navigate to="/employees" replace />
      }
      return <Navigate to="/sales" replace />
    }
  }

  return <>{children}</>
}

function App() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const token = localStorage.getItem('token')
  const isValidSession = isAuthenticated && !!token

  // Automatically sync and refresh token when Firebase renews it
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const freshToken = await firebaseUser.getIdToken()
          localStorage.setItem('token', freshToken)
        } catch (e) {
          console.error('Error refreshing token:', e)
        }
      } else if (isAuthenticated) {
        // User logged out from Firebase or deleted
        logout()
      }
    })
    return () => unsubscribe()
  }, [isAuthenticated, logout])

  // Get role-based default route
  const getDefaultRoute = () => {
    if (!user) return '/dashboard'
    const role = user.role || ''
    if (role.includes('SALES') || role.includes('Sales')) return '/sales'
    if (role.includes('INVENTORY') || role.includes('Inventory')) return '/products'
    if (role.includes('HR') || role.includes('Hr')) return '/employees'
    return '/dashboard'
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isValidSession ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />}
      />

      {/* Protected routes with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="dashboard" element={<ProtectedRoute allowedRoles={['Administrator', 'Inventory User', 'HR User', 'Accountant']}><Dashboard /></ProtectedRoute>} />

        {/* Sales */}
        <Route path="sales" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User', 'Accountant']}><SalesList /></ProtectedRoute>} />
        <Route path="sales/create" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User']}><CreateSale /></ProtectedRoute>} />
        <Route path="invoices" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User', 'Accountant']}><InvoicesList /></ProtectedRoute>} />

        {/* Business */}
        <Route path="quotations" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User']}><QuotationsPage /></ProtectedRoute>} />
        <Route path="delivery-notes" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User', 'Inventory User']}><DeliveryNotesPage /></ProtectedRoute>} />
        <Route path="debtors" element={<ProtectedRoute allowedRoles={['Administrator', 'Accountant']}><DebtorsPage /></ProtectedRoute>} />
        <Route path="creditors" element={<ProtectedRoute allowedRoles={['Administrator', 'Accountant']}><CreditorsPage /></ProtectedRoute>} />

        {/* Inventory */}
        <Route path="products" element={<ProductsList />} />
        <Route path="inventory" element={<ProtectedRoute allowedRoles={['Administrator', 'Inventory User']}><InventoryPage /></ProtectedRoute>} />
        <Route path="inventory/tracking" element={<ProtectedRoute allowedRoles={['Administrator', 'Inventory User']}><InventoryTracking /></ProtectedRoute>} />
        <Route path="inventory/fast-slow" element={<ProtectedRoute allowedRoles={['Administrator', 'Inventory User']}><FastSlowMovers /></ProtectedRoute>} />

        {/* HR */}
        <Route path="employees" element={<ProtectedRoute allowedRoles={['Administrator', 'HR User']}><EmployeesList /></ProtectedRoute>} />
        <Route path="employees/register" element={<ProtectedRoute allowedRoles={['Administrator', 'HR User']}><EmployeeRegistration /></ProtectedRoute>} />
        <Route path="attendance" element={<ProtectedRoute allowedRoles={['Administrator', 'HR User']}><AttendancePage /></ProtectedRoute>} />

        {/* Reports */}
        <Route path="reports" element={<ProtectedRoute allowedRoles={['Administrator', 'Inventory User', 'HR User', 'Accountant']}><ReportsPage /></ProtectedRoute>} />
        <Route path="performance" element={<ProtectedRoute allowedRoles={['Administrator', 'Accountant']}><PerformancePage /></ProtectedRoute>} />
        <Route path="sales-performance" element={<ProtectedRoute allowedRoles={['Administrator']}><SalesPerformance /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="users" element={<ProtectedRoute allowedRoles={['Administrator']}><UsersPage /></ProtectedRoute>} />
        <Route path="audit-log" element={<ProtectedRoute allowedRoles={['Administrator']}><AuditLogPage /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute allowedRoles={['Administrator']}><SettingsPage /></ProtectedRoute>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
