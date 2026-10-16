import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import { Pagination, usePagination } from '@/components/ui/Pagination'
import { inventoryApi, StockMovement } from '@/services/api'
import { Search, TrendingUp, TrendingDown, Package } from 'lucide-react'
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
  const [filterType, setFilterType] = useState<'All' | 'Stock In' | 'Stock Out'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch movements from API
  useEffect(() => {
    fetchMovements()
  }, [])

  const fetchMovements = async () => {
    try {
      setLoading(true)
      const data = await inventoryApi.getAllMovements()
      
      // Transform API data to match component format
      const transformedMovements: InventoryMovement[] = data.map((movement: StockMovement) => {
        const movementDate = new Date(movement.movementDate)
        return {
    afterAmount: 12,
    reason: 'Sale',
    reference: 'SALE-1234',
    user: 'JB',
    userName: 'John Banda',
  },
  {
    id: '2',
    date: '2026-10-10',
    time: '08:30',
    type: 'Stock In',
    productName: 'Cooking Oil 5L',
    productSKU: 'SKU-GRO-106',
    quantity: 50,
    beforeAmount: 18,
    afterAmount: 68,
    reason: 'Purchase from Supplier',
    reference: 'PO-5678',
    user: 'SM',
    userName: 'Steven Mbewe',
  },
  {
    id: '3',
    date: '2026-10-09',
    time: '16:20',
    type: 'Stock Out',
    productName: 'Wireless Mouse Logitech',
    productSKU: 'SKU-ELE-103',
    quantity: 3,
    beforeAmount: 42,
    afterAmount: 39,
    reason: 'Sale',
    reference: 'SALE-1233',
    user: 'GP',
    userName: 'Grace Phiri',
  },
  {
    id: '4',
    date: '2026-10-09',
    time: '14:10',
    type: 'Stock Out',
    productName: 'Bluetooth Speaker JBL Go',
    productSKU: 'SKU-ELE-102',
    quantity: 1,
    beforeAmount: 3,
    afterAmount: 2,
    reason: 'Damaged/Defective',
    reference: 'DMG-001',
    user: 'SM',
    userName: 'Steven Mbewe',
  },
  {
    id: '5',
    date: '2026-10-09',
    time: '11:00',
    type: 'Stock In',
    productName: 'A4 Paper Ream (80gsm)',
    productSKU: 'SKU-STA-114',
    quantity: 30,
    beforeAmount: 55,
    afterAmount: 85,
    reason: 'Routine Restock',
    reference: 'PO-5677',
    user: 'SM',
    userName: 'Steven Mbewe',
  },
  {
    id: '6',
    date: '2026-10-08',
    time: '15:45',
    type: 'Stock Out',
    productName: 'Coca-Cola 500ml (Crate of 24)',
    productSKU: 'SKU-BEV-111',
    quantity: 4,
    beforeAmount: 26,
    afterAmount: 22,
    reason: 'Sale',
    reference: 'SALE-1232',
    user: 'JB',
    userName: 'John Banda',
  },
  {
    id: '7',
    date: '2026-10-08',
    time: '10:15',
    type: 'Stock In',
    productName: 'Rice 25kg Bag',
    productSKU: 'SKU-GRO-106',
    quantity: 20,
    beforeAmount: 32,
    afterAmount: 52,
    reason: 'Purchase from Supplier',
    reference: 'PO-5676',
    user: 'SM',
    userName: 'Steven Mbewe',
  },
  {
    id: '8',
    date: '2026-10-07',
    time: '13:30',
    type: 'Stock Out',
    productName: 'Laundry Detergent 2kg',
    productSKU: 'SKU-HOU-118',
    quantity: 5,
    beforeAmount: 37,
    afterAmount: 32,
    reason: 'Sale',
    reference: 'SALE-1231',
    user: 'GP',
    userName: 'Grace Phiri',
  },
  {
    id: '9',
    date: '2026-10-07',
    time: '09:00',
    type: 'Stock In',
    productName: 'LED Bulb 9W (Pack of 4)',
    productSKU: 'SKU-ELE-105',
    quantity: 40,
    beforeAmount: 120,
    afterAmount: 160,
    reason: 'Routine Restock',
    reference: 'PO-5675',
    user: 'SM',
    userName: 'Steven Mbewe',
  },
  {
    id: '10',
    date: '2026-10-06',
    time: '16:50',
    type: 'Stock Out',
    productName: 'Sugar 2kg',
    productSKU: 'SKU-GRO-108',
    quantity: 8,
    beforeAmount: 64,
    afterAmount: 56,
    reason: 'Sale',
    reference: 'SALE-1230',
    user: 'JB',
    userName: 'John Banda',
  },
  {
    id: '11',
    date: '2026-10-06',
    time: '11:20',
    type: 'Stock Out',
    productName: 'Office Stapler Heavy Duty',
    productSKU: 'SKU-STA-117',
    quantity: 2,
    beforeAmount: 11,
    afterAmount: 9,
    reason: 'Internal Use',
    reference: 'INT-045',
    user: 'AM',
    userName: 'Alinane Mvula',
  },
  {
    id: '12',
    date: '2026-10-05',
    time: '14:00',
    type: 'Stock In',
    productName: 'Fanta Orange 2L',
    productSKU: 'SKU-BEV-113',
    quantity: 30,
    beforeAmount: 48,
    afterAmount: 78,
    reason: 'Purchase from Supplier',
    reference: 'PO-5674',
    user: 'SM',
    userName: 'Steven Mbewe',
  },
]

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2)
}

export default function InventoryTracking() {
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'All' | 'Stock In' | 'Stock Out'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch movements from API
  useEffect(() => {
    fetchMovements()
  }, [])

  const fetchMovements = async () => {
    try {
      setLoading(true)
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
    } catch (error) {
      console.error('Failed to fetch movements:', error)
      toast.error('Failed to load inventory movements')
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
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </Card>
    </div>
  )
}
