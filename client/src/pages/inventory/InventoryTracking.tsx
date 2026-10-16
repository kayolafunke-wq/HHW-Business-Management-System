import { useState, useEffect } from 'react'
import { Package, TrendingUp, TrendingDown, Search } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { Pagination, usePagination } from '@/components/ui/Pagination'
import { inventoryApi, type StockMovement } from '@/services/api'
import toast from 'react-hot-toast'

interface InventoryMovement {
  id: string
  date: string
  time: string
  type: 'Stock In' | 'Stock Out'
  productName: string
  productSKU: string
  quantity: number
  beforeAmount: number
  afterAmount: number
  reason: string
  reference: string
  user: string
  userName: string
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}

export default function InventoryTracking() {
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'All' | 'Stock In' | 'Stock Out'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch movements from API
  useEffect(() => {
    fetchMovements()
  }, [])

  const fetchMovements = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await inventoryApi.getAllMovements()
      
      // Transform API data to match component format
      const transformedMovements: InventoryMovement[] = data.map((movement: StockMovement) => {
        const movementDate = new Date(movement.movementDate)
        return {
          id: movement.id,
          date: movementDate.toISOString().split('T')[0],
          time: movementDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          type: movement.type === 'IN' ? 'Stock In' : 'Stock Out',
          productName: movement.product?.name || 'Unknown Product',
          productSKU: movement.product?.sku || 'N/A',
          quantity: movement.quantity,
          beforeAmount: 0, // API doesn't track before amount
          afterAmount: 0, // API doesn't track after amount
          reason: movement.reason || 'N/A',
          reference: movement.reference || 'N/A',
          user: movement.product?.name?.substring(0, 2).toUpperCase() || 'UN',
          userName: 'System User', // API doesn't track user
        }
      })
      
      setMovements(transformedMovements)
    } catch (error: any) {
      console.error('Failed to fetch movements:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load inventory movements'
      setError(errorMessage)
      toast.error(errorMessage)
      setMovements([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Filter movements
  const filteredMovements = movements.filter(movement => {
    const matchesType = filterType === 'All' || movement.type === filterType
    const matchesSearch = 
      movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.productSKU.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.reference.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(filteredMovements, 15)

  // Calculate stats
  const totalStockIn = movements.filter(m => m.type === 'Stock In').reduce((sum, m) => sum + m.quantity, 0)
  const totalStockOut = movements.filter(m => m.type === 'Stock Out').reduce((sum, m) => sum + m.quantity, 0)
  const totalMovements = movements.length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f5df5] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading inventory movements...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fade-in">
        <div className="page-head">
          <div>
            <h1 className="page-title">Inventory Tracking</h1>
            <p className="page-sub">Complete history of all stock movements</p>
          </div>
        </div>
        <Card className="p-8">
          <div className="text-center text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <div className="text-lg font-medium mb-2">Error loading movements</div>
            <div className="text-sm mb-4">{error}</div>
            <button
              onClick={fetchMovements}
              className="px-4 py-2 bg-[#2f5df5] text-white rounded-md hover:bg-[#2651d4] transition-colors"
            >
              Try Again
            </button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Inventory Tracking</h1>
          <p className="page-sub">Complete history of all stock movements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Total Movements */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#e8eefd', color: '#2f5df5' }}
            >
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-label">Total Movements</div>
          <div className="kpi-value">{totalMovements}</div>
        </Card>

        {/* Stock In */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#e3f8f2', color: '#0ea885' }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-label">Total Stock In</div>
          <div className="kpi-value">{totalStockIn.toLocaleString()}</div>
        </Card>

        {/* Stock Out */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#fbe9e7', color: '#c2372c' }}
            >
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-label">Total Stock Out</div>
          <div className="kpi-value">{totalStockOut.toLocaleString()}</div>
        </Card>
      </div>

      <Card>
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-gray-200 px-4 pt-4">
          <button
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              filterType === 'All'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setFilterType('All')}
          >
            All Movements
          </button>
          <button
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              filterType === 'Stock In'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setFilterType('Stock In')}
          >
            Stock In
          </button>
          <button
            className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
              filterType === 'Stock Out'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setFilterType('Stock Out')}
          >
            Stock Out
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 pb-0">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by product, SKU, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Movements Table */}
        <div className="overflow-x-auto p-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Before</th>
                <th>After</th>
                <th>Reason</th>
                <th>Reference</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((movement) => (
                  <tr key={movement.id}>
                    <td>
                      <div className="text-sm text-gray-900">{movement.date}</div>
                      <div className="text-xs text-gray-500">{movement.time}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {movement.type === 'Stock In' ? (
                          <>
                            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#e3f8f2' }}>
                              <TrendingUp className="w-4 h-4 text-[#0ea885]" />
                            </div>
                            <Badge variant="green">{movement.type}</Badge>
                          </>
                        ) : (
                          <>
                            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#fbf0dd' }}>
                              <TrendingDown className="w-4 h-4 text-[#c97a1a]" />
                            </div>
                            <Badge variant="amber">{movement.type}</Badge>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-medium text-gray-900">{movement.productName}</div>
                      <div className="text-xs text-gray-500">{movement.productSKU}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {movement.type === 'Stock In' ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-[#0ea885]" />
                            <span className="text-sm font-bold text-[#0ea885]">
                              +{movement.quantity}
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-[#c97a1a]" />
                            <span className="text-sm font-bold text-[#c97a1a]">
                              -{movement.quantity}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-700">{movement.beforeAmount}</div>
                    </td>
                    <td>
                      <div className="text-sm font-medium text-gray-900">{movement.afterAmount}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-700">{movement.reason}</div>
                    </td>
                    <td>
                      <div className="text-sm text-[#2f5df5] font-medium">{movement.reference}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                          style={{ background: '#2f5df5' }}
                        >
                          {movement.user}
                        </div>
                        <div className="text-xs text-gray-700">{movement.userName}</div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm font-medium">No movements found</div>
                      <div className="text-xs">Try adjusting your search or filter</div>
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
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </Card>
    </div>
  )
}
