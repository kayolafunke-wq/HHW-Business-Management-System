import { useState, useEffect } from 'react'
import { Package, TrendingUp, TrendingDown, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { API_BASE_URL } from '@/services/api'

function money(n: number): string {
  return (
    'MK ' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

const CATEGORY_COLORS: Record<string, string> = {
  'ELECTRONICS': '#2f5df5',
  'HARDWARE': '#6b7280',
  'BUILDING_MATERIALS': '#84cc16',
  'GROCERIES': '#0ea885',
  'BEVERAGES': '#f59e0b',
  'STATIONERY': '#6a4fd6',
  'CLOTHING': '#ec4899',
  'OTHER': '#9ca3af'
}

export default function InventoryPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<any[]>([])
  const [movements, setMovements] = useState<any[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { 'Authorization': `Bearer ${token}` }

      const [productsRes, movementsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`, { headers }),
        fetch(`${API_BASE_URL}/inventory/movements`, { headers })
      ])

      const productsData = await productsRes.json()
      const movementsData = await movementsRes.json()

      setProducts(productsData.success ? productsData.data : [])
      setMovements(movementsData.success ? movementsData.data : [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0)
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.minStock)
  const outOfStockProducts = products.filter(p => p.stock === 0)
  const inStockProducts = products.filter(p => p.stock > p.minStock)

  // Stock by category
  const stockByCategory = products.reduce<Record<string, { count: number; value: number; stock: number }>>((acc, p) => {
    const cat = p.category || 'OTHER'
    if (!acc[cat]) {
      acc[cat] = { count: 0, value: 0, stock: 0 }
    }
    acc[cat].count++
    acc[cat].value += p.stock * p.cost
    acc[cat].stock += p.stock
    return acc
  }, {})

  const categoryData = Object.entries(stockByCategory).map(([name, data]) => ({
    name: name.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '),
    value: data.value,
    stock: data.stock,
    count: data.count,
    color: CATEGORY_COLORS[name] || CATEGORY_COLORS['OTHER']
  })).sort((a, b) => b.value - a.value)

  // Recent movements (last 5)
  const recentMovements = movements
    .sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-sm text-gray-500">Loading inventory data...</div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      {/* Modern Header with gradient */}
      <div className="mb-5 sm:mb-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 flex items-center gap-2.5 sm:gap-3">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              Inventory Management
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm">
              Monitor stock levels, track movements, and manage your inventory value
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/inventory/stock-in')}
              className="flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm border border-white/30 transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium active:scale-95 whitespace-nowrap shadow-sm"
            >
              <ArrowDownRight className="w-4 h-4 flex-shrink-0" />
              Stock In
            </button>
            <button
              onClick={() => navigate('/inventory/stock-out')}
              className="flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm border border-white/30 transition-all flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium active:scale-95 whitespace-nowrap shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
              Stock Out
            </button>
          </div>
        </div>
      </div>

      {/* Modern KPI Cards with gradients */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
        {/* Total Inventory Value */}
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-50/0 group-hover:from-purple-50/50 group-hover:to-transparent transition-all pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#efeafb] flex items-center justify-center shadow-sm flex-shrink-0">
                <DollarSign className="text-[#6a4fd6] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-[11px] sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1 truncate">Total Inventory Value</div>
            <div className="text-base sm:text-2xl font-bold text-gray-900 truncate">{money(totalValue)}</div>
          </div>
        </div>

        {/* In Stock */}
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent transition-all pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#e8eefd] flex items-center justify-center shadow-sm flex-shrink-0">
                <Package className="text-[#2f5df5] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-green-50 text-green-700">
                <ArrowUpRight className="w-3 h-3" />
                {products.length > 0 ? Math.round((inStockProducts.length / products.length) * 100) : 0}%
              </div>
            </div>
            <div className="text-[11px] sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1 truncate">In Stock</div>
            <div className="text-base sm:text-2xl font-bold text-gray-900">{inStockProducts.length}</div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 to-orange-50/0 group-hover:from-orange-50/50 group-hover:to-transparent transition-all pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#fbf0dd] flex items-center justify-center shadow-sm flex-shrink-0">
                <AlertTriangle className="text-[#c97a1a] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              {lowStockProducts.length > 0 && (
                <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-orange-50 text-orange-700">
                  <ArrowDownRight className="w-3 h-3" />
                  Reorder
                </div>
              )}
            </div>
            <div className="text-[11px] sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1 truncate">Low Stock</div>
            <div className="text-base sm:text-2xl font-bold text-gray-900">{lowStockProducts.length}</div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-red-50/0 group-hover:from-red-50/50 group-hover:to-transparent transition-all pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg bg-[#fbe9e7] flex items-center justify-center shadow-sm flex-shrink-0">
                <Package className="text-[#c2372c] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
              {outOfStockProducts.length > 0 && (
                <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-semibold bg-red-50 text-red-700">
                  <ArrowDownRight className="w-3 h-3" />
                  Urgent
                </div>
              )}
            </div>
            <div className="text-[11px] sm:text-sm font-medium text-gray-600 mb-0.5 sm:mb-1 truncate">Out of Stock</div>
            <div className="text-base sm:text-2xl font-bold text-gray-900">{outOfStockProducts.length}</div>
          </div>
        </div>
      </div>

      {/* Modern Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-[18px] mb-5">
        {/* Stock by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="text-base font-semibold text-gray-900">Inventory Value by Category</div>
            <div className="text-xs text-gray-500 mt-0.5">Total stock value breakdown</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            {categoryData.length > 0 ? (
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No inventory data
              </div>
            )}
          </ResponsiveContainer>
          
          {categoryData.length > 0 && (
            <div className="grid grid-2 gap-2 mt-4">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color }}></div>
                    <span className="text-gray-700">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{money(cat.value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock Levels by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="text-base font-semibold text-gray-900">Stock Levels by Category</div>
            <div className="text-xs text-gray-500 mt-0.5">Total units in stock</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            {categoryData.length > 0 ? (
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9aa3b2" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} stroke="#9aa3b2" />
                <Tooltip 
                  contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e6e9ef' }}
                  formatter={(value: any) => [`${value} units`, 'Stock']}
                />
                <Bar dataKey="stock" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No stock data
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modern Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-[18px]">
        {/* Low Stock & Out of Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-transparent">
            <div className="text-base font-semibold text-gray-900">Stock Alerts</div>
            <div className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
              {lowStockProducts.length + outOfStockProducts.length} items
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).length > 0 ? (
              [...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {p.sku} · {p.category.split('_').map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="text-sm font-semibold text-gray-900">{p.stock} units</div>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <div 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ background: p.stock === 0 ? '#c2372c' : '#c97a1a' }}
                      ></div>
                      <span 
                        className="text-[10px] font-semibold"
                        style={{ color: p.stock === 0 ? '#c2372c' : '#c97a1a' }}
                      >
                        {p.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="w-12 h-12 text-green-400 mb-3" />
                <div className="text-sm font-semibold text-gray-700">All stock levels healthy</div>
                <div className="text-xs text-gray-500 mt-1">No low or out of stock items</div>
              </div>
            )}
          </div>
          
          {(lowStockProducts.length + outOfStockProducts.length) > 6 && (
            <div className="px-4 pb-4">
              <button
                onClick={() => navigate('/inventory/products')}
                className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View all alerts
              </button>
            </div>
          )}
        </div>

        {/* Recent Stock Movements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
            <div className="text-base font-semibold text-gray-900">Recent Stock Activity</div>
            <button 
              onClick={() => navigate('/inventory/tracking')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View all
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            {recentMovements.length > 0 ? (
              recentMovements.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    {m.type === 'IN' ? (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#e3f8f2' }}>
                        <TrendingUp className="w-4 h-4 text-[#0ea885]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fbf0dd' }}>
                        <TrendingDown className="w-4 h-4 text-[#c97a1a]" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{m.product?.name || 'Unknown Product'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {m.reference} · {new Date(m.movementDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`text-xs font-bold ${m.type === 'IN' ? 'text-[#0ea885]' : 'text-[#c97a1a]'}`}>
                      {m.type === 'IN' ? '+' : '-'}{m.quantity} units
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mb-3" />
                <div className="text-sm font-semibold text-gray-700">No recent activity</div>
                <div className="text-xs text-gray-500 mt-1">Stock movements will appear here</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
