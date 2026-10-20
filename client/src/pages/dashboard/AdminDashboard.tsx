import {
  Package,
  Layers,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useApiStore } from '@/store/apiStore'
import {
  lowStockItems,
  outOfStockItems,
  totalStockValue,
  todaySales,
  monthSales,
  outstandingInvoices,
} from '@/services/dataGenerator'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

function money(n: number): string {
  return (
    'MK ' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

function fmtDateLong(dstr: string): string {
  const d = new Date(dstr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface KPICardProps {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  label: string
  value: string
  delta: string | null
  trending?: boolean
}

function KPICard({ icon: Icon, iconColor, iconBg, label, value, delta, trending = true }: KPICardProps) {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow overflow-hidden group">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:to-transparent transition-all pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-11 h-11 rounded-lg ${iconBg} flex items-center justify-center shadow-sm`}>
            <Icon className={`${iconColor}`} size={20} strokeWidth={2.5} />
          </div>
          {delta && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${trending ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {trending ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {delta}
            </div>
          )}
        </div>
        <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { products, sales, stockMovements, employees } = useApiStore()

  // Calculate today's sales - using API saleDate field
  const today = new Date().toISOString().split('T')[0]
  console.log('📅 Today\'s date:', today)
  console.log('📅 Sale dates in database:', sales.map(s => s.saleDate?.split('T')[0]))
  
  const todaySalesData = sales.filter(s => {
    const saleDate = s.saleDate ? s.saleDate.split('T')[0] : ''
    return saleDate === today
  })
  const todayRevenue = todaySalesData.reduce((a, s) => a + s.total, 0)
  console.log('💰 Today\'s revenue:', todayRevenue, 'from', todaySalesData.length, 'sales')
  
  // Calculate monthly sales - using API saleDate field
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthStartStr = monthStart.toISOString().split('T')[0]
  console.log('📅 Month start:', monthStartStr)
  
  const monthSalesData = sales.filter(s => {
    const saleDate = s.saleDate ? s.saleDate.split('T')[0] : ''
    return saleDate >= monthStartStr
  })
  const monthRevenue = monthSalesData.reduce((a, s) => a + s.total, 0)
  console.log('💰 Monthly revenue:', monthRevenue, 'from', monthSalesData.length, 'sales')
  
  const lowStock = lowStockItems(products)
  const outOfStock = outOfStockItems(products)
  
  // Outstanding invoices - using API paymentStatus field
  const outstanding = sales.filter(s => s.paymentStatus === 'PENDING' || s.paymentStatus === 'PARTIALLY_PAID')

  // Present today calculation (simplified - 75% present)
  const presentToday = Math.floor(employees.length * 0.75)

  // Generate 14-day sales trend data
  console.log('📊 Generating sales trend data...')
  console.log('Total sales:', sales.length)
  if (sales.length > 0) {
    console.log('First sale date:', sales[0].saleDate)
    console.log('Sale dates:', sales.map(s => s.saleDate))
  }
  
  const salesTrendData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    const dateStr = date.toISOString().split('T')[0]
    const daySales = sales.filter(s => {
      const saleDate = s.saleDate ? s.saleDate.split('T')[0] : ''
      return saleDate === dateStr
    })
    const revenue = daySales.reduce((sum, s) => sum + s.total, 0)
    
    if (daySales.length > 0) {
      console.log(`${dateStr}: ${daySales.length} sales, revenue: ${revenue}`)
    }
    
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: revenue / 1000, // Show in thousands
    }
  })
  
  console.log('Sales trend data:', salesTrendData)

  // Top 5 selling products - calculate from real sales data
  const productSales = new Map<string, number>();
  sales.forEach(sale => {
    sale.items?.forEach((item: any) => {
      const currentSold = productSales.get(item.productId) || 0;
      productSales.set(item.productId, currentSold + item.quantity);
    });
  });

  const topProducts = products
    .map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      sold: productSales.get(p.id) || 0,
    }))
    .filter(p => p.sold > 0) // Only show products that have been sold
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // Fast vs Slow movers - calculate from real sales data
  const allProductsWithStats = products
    .map(p => ({
      ...p,
      totalSold: productSales.get(p.id) || 0
    }))

  const sortedBySales = [...allProductsWithStats].sort((a, b) => b.totalSold - a.totalSold);
  const productsWithSales = sortedBySales.filter(p => p.totalSold > 0)
  const productsWithoutSales = sortedBySales.filter(p => p.totalSold === 0)
  
  // Only show if we have products
  let fastMovers: Array<{name: string, units: number, type: 'fast'}> = [];
  let slowMovers: Array<{name: string, units: number, type: 'slow'}> = [];
  
  if (productsWithSales.length >= 6) {
    // If we have 6+ products with sales, show top 3 as fast and bottom 3 as slow
    fastMovers = productsWithSales.slice(0, 3).map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      units: p.totalSold,
      type: 'fast' as const,
    }));
    
    // Slow movers: bottom 3 products with sales, or include unsold if less than 3
    const bottomWithSales = productsWithSales.slice(-3)
    const unsoldToShow = productsWithoutSales.slice(0, Math.max(0, 3 - bottomWithSales.length))
    slowMovers = [...bottomWithSales, ...unsoldToShow].reverse().map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      units: p.totalSold,
      type: 'slow' as const,
    }));
  } else if (productsWithSales.length >= 2) {
    // If we have 2-5 products with sales, split in half
    const midpoint = Math.ceil(productsWithSales.length / 2);
    fastMovers = productsWithSales.slice(0, midpoint).map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      units: p.totalSold,
      type: 'fast' as const,
    }));
    
    // Slow movers: bottom half + all unsold
    const bottomWithSales = productsWithSales.slice(midpoint)
    slowMovers = [...bottomWithSales, ...productsWithoutSales].reverse().map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      units: p.totalSold,
      type: 'slow' as const,
    }));
  } else if (productsWithSales.length === 1) {
    // Only 1 product sold - show as fast, all others as slow
    fastMovers = productsWithSales.map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      units: p.totalSold,
      type: 'fast' as const,
    }));
    
    slowMovers = productsWithoutSales.slice(0, 3).map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      units: p.totalSold,
      type: 'slow' as const,
    }));
  } else {
    // No sales - all products are slow movers
    slowMovers = productsWithoutSales.slice(0, 3).map(p => ({
      name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
      units: p.totalSold,
      type: 'slow' as const,
    }));
  }
  
  const fastSlowData = [...fastMovers, ...slowMovers];

  // Stock movement (last 14 days)
  console.log('📦 Generating stock movement data...')
  console.log('Total stock movements:', stockMovements.length)
  if (stockMovements.length > 0) {
    console.log('First movement:', stockMovements[0])
    console.log('Movement dates:', stockMovements.map(m => m.movementDate))
  }
  
  const stockMovementData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    const dateStr = date.toISOString().split('T')[0]
    const dayMovements = stockMovements.filter(m => {
      const movementDate = m.movementDate ? m.movementDate.split('T')[0] : ''
      return movementDate === dateStr
    })
    const stockIn = dayMovements.filter(m => m.type === 'IN').reduce((sum, m) => sum + m.quantity, 0)
    const stockOut = dayMovements.filter(m => m.type === 'OUT').reduce((sum, m) => sum + m.quantity, 0)
    
    if (dayMovements.length > 0) {
      console.log(`${dateStr}: ${dayMovements.length} movements, in: ${stockIn}, out: ${stockOut}`)
    }
    
    return {
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
      in: stockIn,
      out: stockOut,
    }
  })
  
  console.log('Stock movement data:', stockMovementData)

  return (
    <div className="fade-in">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your business today.</p>
          </div>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-4" style={{ marginBottom: '20px' }}>
        <KPICard
          icon={Package}
          iconColor="text-[#1f43c9]"
          iconBg="bg-[#e8eefd]"
          label="Total Products"
          value={products.length.toString()}
          delta="+3 this month"
          trending={true}
        />
        <KPICard
          icon={Layers}
          iconColor="text-[#6a4fd6]"
          iconBg="bg-[#efeafb]"
          label="Total Stock Value"
          value={money(totalStockValue(products))}
          delta="+4.2%"
          trending={true}
        />
        <KPICard
          icon={DollarSign}
          iconColor="text-[#0ea885]"
          iconBg="bg-[#e3f8f2]"
          label="Today's Sales"
          value={money(todayRevenue)}
          delta="+12.5%"
          trending={true}
        />
        <KPICard
          icon={TrendingUp}
          iconColor="text-[#1f43c9]"
          iconBg="bg-[#e8eefd]"
          label="Monthly Sales"
          value={money(monthRevenue)}
          delta="+8.1%"
          trending={true}
        />
      </div>

      {/* Second row KPIs */}
      <div className="grid grid-4" style={{ marginBottom: '20px' }}>
        <KPICard
          icon={Users}
          iconColor="text-[#374151]"
          iconBg="bg-[#eef0f4]"
          label="Total Employees"
          value={employees.length.toString()}
          delta={null}
          trending={true}
        />
        <KPICard
          icon={CheckCircle}
          iconColor="text-[#0ea885]"
          iconBg="bg-[#e3f8f2]"
          label="Present Today"
          value={`${presentToday} / ${employees.length}`}
          delta={null}
          trending={true}
        />
        <KPICard
          icon={AlertTriangle}
          iconColor="text-[#c97a1a]"
          iconBg="bg-[#fbf0dd]"
          label="Low Stock Items"
          value={lowStock.length.toString()}
          delta={`${lowStock.length} need reorder`}
          trending={false}
        />
        <KPICard
          icon={XCircle}
          iconColor="text-[#c2372c]"
          iconBg="bg-[#fbe9e7]"
          label="Out of Stock"
          value={outOfStock.length.toString()}
          delta={`${outOfStock.length} urgent`}
          trending={false}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: '20px', gap: '18px' }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-base font-semibold text-gray-900">Sales Performance</div>
              <div className="text-xs text-gray-500 mt-0.5">Last 14 days revenue trend</div>
            </div>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
              Daily
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={salesTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9aa3b2" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9aa3b2" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e6e9ef' }}
                formatter={(value: any) => [`MK ${(value * 1000).toLocaleString()}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2f5df5" 
                strokeWidth={2} 
                dot={{ fill: '#2f5df5', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="text-base font-semibold text-gray-900">Fast vs Slow Movers</div>
            <div className="text-xs text-gray-500 mt-0.5">Units sold, last 30 days</div>
          </div>
          {fastSlowData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={fastSlowData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9aa3b2" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} stroke="#9aa3b2" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e6e9ef' }} />
                  <Bar dataKey="units" radius={[0, 4, 4, 0]}>
                    {fastSlowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === 'fast' ? '#0ea885' : '#c2372c'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#0ea885]"></div>
                  <span className="text-gray-600">Fast movers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#c2372c]"></div>
                  <span className="text-gray-600">Slow movers</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              No sales data yet
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr', marginBottom: '20px', gap: '18px' }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-base font-semibold text-gray-900">Top Selling Products</div>
              <div className="text-xs text-gray-500 mt-0.5">By units sold this month</div>
            </div>
            <button className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors">
              View all
            </button>
          </div>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9aa3b2" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} stroke="#9aa3b2" />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e6e9ef' }} />
                <Bar dataKey="sold" fill="#6a4fd6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-36 text-sm text-gray-400">
              No sales data yet
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="text-base font-semibold text-gray-900">Stock Movement</div>
            <div className="text-xs text-gray-500 mt-0.5">In vs out, last 14 days</div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={stockMovementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#9aa3b2" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9aa3b2" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e6e9ef' }} />
              <Bar dataKey="in" fill="#0ea885" radius={[4, 4, 0, 0]} />
              <Bar dataKey="out" fill="#c2372c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0ea885]"></div>
              <span className="text-gray-600">Stock-In</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#c2372c]"></div>
              <span className="text-gray-600">Stock-Out</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity in 3 columns */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '20px', gap: '18px' }}>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
            <div className="text-base font-semibold text-gray-900">Recent Sales</div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View all
            </button>
          </div>
          <div className="p-4 space-y-3">
            {sales.slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{s.customer}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {s.invoiceNo} · {fmtDateLong(s.saleDate.split('T')[0])}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-sm font-semibold text-gray-900">{money(s.total)}</div>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ 
                        background: s.paymentStatus === 'PAID' ? '#0ea885' : s.paymentStatus === 'PENDING' ? '#c97a1a' : '#6b7280'
                      }}
                    ></div>
                    <span 
                      className="text-[10px] font-semibold"
                      style={{ 
                        color: s.paymentStatus === 'PAID' ? '#0ea885' : s.paymentStatus === 'PENDING' ? '#c97a1a' : '#6b7280'
                      }}
                    >
                      {s.paymentStatus === 'PAID' ? 'Paid' : s.paymentStatus === 'PENDING' ? 'Pending' : 'Partially Paid'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
            <div className="text-base font-semibold text-gray-900">Recent Stock Activity</div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View all
            </button>
          </div>
          <div className="p-4 space-y-3">
            {stockMovements
              .sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime())
              .slice(0, 5)
              .map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  {m.type === 'IN' ? (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#e3f8f2' }}>
                      <TrendingUp className="w-4 h-4 text-[#0ea885]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fbf0dd' }}>
                      <TrendingUp className="w-4 h-4 text-[#c97a1a]" style={{ transform: 'rotate(180deg)' }} />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{m.product?.name || 'Unknown Product'}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {m.reference} · {fmtDateLong(m.movementDate.split('T')[0])}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`text-xs font-bold ${m.type === 'IN' ? 'text-[#0ea885]' : 'text-[#c97a1a]'}`}>
                    {m.type === 'IN' ? '+' : '-'}
                    {m.quantity} units
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-transparent">
            <div className="text-base font-semibold text-gray-900">Recent Employees</div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View all
            </button>
          </div>
          <div className="p-4 space-y-3">
            {employees.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{e.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {e.position} · {e.department}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ 
                        background: (e.status === 'ACTIVE' || (e.status as string) === 'Active') ? '#0ea885' : (e.status === 'ON_LEAVE' || (e.status as string) === 'On Leave') ? '#c97a1a' : '#c2372c'
                      }}
                    ></div>
                    <span 
                      className="text-[10px] font-semibold"
                      style={{ 
                        color: (e.status === 'ACTIVE' || (e.status as string) === 'Active') ? '#0ea885' : (e.status === 'ON_LEAVE' || (e.status as string) === 'On Leave') ? '#c97a1a' : '#c2372c'
                      }}
                    >
                      {e.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outstanding Invoices and Low Stock Alerts */}
      <div className="grid grid-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-transparent">
            <div className="text-base font-semibold text-gray-900">Outstanding Invoices</div>
            <div className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-semibold">
              {outstanding.length} pending
            </div>
          </div>
          <div className="p-4 space-y-3">
            {outstanding.slice(0, 5).map((i) => (
              <div key={i.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{i.invoiceNo}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {i.customer} · {fmtDateLong(i.saleDate.split('T')[0])}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-sm font-semibold text-gray-900">{money(i.total)}</div>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c97a1a' }}></div>
                    <span className="text-[10px] font-semibold" style={{ color: '#c97a1a' }}>
                      {i.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {outstanding.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mb-3" />
                <div className="text-sm font-semibold text-gray-700">All caught up!</div>
                <div className="text-xs text-gray-500 mt-1">No outstanding invoices</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-red-50/50 to-transparent">
            <div className="text-base font-semibold text-gray-900">Low & Out of Stock</div>
            <div className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold">
              {lowStock.length + outOfStock.length} items
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[...outOfStock, ...lowStock].slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {p.sku} · {p.category}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-sm font-semibold text-gray-900">{p.stock} left</div>
                  <div className="flex items-center justify-end gap-1.5 mt-1">
                    <div 
                      className="w-1.5 h-1.5 rounded-full" 
                      style={{ background: p.status === 'Out of Stock' ? '#c2372c' : '#c97a1a' }}
                    ></div>
                    <span 
                      className="text-[10px] font-semibold"
                      style={{ color: p.status === 'Out of Stock' ? '#c2372c' : '#c97a1a' }}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
