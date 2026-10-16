import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Pagination, usePagination } from '@/components/ui/Pagination'
import { 
  Search, 
  FileText, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  Shield,
  Download,
  Calendar,
  Filter
} from 'lucide-react'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  userName: string
  action: string
  category: 'Sales' | 'Inventory' | 'Users' | 'Settings' | 'Products' | 'HR'
  details: string
  ipAddress: string
  status: 'Success' | 'Failed' | 'Warning'
}

const SAMPLE_LOGS: AuditLog[] = [
  {
    id: '1',
    timestamp: '2026-10-10 10:22:15',
    user: 'CM',
    userName: 'Chikondi Mvula',
    action: 'User Login',
    category: 'Users',
    details: 'Logged in as Administrator',
    ipAddress: '192.168.1.45',
    status: 'Success',
  },
  {
    id: '2',
    timestamp: '2026-10-10 09:45:32',
    user: 'JB',
    userName: 'John Banda',
    action: 'Created Sale',
    category: 'Sales',
    details: 'Sale #SALE-1234 for MK 425,500',
    ipAddress: '192.168.1.23',
    status: 'Success',
  },
  {
    id: '3',
    timestamp: '2026-10-10 09:30:18',
    user: 'SM',
    userName: 'Steven Mbewe',
    action: 'Stock Movement',
    category: 'Inventory',
    details: 'Added 50 units of Cooking Oil 5L (PO-5678)',
    ipAddress: '192.168.1.67',
    status: 'Success',
  },
  {
    id: '4',
    timestamp: '2026-10-10 08:15:45',
    user: 'CM',
    userName: 'Chikondi Mvula',
    action: 'Created User',
    category: 'Users',
    details: 'Created new user account for Moses Kachale',
    ipAddress: '192.168.1.45',
    status: 'Success',
  },
  {
    id: '5',
    timestamp: '2026-10-09 16:50:22',
    user: 'GP',
    userName: 'Grace Phiri',
    action: 'Created Invoice',
    category: 'Sales',
    details: 'Invoice #INV-1023 generated for MK 180,000',
    ipAddress: '192.168.1.34',
    status: 'Success',
  },
  {
    id: '6',
    timestamp: '2026-10-09 15:30:11',
    user: 'SM',
    userName: 'Steven Mbewe',
    action: 'Product Updated',
    category: 'Products',
    details: 'Updated price for Samsung 32" LED TV',
    ipAddress: '192.168.1.67',
    status: 'Success',
  },
  {
    id: '7',
    timestamp: '2026-10-09 14:20:08',
    user: 'JB',
    userName: 'John Banda',
    action: 'Failed Login Attempt',
    category: 'Users',
    details: 'Invalid password entered',
    ipAddress: '192.168.1.23',
    status: 'Failed',
  },
  {
    id: '8',
    timestamp: '2026-10-09 11:45:33',
    user: 'AM',
    userName: 'Alinane Mvula',
    action: 'Attendance Marked',
    category: 'HR',
    details: 'Marked attendance for 7 employees',
    ipAddress: '192.168.1.89',
    status: 'Success',
  },
  {
    id: '9',
    timestamp: '2026-10-09 10:10:19',
    user: 'CM',
    userName: 'Chikondi Mvula',
    action: 'Settings Changed',
    category: 'Settings',
    details: 'Updated system currency settings',
    ipAddress: '192.168.1.45',
    status: 'Success',
  },
  {
    id: '10',
    timestamp: '2026-10-08 17:25:44',
    user: 'SM',
    userName: 'Steven Mbewe',
    action: 'Stock Movement',
    category: 'Inventory',
    details: 'Removed 1 unit of Bluetooth Speaker (Damaged)',
    ipAddress: '192.168.1.67',
    status: 'Warning',
  },
  {
    id: '11',
    timestamp: '2026-10-08 15:40:27',
    user: 'JB',
    userName: 'John Banda',
    action: 'Created Quotation',
    category: 'Sales',
    details: 'Quotation #QUO-089 for Walk-in Customer',
    ipAddress: '192.168.1.23',
    status: 'Success',
  },
  {
    id: '12',
    timestamp: '2026-10-08 13:15:55',
    user: 'CM',
    userName: 'Chikondi Mvula',
    action: 'User Deactivated',
    category: 'Users',
    details: 'Deactivated user account for Moses Kachale',
    ipAddress: '192.168.1.45',
    status: 'Success',
  },
  {
    id: '13',
    timestamp: '2026-10-08 10:05:12',
    user: 'GP',
    userName: 'Grace Phiri',
    action: 'Created Sale',
    category: 'Sales',
    details: 'Sale #SALE-1233 for MK 156,800',
    ipAddress: '192.168.1.34',
    status: 'Success',
  },
  {
    id: '14',
    timestamp: '2026-10-07 16:30:48',
    user: 'SM',
    userName: 'Steven Mbewe',
    action: 'Product Created',
    category: 'Products',
    details: 'Added new product: Wireless Keyboard',
    ipAddress: '192.168.1.67',
    status: 'Success',
  },
  {
    id: '15',
    timestamp: '2026-10-07 14:50:33',
    user: 'AM',
    userName: 'Alinane Mvula',
    action: 'Employee Registered',
    category: 'HR',
    details: 'Registered new employee: Patricia Nkhoma',
    ipAddress: '192.168.1.89',
    status: 'Success',
  },
]

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Sales':
      return ShoppingCart
    case 'Inventory':
      return Package
    case 'Users':
      return Shield
    case 'Settings':
      return Settings
    case 'Products':
      return Package
    case 'HR':
      return Users
    default:
      return FileText
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Sales':
      return '#2f5df5'
    case 'Inventory':
      return '#0ea885'
    case 'Users':
      return '#6a4fd6'
    case 'Settings':
      return '#c97a1a'
    case 'Products':
      return '#2f5df5'
    case 'HR':
      return '#0ea885'
    default:
      return '#6b7280'
  }
}

export default function AuditLogPage() {
  const [logs] = useState<AuditLog[]>(SAMPLE_LOGS)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [dateFilter, setDateFilter] = useState('')

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(logs.map(log => log.category)))]
  const statuses = ['All', 'Success', 'Failed', 'Warning']

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || log.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter
    const matchesDate = !dateFilter || log.timestamp.startsWith(dateFilter)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate
  })

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(filteredLogs, 20)

  // Calculate stats
  const totalActions = logs.length
  const successCount = logs.filter(l => l.status === 'Success').length
  const failedCount = logs.filter(l => l.status === 'Failed').length
  const warningCount = logs.filter(l => l.status === 'Warning').length

  const handleExport = () => {
    alert('Exporting audit log to CSV...')
    // Here you would implement actual CSV export
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Audit Log</h1>
          <p className="page-sub">Chronological record of all system actions</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Total Actions */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#e8eefd', color: '#2f5df5' }}
            >
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-label">Total Actions</div>
          <div className="kpi-value">{totalActions}</div>
        </Card>

        {/* Success */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#e3f8f2', color: '#0ea885' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <path d="m22 4-10 10-3-3"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Success</div>
          <div className="kpi-value">{successCount}</div>
        </Card>

        {/* Failed */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#fbe9e7', color: '#c2372c' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6m0-6 6 6"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Failed</div>
          <div className="kpi-value">{failedCount}</div>
        </Card>

        {/* Warnings */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#fbf0dd', color: '#c97a1a' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/>
                <path d="M12 9v4M12 17h.01"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Warnings</div>
          <div className="kpi-value">{warningCount}</div>
        </Card>
      </div>

      <Card>
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-3">
            {/* Search */}
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by user, action, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                className="input pl-10 w-full"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                className="input w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Filter */}
          <div className="mt-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              className="input"
              style={{ width: '180px' }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            {dateFilter && (
              <button
                className="text-xs text-gray-600 hover:text-gray-900 underline"
                onClick={() => setDateFilter('')}
              >
                Clear date
              </button>
            )}
            <div className="ml-auto text-sm text-gray-500">
              Showing {filteredLogs.length} of {totalActions} actions
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Category</th>
                <th>Details</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((log) => {
                  const CategoryIcon = getCategoryIcon(log.category)
                  const categoryColor = getCategoryColor(log.category)

                  return (
                    <tr key={log.id}>
                      <td>
                        <div className="text-sm text-gray-900">{log.timestamp.split(' ')[0]}</div>
                        <div className="text-xs text-gray-500">{log.timestamp.split(' ')[1]}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                            style={{ background: '#2f5df5' }}
                          >
                            {log.user}
                          </div>
                          <div className="text-sm text-gray-900">{log.userName}</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm font-medium text-gray-900">{log.action}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <CategoryIcon 
                            className="w-3.5 h-3.5" 
                            style={{ color: categoryColor }}
                          />
                          <span className="text-sm" style={{ color: categoryColor }}>
                            {log.category}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-gray-700 max-w-xs truncate">{log.details}</div>
                      </td>
                      <td>
                        <div className="text-xs text-gray-500 font-mono">{log.ipAddress}</div>
                      </td>
                      <td>
                        <Badge 
                          variant={
                            log.status === 'Success' 
                              ? 'success' 
                              : log.status === 'Failed' 
                              ? 'danger' 
                              : 'warning'
                          }
                        >
                          {log.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm font-medium">No audit logs found</div>
                      <div className="text-xs">Try adjusting your filters</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </Card>
    </div>
  )
}
