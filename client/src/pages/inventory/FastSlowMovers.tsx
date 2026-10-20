import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import toast from 'react-hot-toast'

function money(n: number): string {
  return (
    'MK ' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

interface ProductPerformance {
  name: string
  units: number
  revenue: number
  stock: number
  trend: 'up' | 'down'
}

interface CategoryData {
  name: string
  value: number
  color: string
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

export default function FastSlowMovers() {
  const [activeTab, setActiveTab] = useState<'fast' | 'slow'>('fast')
  const [loading, setLoading] = useState(true)
  const [fastSellingData, setFastSellingData] = useState<ProductPerformance[]>([])
  const [slowSellingData, setSlowSellingData] = useState<ProductPerformance[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { 'Authorization': `Bearer ${token}` }

      // Fetch sales and products
      const [salesRes, productsRes] = await Promise.all([
        fetch('http://localhost:5000/api/sales', { headers }),
        fetch('http://localhost:5000/api/products', { headers })
      ])

      const salesData = await salesRes.json()
      const productsData = await productsRes.json()

      const sales = salesData.success ? salesData.data : []
      const products = productsData.success ? productsData.data : []

      // Calculate product performance
      const productStats: Record<string, {
        name: string
        units: number
        revenue: number
        category: string
        stock: number
      }> = {}

      // First, initialize all products with 0 sales
      products.forEach((product: any) => {
        productStats[product.id] = {
          name: product.name,
          units: 0,
          revenue: 0,
          category: product.category || 'OTHER',
          stock: product.stock || 0
        }
      })

      // Then update with actual sales data
      sales.forEach((sale: any) => {
        sale.items?.forEach((item: any) => {
          const prodId = item.productId || item.product?.id
          
          if (productStats[prodId]) {
            productStats[prodId].units += (item.quantity || 0)
            productStats[prodId].revenue += (item.price || 0) * (item.quantity || 0)
          }
        })
      })

      const productList = Object.values(productStats)

      // Sort by units sold (descending) - includes products with 0 sales
      const sortedProducts = productList.sort((a, b) => b.units - a.units)
      
      // Separate into products with sales and without sales
      const productsWithSales = sortedProducts.filter(p => p.units > 0)
      const productsWithoutSales = sortedProducts.filter(p => p.units === 0)

      let fastSellers: ProductPerformance[] = []
      let slowSellers: ProductPerformance[] = []

      if (productsWithSales.length >= 12) {
        // If we have 12+ products with sales, show top 6 as fast and bottom 6 as slow
        fastSellers = productsWithSales.slice(0, 6).map(p => ({
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          units: p.units,
          revenue: p.revenue,
          stock: p.stock,
          trend: 'up' as const
        }))

        // Slow movers: bottom 6 products with sales + any unsold products (up to 6 total)
        const bottomSellers = productsWithSales.slice(-6)
        const unsoldToShow = productsWithoutSales.slice(0, Math.max(0, 6 - bottomSellers.length))
        slowSellers = [...bottomSellers, ...unsoldToShow].reverse().map(p => ({
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          units: p.units,
          revenue: p.revenue,
          stock: p.stock,
          trend: 'down' as const
        }))
      } else if (productsWithSales.length >= 2) {
        // If we have 2-11 products with sales, split in half
        const midpoint = Math.ceil(productsWithSales.length / 2)
        fastSellers = productsWithSales.slice(0, midpoint).map(p => ({
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          units: p.units,
          revenue: p.revenue,
          stock: p.stock,
          trend: 'up' as const
        }))

        // Slow movers: bottom half of products with sales + all unsold products
        const bottomSellers = productsWithSales.slice(midpoint)
        slowSellers = [...bottomSellers, ...productsWithoutSales].reverse().map(p => ({
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          units: p.units,
          revenue: p.revenue,
          stock: p.stock,
          trend: 'down' as const
        }))
      } else if (productsWithSales.length === 1) {
        // If only 1 product sold, show it as fast, all others as slow
        fastSellers = productsWithSales.map(p => ({
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          units: p.units,
          revenue: p.revenue,
          stock: p.stock,
          trend: 'up' as const
        }))

        slowSellers = productsWithoutSales.map(p => ({
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          units: p.units,
          revenue: p.revenue,
          stock: p.stock,
          trend: 'down' as const
        }))
      } else {
        // No products sold, all are slow movers
        slowSellers = productsWithoutSales.map(p => ({
          name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
          units: p.units,
          revenue: p.revenue,
          stock: p.stock,
          trend: 'down' as const
        }))
      }

      // Category breakdown
      const categoryStats: Record<string, number> = {}
      productList.forEach(p => {
        const category = p.category || 'Other'
        categoryStats[category] = (categoryStats[category] || 0) + p.revenue
      })

      const categories = Object.entries(categoryStats)
        .map(([name, value]) => ({
          name: name.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' '), // Format category names
          originalName: name,
          value,
          color: CATEGORY_COLORS[name] || CATEGORY_COLORS['OTHER']
        }))
        .sort((a, b) => b.value - a.value)

      setFastSellingData(fastSellers)
      setSlowSellingData(slowSellers)
      setCategoryData(categories)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load sales velocity data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="skeleton w-32 h-32 rounded-full mx-auto mb-4"></div>
          <div className="text-sm text-gray-500">Loading sales velocity data...</div>
        </div>
      </div>
    )
  }

  const displayData = activeTab === 'fast' ? fastSellingData : slowSellingData
  const totalSales = categoryData.reduce((sum, cat) => sum + cat.value, 0)
  const formattedTotal = totalSales > 0 
    ? (totalSales / 1000000).toFixed(2) + 'M'
    : '0'

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Fast / Slow Movers</h1>
          <p className="page-sub">Sales velocity analytics by product</p>
        </div>
      </div>

      <div className="grid grid-2 gap-[18px] mb-5">
        {/* Fast Selling Products Chart */}
        <Card>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="font-semibold text-sm text-gray-900">Fast Selling Products</div>
            {fastSellingData.length > 0 && (
              <Badge style={{ background: '#e3f8f2', color: '#0ea885', fontSize: '11px', padding: '2px 8px' }}>
                Top {fastSellingData.length}
              </Badge>
            )}
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              {fastSellingData.length > 0 ? (
                <BarChart data={fastSellingData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11, fill: '#6b7280' }} 
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="units" fill="#2f5df5" radius={[0, 4, 4, 0]} />
                </BarChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No sales data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Mix Chart */}
        <Card>
          <div className="p-4 border-b border-gray-200">
            <div className="font-semibold text-sm text-gray-900">Category Mix</div>
          </div>
          <div className="p-4">
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
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '24px', fontWeight: 'bold', fill: '#111827' }}
                  >
                    {formattedTotal}
                  </text>
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No category data available
                </div>
              )}
            </ResponsiveContainer>
            
            {/* Legend */}
            {categoryData.length > 0 && (
              <div className="grid grid-2 gap-2 mt-4">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ background: cat.color }}
                    ></div>
                    <div className="text-xs text-gray-600 truncate">
                      {cat.name} ({money(cat.value).replace('MK ', '')})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'fast'
                  ? 'text-[#2f5df5] border-[#2f5df5]'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('fast')}
            >
              Fast Moving
            </button>
            <button
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'slow'
                  ? 'text-[#2f5df5] border-[#2f5df5]'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('slow')}
            >
              Slow Moving
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {displayData.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Stock</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td>{product.units}</td>
                    <td>{money(product.revenue)}</td>
                    <td>
                      <span className={product.stock === 0 ? 'text-red-600' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {product.trend === 'up' ? (
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No {activeTab === 'fast' ? 'fast' : 'slow'} moving products found</p>
              <p className="text-xs text-gray-400 mt-1">Make some sales to see product velocity analytics</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
