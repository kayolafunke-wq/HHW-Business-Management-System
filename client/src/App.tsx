import { Routes, Route, Navigate } from 'react-router-dom'
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
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  const { isAuthenticated } = useAuthStore()

  console.log('App rendering, isAuthenticated:', isAuthenticated)

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
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
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Sales */}
        <Route path="sales" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User']}><SalesList /></ProtectedRoute>} />
        <Route path="sales/create" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User']}><CreateSale /></ProtectedRoute>} />
        <Route path="invoices" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User']}><InvoicesList /></ProtectedRoute>} />

        {/* Business */}
        <Route path="quotations" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User']}><QuotationsPage /></ProtectedRoute>} />
        <Route path="delivery-notes" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User', 'Inventory User']}><DeliveryNotesPage /></ProtectedRoute>} />
        <Route path="debtors" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales User']}><DebtorsPage /></ProtectedRoute>} />
        <Route path="creditors" element={<ProtectedRoute allowedRoles={['Administrator', 'Inventory User']}><CreditorsPage /></ProtectedRoute>} />

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
        <Route path="reports" element={<ReportsPage />} />
        <Route path="performance" element={<ProtectedRoute allowedRoles={['Administrator']}><PerformancePage /></ProtectedRoute>} />
        <Route path="sales-performance" element={<ProtectedRoute allowedRoles={['Administrator', 'Sales Manager']}><SalesPerformance /></ProtectedRoute>} />

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
