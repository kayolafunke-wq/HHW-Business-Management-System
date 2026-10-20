import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { 
  FileText, 
  Download, 
  Printer,
  TrendingUp,
  Package,
  Users,
  BarChart3,
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingDown,
  Box,
  Clock
} from 'lucide-react'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/services/api'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type ReportType = 
  | 'sales' 
  | 'sales-performance'
  | 'inventory' 
  | 'stock-movement' 
  | 'fast-moving' 
  | 'slow-moving' 
  | 'employee-attendance' 
  | 'employee-performance' 
  | 'invoice' 
  | 'business-performance'

function money(n: number): string {
  return (
    'MK ' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('sales')
  const [loading, setLoading] = useState(false)
  const [sales, setSales] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [movements, setMovements] = useState<any[]>([])

  // Helper component for gradient stat cards
  const StatCard = ({ label, value, icon: Icon, gradient }: { 
    label: string
    value: string | number
    icon: any
    gradient: string
  }) => (
    <div 
      className="relative p-5 rounded-xl text-white overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      style={{ background: gradient }}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-white/90">{label}</div>
          <Icon className="w-5 h-5 text-white/80" />
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
    </div>
  )

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { 'Authorization': `Bearer ${token}` }

      const [salesRes, productsRes, employeesRes, movementsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/sales`, { headers }),
        fetch(`${API_BASE_URL}/products`, { headers }),
        fetch(`${API_BASE_URL}/employees`, { headers }),
        fetch(`${API_BASE_URL}/inventory/movements`, { headers })
      ])

      const [salesData, productsData, employeesData, movementsData] = await Promise.all([
        salesRes.json(),
        productsRes.json(),
        employeesRes.json(),
        movementsRes.json()
      ])

      setSales(salesData.success ? salesData.data : [])
      setProducts(productsData.success ? productsData.data : [])
      setEmployees(employeesData.success ? employeesData.data : [])
      setMovements(movementsData.success ? movementsData.data : [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    toast.success('Exporting report to PDF...')
  }

  // Calculate sales chart data
  const getSalesChartData = () => {
    if (sales.length === 0) return []
    
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))
      const dateStr = date.toISOString().split('T')[0]
      
      const daySales = sales.filter((s: any) => s.saleDate?.startsWith(dateStr))
      const dayTotal = daySales.reduce((sum: number, s: any) => sum + (s.total || 0), 0)
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: dayTotal
      }
    })
    
    return last14Days
  }

  // Calculate inventory by category
  const getInventoryByCategory = () => {
    if (products.length === 0) return []
    
    const categories: Record<string, number> = {}
    products.forEach((p: any) => {
      const cat = p.category || 'Other'
      const value = (p.cost || 0) * (p.stock || 0)
      categories[cat] = (categories[cat] || 0) + value
    })
    
    const colors = ['#2f5df5', '#0ea885', '#c97a1a', '#6a4fd6', '#c2372c', '#9333ea', '#f59e0b']
    return Object.entries(categories)
      .map(([name, value], i) => ({
        name,
        value,
        color: colors[i % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
  }

  // Calculate stock movements
  const getStockMovementData = () => {
    if (movements.length === 0) return []
    
    const last12Days = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (11 - i))
      const dateStr = date.toISOString().split('T')[0]
      
      const dayMovements = movements.filter((m: any) => m.movementDate?.startsWith(dateStr))
      const stockIn = dayMovements
        .filter((m: any) => m.type === 'IN' || m.type === 'Stock In')
        .reduce((sum: number, m: any) => sum + (m.quantity || 0), 0)
      const stockOut = dayMovements
        .filter((m: any) => m.type === 'OUT' || m.type === 'Stock Out')
        .reduce((sum: number, m: any) => sum + (m.quantity || 0), 0)
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        stockIn,
        stockOut
      }
    })
    
    return last12Days
  }

  // Calculate sales performance by employee
  const getSalesPerformance = () => {
    if (sales.length === 0) return []
    
    const empStats: Record<string, { sales: number; revenue: number; name: string }> = {}
    
    sales.forEach((sale: any) => {
      const empName = sale.user?.name || sale.cashier || 'Unknown'
      if (!empStats[empName]) {
        empStats[empName] = { sales: 0, revenue: 0, name: empName }
      }
      empStats[empName].sales += 1
      empStats[empName].revenue += (sale.total || 0)
    })
    
    return Object.values(empStats)
      .map(emp => ({
        name: emp.name,
        sales: emp.sales,
        revenue: emp.revenue,
        avg: emp.sales > 0 ? Math.round(emp.revenue / emp.sales) : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }

  // Calculate fast moving products
  const getFastMovingProducts = () => {
    if (products.length === 0) return []
    
    const productSales: Record<string, { id: string; name: string; unitsSold: number; revenue: number }> = {}
    
    // Initialize all products
    products.forEach((product: any) => {
      productSales[product.id] = {
        id: product.id,
        name: product.name,
        unitsSold: 0,
        revenue: 0
      }
    })
    
    // Count sales
    sales.forEach((sale: any) => {
      sale.items?.forEach((item: any) => {
        if (productSales[item.productId]) {
          productSales[item.productId].unitsSold += item.quantity
          productSales[item.productId].revenue += item.total
        }
      })
    })
    
    // Get all products sorted by units sold (descending)
    const sortedProducts = Object.values(productSales)
      .sort((a, b) => b.unitsSold - a.unitsSold)
    
    // Fast movers: Top half OR products with sales > 0, whichever is smaller
    const splitPoint = Math.ceil(sortedProducts.length / 2)
    return sortedProducts
      .filter(p => p.unitsSold > 0)
      .slice(0, Math.min(10, splitPoint))
  }

  // Calculate slow moving products
  const getSlowMovingProducts = () => {
    if (products.length === 0) return []
    
    const productSales: Record<string, { id: string; name: string; unitsSold: number; stock: number; stockValue: number }> = {}
    
    // Initialize all products
    products.forEach((product: any) => {
      productSales[product.id] = {
        id: product.id,
        name: product.name,
        unitsSold: 0,
        stock: product.stock || 0,
        stockValue: (product.stock || 0) * (product.cost || 0)
      }
    })
    
    // Count sales
    sales.forEach((sale: any) => {
      sale.items?.forEach((item: any) => {
        if (productSales[item.productId]) {
          productSales[item.productId].unitsSold += item.quantity
        }
      })
    })
    
    // Get fast movers IDs to exclude them
    const fastMovers = getFastMovingProducts()
    const fastMoverIds = new Set(fastMovers.map(p => p.id))
    
    // Slow movers: All products NOT in fast movers, sorted by least sold
    return Object.values(productSales)
      .filter(p => !fastMoverIds.has(p.id))
      .sort((a, b) => a.unitsSold - b.unitsSold)
      .slice(0, 10)
  }

  // Calculate payment status distribution
  const getPaymentStatusData = () => {
    if (sales.length === 0) return []
    
    const statusCount: Record<string, number> = {}
    sales.forEach((sale: any) => {
      const status = sale.paymentStatus || 'UNKNOWN'
      statusCount[status] = (statusCount[status] || 0) + 1
    })
    
    const colors: Record<string, string> = {
      'PAID': '#0ea885',
      'PENDING': '#f59e0b',
      'PARTIALLY_PAID': '#2f5df5',
      'UNKNOWN': '#6b7280'
    }
    
    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#6b7280'
    }))
  }

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-sm text-gray-500">Loading report data...</div>
        </div>
      )
    }

    const salesChartData = getSalesChartData()
    const inventoryData = getInventoryByCategory()
    const stockMovementData = getStockMovementData()
    const salesPerformanceData = getSalesPerformance()

    switch (activeReport) {
      case 'sales':
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard 
                label="Total Revenue"
                value={money(sales.reduce((sum, s) => sum + s.total, 0))}
                icon={DollarSign}
                gradient="linear-gradient(135deg, #0ea885 0%, #0c8a6b 100%)"
              />
              <StatCard 
                label="Total Sales"
                value={sales.length}
                icon={ShoppingCart}
                gradient="linear-gradient(135deg, #2f5df5 0%, #1e40af 100%)"
              />
              <StatCard 
                label="Avg. Sale Value"
                value={sales.length > 0 ? money(Math.round(sales.reduce((sum, s) => sum + s.total, 0) / sales.length)) : 'MK 0'}
                icon={TrendingUp}
                gradient="linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)"
              />
            </div>

            {/* Sales Trend Chart */}
            <ResponsiveContainer width="100%" height={220}>
              {salesChartData.length > 0 ? (
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2f5df5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2f5df5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: '#9aa3b2' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#9aa3b2' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e6e9ef',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => money(value)}
                  />
                  <Area 
                    type="linear" 
                    dataKey="sales" 
                    stroke="#2f5df5" 
                    strokeWidth={2}
                    fill="url(#colorSales)"
                    dot={{ fill: '#2f5df5', r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No sales data available
                </div>
              )}
            </ResponsiveContainer>

            {/* Sales Table */}
            {sales.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 10).map((sale: any) => (
                    <tr key={sale.id}>
                      <td><div className="text-sm font-medium text-[#2f5df5]">{sale.invoiceNo}</div></td>
                      <td><div className="text-sm text-gray-900">{sale.customer || 'Walk-in'}</div></td>
                      <td><div className="text-sm text-gray-700">{new Date(sale.saleDate).toLocaleDateString()}</div></td>
                      <td style={{ textAlign: 'right' }}><div className="text-sm font-semibold text-gray-900">{money(sale.total)}</div></td>
                      <td><span className={`badge ${sale.paymentStatus === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>{sale.paymentStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>No sales transactions found</p>
                <p className="text-xs mt-1">Make some sales to generate reports</p>
              </div>
            )}
          </div>
        )

      case 'inventory':
        return (
          <div className="space-y-6">
            {/* Inventory Value by Category Pie Chart */}
            <ResponsiveContainer width="100%" height={350}>
              {inventoryData.length > 0 ? (
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={(entry) => `${entry.name}`}
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => money(value)} />
                  <Legend />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No inventory data available
                </div>
              )}
            </ResponsiveContainer>

            {/* Inventory Summary Table */}
            {products.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Stock</th>
                    <th style={{ textAlign: 'right' }}>Cost</th>
                    <th style={{ textAlign: 'right' }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id}>
                      <td><div className="text-sm font-medium text-gray-900">{product.name}</div></td>
                      <td><span className="badge badge-gray">{product.category}</span></td>
                      <td style={{ textAlign: 'right' }}><div className="text-sm text-gray-900">{product.stock || 0}</div></td>
                      <td style={{ textAlign: 'right' }}><div className="text-sm text-gray-700">{money(product.cost || 0)}</div></td>
                      <td style={{ textAlign: 'right' }}><div className="text-sm font-semibold text-gray-900">{money((product.stock || 0) * (product.cost || 0))}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No inventory data available
              </div>
            )}
          </div>
        )

      case 'stock-movement':
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard 
                label="Total Stock In"
                value={movements.filter((m: any) => m.type === 'IN' || m.type === 'Stock In').reduce((sum: number, m: any) => sum + (m.quantity || 0), 0)}
                icon={TrendingUp}
                gradient="linear-gradient(135deg, #0ea885 0%, #0c8a6b 100%)"
              />
              <StatCard 
                label="Total Stock Out"
                value={movements.filter((m: any) => m.type === 'OUT' || m.type === 'Stock Out').reduce((sum: number, m: any) => sum + (m.quantity || 0), 0)}
                icon={TrendingDown}
                gradient="linear-gradient(135deg, #c2372c 0%, #991b1b 100%)"
              />
              <StatCard 
                label="Total Movements"
                value={movements.length}
                icon={Box}
                gradient="linear-gradient(135deg, #2f5df5 0%, #1e40af 100%)"
              />
            </div>

            {/* Stock Movement Chart */}
            <ResponsiveContainer width="100%" height={280}>
              {stockMovementData.length > 0 ? (
                <BarChart data={stockMovementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stockIn" fill="#0ea885" name="Stock In" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="stockOut" fill="#c2372c" name="Stock Out" radius={[8, 8, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No stock movement data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        )

      case 'employee-performance':
        return (
          <div className="space-y-6">
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={280}>
              {salesPerformanceData.length > 0 ? (
                <BarChart data={salesPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => money(val)} />
                  <Tooltip formatter={(value: number) => money(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#2f5df5" name="Revenue" radius={[8, 8, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No employee performance data available
                </div>
              )}
            </ResponsiveContainer>

            {/* Performance Table */}
            {salesPerformanceData.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th style={{ textAlign: 'right' }}>Sales</th>
                    <th style={{ textAlign: 'right' }}>Revenue</th>
                    <th style={{ textAlign: 'right' }}>Avg. Sale</th>
                  </tr>
                </thead>
                <tbody>
                  {salesPerformanceData.map((emp: any, i: number) => (
                    <tr key={i}>
                      <td>{emp.name}</td>
                      <td style={{ textAlign: 'right' }}>{emp.sales}</td>
                      <td style={{ textAlign: 'right' }}>{money(emp.revenue)}</td>
                      <td style={{ textAlign: 'right' }}>{money(emp.avg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No employee performance data available
              </div>
            )}
          </div>
        )

      case 'fast-moving':
        return (
          <div className="space-y-6">
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={280}>
              {getFastMovingProducts().length > 0 ? (
                <BarChart data={getFastMovingProducts()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="unitsSold" fill="#0ea885" name="Units Sold" radius={[8, 8, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No fast moving products data available
                </div>
              )}
            </ResponsiveContainer>

            {/* Products Table */}
            {getFastMovingProducts().length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ textAlign: 'right' }}>Units Sold</th>
                    <th style={{ textAlign: 'right' }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {getFastMovingProducts().map((product: any, i: number) => (
                    <tr key={i}>
                      <td>{product.name}</td>
                      <td style={{ textAlign: 'right' }}>{product.unitsSold}</td>
                      <td style={{ textAlign: 'right' }}>{money(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No fast moving products data available
              </div>
            )}
          </div>
        )

      case 'slow-moving':
        return (
          <div className="space-y-6">
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={280}>
              {getSlowMovingProducts().length > 0 ? (
                <BarChart data={getSlowMovingProducts()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" fill="#c97a1a" name="Current Stock" radius={[8, 8, 0, 0]} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No slow moving products data available
                </div>
              )}
            </ResponsiveContainer>

            {/* Products Table */}
            {getSlowMovingProducts().length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th style={{ textAlign: 'right' }}>Units Sold</th>
                    <th style={{ textAlign: 'right' }}>Stock</th>
                    <th style={{ textAlign: 'right' }}>Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {getSlowMovingProducts().map((product: any, i: number) => (
                    <tr key={i}>
                      <td>{product.name}</td>
                      <td style={{ textAlign: 'right' }}>{product.unitsSold}</td>
                      <td style={{ textAlign: 'right' }}>{product.stock}</td>
                      <td style={{ textAlign: 'right' }}>{money(product.stockValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No slow moving products data available
              </div>
            )}
          </div>
        )

      case 'employee-attendance':
        return <EmployeeAttendanceReport employees={employees} />

      case 'invoice':
        return (
          <div className="space-y-6">
            {/* Payment Status Pie Chart */}
            <ResponsiveContainer width="100%" height={350}>
              {getPaymentStatusData().length > 0 ? (
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={getPaymentStatusData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {getPaymentStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No invoice data available
                </div>
              )}
            </ResponsiveContainer>

            {/* Invoice Table */}
            {sales.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 20).map((sale: any) => (
                    <tr key={sale.id}>
                      <td><div className="text-sm font-medium text-[#2f5df5]">{sale.invoiceNo}</div></td>
                      <td><div className="text-sm text-gray-900">{sale.customer || 'Walk-in'}</div></td>
                      <td><div className="text-sm text-gray-700">{new Date(sale.saleDate).toLocaleDateString()}</div></td>
                      <td style={{ textAlign: 'right' }}><div className="text-sm font-semibold text-gray-900">{money(sale.total)}</div></td>
                      <td><span className={`badge ${sale.paymentStatus === 'PAID' ? 'badge-green' : 'badge-yellow'}`}>{sale.paymentStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No invoices found
              </div>
            )}
          </div>
        )

      case 'business-performance':
        return (
          <div className="space-y-6">
            <div className="grid grid-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-900">{money(sales.reduce((sum, s) => sum + s.total, 0))}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Total Sales</div>
                <div className="text-2xl font-bold text-gray-900">{sales.length}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Products</div>
                <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              {salesChartData.length > 0 ? (
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="colorBusiness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2f5df5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2f5df5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => money(value)} />
                  <Area 
                    type="linear" 
                    dataKey="sales" 
                    stroke="#2f5df5" 
                    strokeWidth={2}
                    fill="url(#colorBusiness)"
                  />
                </AreaChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No business data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        )

      case 'sales-performance':
        return (
          <div>
            {salesPerformanceData.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th style={{ textAlign: 'right' }}>Sales</th>
                    <th style={{ textAlign: 'right' }}>Revenue</th>
                    <th style={{ textAlign: 'right' }}>Avg. Sale</th>
                  </tr>
                </thead>
                <tbody>
                  {salesPerformanceData.map((emp: any, i: number) => (
                    <tr key={i}>
                      <td>{emp.name}</td>
                      <td style={{ textAlign: 'right' }}>{emp.sales}</td>
                      <td style={{ textAlign: 'right' }}>{money(emp.revenue)}</td>
                      <td style={{ textAlign: 'right' }}>{money(emp.avg)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No sales performance data available
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-gray-400">
            <p>Report type not yet implemented</p>
            <p className="text-xs mt-1">Select a different report type</p>
          </div>
        )
    }
  }

  const reportOptions = [
    { id: 'sales', label: 'Sales Report', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory Report', icon: Package },
    { id: 'stock-movement', label: 'Stock Movement Report', icon: BarChart3 },
    { id: 'fast-moving', label: 'Fast Moving Products', icon: TrendingUp },
    { id: 'slow-moving', label: 'Slow Moving Products', icon: Package },
    { id: 'employee-attendance', label: 'Employee Attendance Report', icon: Calendar },
    { id: 'employee-performance', label: 'Employee Performance', icon: Users },
    { id: 'invoice', label: 'Invoice Report', icon: FileText },
    { id: 'business-performance', label: 'Business Performance Report', icon: BarChart3 },
  ]

  return (
    <div className="fade-in">
      {/* Header with gradient background */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Business Reports
            </h1>
            <p className="text-blue-100 text-sm">
              Comprehensive analytics and insights for your business operations
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm border border-white/30 transition-all flex items-center gap-2 font-medium"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm border border-white/30 transition-all flex items-center gap-2 font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Report type selector with gradient cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {reportOptions.map((option) => {
          const Icon = option.icon
          const isActive = activeReport === option.id
          return (
            <button
              key={option.id}
              onClick={() => setActiveReport(option.id as ReportType)}
              className={`group relative p-4 rounded-xl transition-all text-left overflow-hidden ${
                isActive
                  ? 'shadow-lg scale-105'
                  : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg, #2f5df5 0%, #5b8af7 100%)',
                    }
                  : {}
              }
            >
              <div className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-blue-600 group-hover:text-blue-700'}`} />
                <div className={`text-xs font-semibold leading-tight ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {option.label}
                </div>
              </div>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Report content with shadow card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                {(() => {
                  const Icon = reportOptions.find(r => r.id === activeReport)?.icon || FileText
                  return <Icon className="w-5 h-5 text-blue-600" />
                })()}
                {reportOptions.find(r => r.id === activeReport)?.label} Report
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Generated on {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          {renderReportContent()}
        </div>
      </div>
    </div>
  )
}


// Employee Attendance Report Component
function EmployeeAttendanceReport({ employees }: { employees: any[] }) {
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAttendanceData()
  }, [employees])

  const fetchAttendanceData = async () => {
    setLoading(true)
    try {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth() + 1

      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/attendance/monthly/${year}/${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()

      if (data.success) {
        const stats = employees.map(emp => {
          const empAttendance = data.data.filter((a: any) => a.employeeId === emp.id)
          
          const present = empAttendance.filter((a: any) => a.status === 'PRESENT').length
          const late = empAttendance.filter((a: any) => a.status === 'LATE').length
          const absent = empAttendance.filter((a: any) => a.status === 'ABSENT').length
          const leave = empAttendance.filter((a: any) => a.status === 'LEAVE').length
          
          const workingDays = empAttendance.length
          const attendancePercent = workingDays > 0 ? Math.round((present / workingDays) * 100) : 0

          return {
            name: emp.name,
            workingDays,
            present,
            late,
            absent,
            leave,
            attendancePercent
          }
        })

        setAttendanceData(stats)
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const avgAttendance = attendanceData.length > 0
    ? Math.round(attendanceData.reduce((sum, emp) => sum + emp.attendancePercent, 0) / attendanceData.length)
    : 0

  const totalWorkingDays = attendanceData.length > 0
    ? attendanceData[0].workingDays
    : 0

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading attendance data...</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div 
          className="relative p-5 rounded-xl text-white overflow-hidden shadow-md"
          style={{ background: 'linear-gradient(135deg, #2f5df5 0%, #1e40af 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-white/90">Total Employees</div>
              <Users className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-2xl font-bold">{employees.length}</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        </div>
        
        <div 
          className="relative p-5 rounded-xl text-white overflow-hidden shadow-md"
          style={{ background: 'linear-gradient(135deg, #c97a1a 0%, #b5690f 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-white/90">Working Days (This Month)</div>
              <Calendar className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-2xl font-bold">{totalWorkingDays}</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        </div>
        
        <div 
          className="relative p-5 rounded-xl text-white overflow-hidden shadow-md"
          style={{ background: 'linear-gradient(135deg, #0ea885 0%, #0c8a6b 100%)' }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-white/90">Avg Attendance</div>
              <TrendingUp className="w-5 h-5 text-white/80" />
            </div>
            <div className="text-2xl font-bold">{avgAttendance}%</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        </div>
      </div>

      {/* Chart */}
      {attendanceData.some(emp => emp.workingDays > 0) ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={attendanceData.filter(emp => emp.workingDays > 0)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" stackId="a" fill="#0ea885" name="Present" />
            <Bar dataKey="late" stackId="a" fill="#c97a1a" name="Late" />
            <Bar dataKey="absent" stackId="a" fill="#c2372c" name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="font-semibold text-gray-900 mb-2">No Attendance Records</p>
          <p className="text-sm">Mark attendance in the Attendance page to see charts and reports here</p>
        </div>
      )}

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th style={{ textAlign: 'right' }}>Working Days</th>
            <th style={{ textAlign: 'right' }}>Present</th>
            <th style={{ textAlign: 'right' }}>Late</th>
            <th style={{ textAlign: 'right' }}>Absent</th>
            <th style={{ textAlign: 'right' }}>Attendance %</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((emp, idx) => (
            <tr key={idx}>
              <td><div className="text-sm font-medium text-gray-900">{emp.name}</div></td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-gray-700">{emp.workingDays}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-[#0ea885] font-medium">{emp.present}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-[#c97a1a]">{emp.late}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div className="text-sm text-[#c2372c]">{emp.absent}</div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div 
                  className="text-sm font-semibold"
                  style={{ 
                    color: emp.attendancePercent >= 90 ? '#0ea885' : 
                           emp.attendancePercent >= 70 ? '#c97a1a' : 
                           emp.attendancePercent > 0 ? '#c2372c' : '#9ca3af'
                  }}
                >
                  {emp.attendancePercent}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
