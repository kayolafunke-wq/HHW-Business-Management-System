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
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useDataStore } from '@/store/dataStore'
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
    <Card className="kpi">
      <div className="kpi-top">
        <div className={`kpi-icon ${iconBg}`}>
          <Icon className={`${iconColor}`} size={17} strokeWidth={2.5} />
        </div>
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {delta && (
        <div className={`kpi-delta ${trending ? 'up' : 'down'}`}>
          {trending ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {delta}
        </div>
      )}
    </Card>
  )
}

export default function AdminDashboard() {
  const { products, sales, stockMovements, employees } = useDataStore()

  const todaySalesData = todaySales(sales)
  const monthSalesData = monthSales(sales)
  const todayRevenue = todaySalesData.reduce((a, s) => a + s.total, 0)
  const monthRevenue = monthSalesData.reduce((a, s) => a + s.total, 0)
  const lowStock = lowStockItems(products)
  const outOfStock = outOfStockItems(products)
  const outstanding = outstandingInvoices(sales)

  // Present today calculation (simplified - 75% present)
  const presentToday = Math.floor(employees.length * 0.75)

  // Generate 14-day sales trend data
  const salesTrendData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    const dateStr = date.toISOString().split('T')[0]
    const daySales = sales.filter(s => s.date === dateStr)
    const revenue = daySales.reduce((sum, s) => sum + s.total, 0)
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: revenue / 1000, // Show in thousands
    }
  })

  // Top 5 selling products
  const topProducts = products
    .map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      sold: Math.floor(Math.random() * 100) + 10, // Simplified
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5)

  // Fast vs Slow movers
  const fastMovers = products.slice(0, 3).map(p => ({
    name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
    units: Math.floor(Math.random() * 50) + 40,
    type: 'fast',
  }))
  const slowMovers = products.slice(-3).map(p => ({
    name: p.name.length > 18 ? p.name.substring(0, 18) + '...' : p.name,
    units: Math.floor(Math.random() * 20) + 5,
    type: 'slow',
  }))
  const fastSlowData = [...fastMovers, ...slowMovers]

  // Stock movement (last 14 days)
  const stockMovementData = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    const dateStr = date.toISOString().split('T')[0]
    const dayMovements = stockMovements.filter(m => m.date === dateStr)
    const stockIn = dayMovements.filter(m => m.type === 'in').reduce((sum, m) => sum + m.qty, 0)
    const stockOut = dayMovements.filter(m => m.type === 'out').reduce((sum, m) => sum + m.qty, 0)
    return {
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
      in: stockIn,
      out: stockOut,
    }
  })

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">Overview of your business today</p>
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
        <Card>
          <div className="card-head">
            <div>
              <div className="card-title">Sales Performance</div>
              <div className="card-title-sub">Last 14 days revenue trend</div>
            </div>
            <Badge variant="primary" className="!text-xs">
              Daily
            </Badge>
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
        </Card>

        <Card>
          <div className="card-head">
            <div>
              <div className="card-title">Fast vs Slow Movers</div>
              <div className="card-title-sub">Units sold, last 30 days</div>
            </div>
          </div>
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
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid" style={{ gridTemplateColumns: '1.3fr 1fr', marginBottom: '20px', gap: '18px' }}>
        <Card>
          <div className="card-head">
            <div>
              <div className="card-title">Top Selling Products</div>
              <div className="card-title-sub">By units sold this month</div>
            </div>
            <Badge variant="primary" className="!text-xs cursor-pointer">
              View all
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={topProducts} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9aa3b2" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} stroke="#9aa3b2" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e6e9ef' }} />
              <Bar dataKey="sold" fill="#6a4fd6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="card-head">
            <div>
              <div className="card-title">Stock Movement</div>
              <div className="card-title-sub">In vs out, last 14 days</div>
            </div>
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
        </Card>
      </div>

      {/* Recent Activity in 3 columns */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '20px', gap: '18px' }}>
        <Card>
          <div className="card-head">
            <div className="card-title">Recent Sales</div>
            <Badge variant="primary" className="!text-xs cursor-pointer">
              View all
            </Badge>
          </div>
          {sales.slice(0, 5).map((s) => (
            <div key={s.id} className="stat-row">
              <div>
                <div className="cell-strong" style={{ fontSize: '12.5px' }}>
                  {s.customer}
                </div>
                <div className="cell-sub">
                  {s.invoiceNo} · {fmtDateLong(s.date)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="cell-strong" style={{ fontSize: '12.5px' }}>
                  {money(s.total)}
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      background: s.payStatus === 'Paid' ? '#0ea885' : s.payStatus === 'Pending' ? '#c97a1a' : '#6b7280'
                    }}
                  ></div>
                  <span 
                    className="text-[10px] font-semibold"
                    style={{ 
                      color: s.payStatus === 'Paid' ? '#0ea885' : s.payStatus === 'Pending' ? '#c97a1a' : '#6b7280'
                    }}
                  >
                    {s.payStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div className="card-head">
            <div className="card-title">Recent Stock Activity</div>
            <Badge variant="primary" className="!text-xs cursor-pointer">
              View all
            </Badge>
          </div>
          {stockMovements.slice(-5).reverse().map((m) => (
            <div key={m.id} className="stat-row">
              <div className="flex items-center gap-3">
                {m.type === 'in' ? (
                  <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: '#e3f8f2' }}>
                    <TrendingUp className="w-4 h-4 text-[#0ea885]" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: '#fbf0dd' }}>
                    <TrendingUp className="w-4 h-4 text-[#c97a1a]" style={{ transform: 'rotate(180deg)' }} />
                  </div>
                )}
                <div>
                  <div className="cell-strong" style={{ fontSize: '12.5px' }}>
                    {m.productName}
                  </div>
                  <div className="cell-sub">
                    {m.ref} · {fmtDateLong(m.date)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`text-xs font-bold ${m.type === 'in' ? 'text-[#0ea885]' : 'text-[#c97a1a]'}`}>
                  {m.type === 'in' ? '+' : '-'}
                  {m.qty} units
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div className="card-head">
            <div className="card-title">Recently Registered Employees</div>
            <Badge variant="primary" className="!text-xs cursor-pointer">
              View all
            </Badge>
          </div>
          {employees.slice(0, 5).map((e) => (
            <div key={e.id} className="stat-row">
              <div>
                <div className="cell-strong" style={{ fontSize: '12.5px' }}>
                  {e.name}
                </div>
                <div className="cell-sub">
                  {e.position} · {e.department}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      background: e.status === 'Active' ? '#0ea885' : e.status === 'On Leave' ? '#c97a1a' : '#c2372c'
                    }}
                  ></div>
                  <span 
                    className="text-[10px] font-semibold"
                    style={{ 
                      color: e.status === 'Active' ? '#0ea885' : e.status === 'On Leave' ? '#c97a1a' : '#c2372c'
                    }}
                  >
                    {e.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Outstanding Invoices and Low Stock Alerts */}
      <div className="grid grid-2">
        <Card>
          <div className="card-head">
            <div className="card-title">Outstanding Invoices</div>
            <Badge variant="warning" className="!text-xs">
              {outstanding.length} pending
            </Badge>
          </div>
          {outstanding.slice(0, 5).map((i) => (
            <div key={i.id} className="stat-row">
              <div>
                <div className="cell-strong" style={{ fontSize: '12.5px' }}>
                  {i.invoiceNo}
                </div>
                <div className="cell-sub">
                  {i.customer} · {fmtDateLong(i.date)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="cell-strong" style={{ fontSize: '12.5px' }}>
                  {money(i.total)}
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ background: '#c97a1a' }}
                  ></div>
                  <span 
                    className="text-[10px] font-semibold"
                    style={{ color: '#c97a1a' }}
                  >
                    {i.payStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {outstanding.length === 0 && (
            <div className="empty-state" style={{ padding: '20px' }}>
              <CheckCircle className="w-10 h-10 text-gray-400 mb-3" />
              <div className="text-sm font-semibold text-gray-700">All caught up</div>
            </div>
          )}
        </Card>

        <Card>
          <div className="card-head">
            <div className="card-title">Low & Out of Stock Alerts</div>
            <Badge variant="danger" className="!text-xs">
              {lowStock.length + outOfStock.length} items
            </Badge>
          </div>
          {[...outOfStock, ...lowStock].slice(0, 5).map((p) => (
            <div key={p.id} className="stat-row">
              <div>
                <div className="cell-strong" style={{ fontSize: '12.5px' }}>
                  {p.name}
                </div>
                <div className="cell-sub">
                  {p.sku} · {p.category}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="cell-strong" style={{ fontSize: '12.5px' }}>
                  {p.stock} left
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      background: p.status === 'Out of Stock' ? '#c2372c' : '#c97a1a'
                    }}
                  ></div>
                  <span 
                    className="text-[10px] font-semibold"
                    style={{ 
                      color: p.status === 'Out of Stock' ? '#c2372c' : '#c97a1a'
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
