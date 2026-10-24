import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { TrendingUp, DollarSign, Sparkles, ShoppingCart } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import toast from 'react-hot-toast'
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

interface PerformanceData {
  totalRevenue: number
  costOfGoods: number
  grossProfit: number
  transactions: number
  profitMargin: number
  avgTransaction: number
  revenueVsCostData: Array<{ date: string; revenue: number; cost: number }>
  profitTrendData: Array<{ date: string; profit: number }>
  weeklySalesData: Array<{ week: string; sales: number }>
  monthlySalesData: Array<{ month: string; sales: number }>
  bestSellingProducts: Array<{ name: string; revenue: number }>
  slowSellingProducts: Array<{ name: string; units: number }>
}

export default function PerformancePage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<PerformanceData>({
    totalRevenue: 0,
    costOfGoods: 0,
    grossProfit: 0,
    transactions: 0,
    profitMargin: 0,
    avgTransaction: 0,
    revenueVsCostData: [],
    profitTrendData: [],
    weeklySalesData: [],
    monthlySalesData: [],
    bestSellingProducts: [],
    slowSellingProducts: [],
  })

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  const fetchPerformanceData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { 'Authorization': `Bearer ${token}` }

      // Fetch sales data
      const salesRes = await fetch(`${API_BASE_URL}/sales`, { headers })
      const salesData = await salesRes.json()
      const sales = salesData.success ? salesData.data : []

      // Fetch products for cost calculation
      const productsRes = await fetch(`${API_BASE_URL}/products`, { headers })
      const productsData = await productsRes.json()
      const products = productsData.success ? productsData.data : []

      // Calculate metrics from real data
      const totalRevenue = sales.reduce((sum: number, sale: any) => sum + (sale.total || 0), 0)
      const transactions = sales.length

      // Calculate cost of goods from actual product costs
      let totalCost = 0
      sales.forEach((sale: any) => {
        sale.items?.forEach((item: any) => {
          const product = products.find((p: any) => p.id === item.productId)
          if (product) {
            totalCost += product.cost * item.quantity
          }
        })
      })
      const costOfGoods = totalCost

      const grossProfit = totalRevenue - costOfGoods
      const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100) : 0
      const avgTransaction = transactions > 0 ? (totalRevenue / transactions) : 0

      // Generate daily data for last 14 days
      const last14Days = Array.from({ length: 14 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (13 - i))
        const dateStr = date.toISOString().split('T')[0]
        
        const daySales = sales.filter((s: any) => {
          const saleDate = s.saleDate || s.date || ''
          return saleDate.startsWith(dateStr)
        })
        const dayRevenue = daySales.reduce((sum: number, s: any) => sum + (s.total || 0), 0)
        
        // Calculate actual cost for this day
        let dayCost = 0
        daySales.forEach((sale: any) => {
          sale.items?.forEach((item: any) => {
            const product = products.find((p: any) => p.id === item.productId)
            if (product) {
              dayCost += product.cost * item.quantity
            }
          })
        })
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: dayRevenue,
          cost: dayCost,
          profit: dayRevenue - dayCost
        }
      })

      // Calculate product performance
      const productSales: Record<string, { revenue: number; units: number; name: string }> = {}
      
      sales.forEach((sale: any) => {
        sale.items?.forEach((item: any) => {
          const prodId = item.productId || item.product?.id
          const prodName = item.product?.name || item.productName || 'Unknown Product'
          
          if (!productSales[prodId]) {
            productSales[prodId] = { revenue: 0, units: 0, name: prodName }
          }
          
          productSales[prodId].revenue += (item.price || 0) * (item.quantity || 0)
          productSales[prodId].units += (item.quantity || 0)
        })
      })

      const productList = Object.values(productSales)
      const bestSelling = productList
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(p => ({ name: p.name, revenue: p.revenue }))
      
      const slowSelling = productList
        .sort((a, b) => a.units - b.units)
        .slice(0, 5)
        .map(p => ({ name: p.name, units: p.units }))

      setData({
        totalRevenue,
        costOfGoods,
        grossProfit,
        transactions,
        profitMargin,
        avgTransaction,
        revenueVsCostData: last14Days.map(d => ({ date: d.date, revenue: d.revenue, cost: d.cost })),
        profitTrendData: last14Days.map(d => ({ date: d.date, profit: d.profit })),
        weeklySalesData: [], // Can be calculated if needed
        monthlySalesData: [], // Can be calculated if needed
        bestSellingProducts: bestSelling.length > 0 ? bestSelling : [],
        slowSellingProducts: slowSelling.length > 0 ? slowSelling : [],
      })
    } catch (error) {
      console.error('Failed to fetch performance data:', error)
      toast.error('Failed to load performance data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="skeleton w-32 h-32 rounded-full mx-auto mb-4"></div>
          <div className="text-sm text-gray-500">Loading performance data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Business Performance</h1>
          <p className="page-sub">Profitability and growth at a glance</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#e8eefd', color: '#2f5df5' }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
            {data.totalRevenue > 0 && (
              <div className="text-xs font-semibold text-[#0ea885] flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
                +{data.profitMargin.toFixed(1)}%
              </div>
            )}
          </div>
          <div className="kpi-label">Total Revenue (MTD, excl. VAT)</div>
          <div className="kpi-value">{money(data.totalRevenue)}</div>
        </Card>

        {/* Cost of Goods Sold */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#fbe9e7', color: '#c2372c' }}
            >
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-label">Cost of Goods Sold</div>
          <div className="kpi-value">{money(data.costOfGoods)}</div>
        </Card>

        {/* Gross Profit */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#e1f5eb', color: '#0ea885' }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-label">Gross Profit</div>
          <div className="kpi-value">{money(data.grossProfit)}</div>
          {data.totalRevenue > 0 && (
            <div className="text-xs text-gray-500 mt-1">{data.profitMargin.toFixed(0)}% margin</div>
          )}
        </Card>

        {/* Transactions */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#fff4e6', color: '#f59e0b' }}
            >
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="kpi-label">Transactions</div>
          <div className="kpi-value">{data.transactions}</div>
          {data.transactions > 0 && (
            <div className="text-xs text-gray-500 mt-1">Avg. {money(data.avgTransaction)}</div>
          )}
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Revenue vs Cost */}
        <Card>
          <div className="card-head">
            <div>
              <div className="card-title">Revenue vs Cost</div>
              <div className="card-sub">Last 14 days</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            {data.revenueVsCostData.length > 0 ? (
              <AreaChart data={data.revenueVsCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#999" />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#999"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => money(value)}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Revenue (excl. VAT)"
                />
                <Area
                  type="monotone"
                  dataKey="cost"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="Cost"
                />
              </AreaChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No sales data available
              </div>
            )}
          </ResponsiveContainer>
        </Card>

        {/* Profit Trend */}
        <Card>
          <div className="card-head">
            <div>
              <div className="card-title">Profit Trend</div>
              <div className="card-sub">Daily gross profit</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            {data.profitTrendData.length > 0 ? (
              <LineChart data={data.profitTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#999" />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#999"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => money(value)}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No profit data available
              </div>
            )}
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Best Selling Products */}
        <Card>
          <div className="card-head">
            <div className="card-title">Best Selling Products</div>
            <div className="card-sub">By revenue</div>
          </div>
          {data.bestSellingProducts.length > 0 ? (
            <div className="space-y-3">
              {data.bestSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{product.name}</div>
                  <div className="text-sm font-semibold text-gray-900">{money(product.revenue)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No product sales data available
            </div>
          )}
        </Card>

        {/* Slow Selling Products */}
        <Card>
          <div className="card-head">
            <div className="card-title">Slow Selling Products</div>
            <div className="card-sub">Lowest units sold</div>
          </div>
          {data.slowSellingProducts.length > 0 ? (
            <div className="space-y-3">
              {data.slowSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">{product.name}</div>
                  <div className="text-sm font-semibold text-gray-900">{product.units} units</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm">
              No product sales data available
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
