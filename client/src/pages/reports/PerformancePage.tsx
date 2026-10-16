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

function money(n: number): string {
  return (
    'MK ' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

// Revenue vs Cost data (last 14 days)
const revenueVsCostData = [
  { date: 'Sep 26', revenue: 520000, cost: 385000 },
  { date: 'Sep 27', revenue: 485000, cost: 362000 },
  { date: 'Sep 28', revenue: 610000, cost: 445000 },
  { date: 'Sep 29', revenue: 580000, cost: 428000 },
  { date: 'Sep 30', revenue: 505000, cost: 375000 },
  { date: 'Oct 1', revenue: 625000, cost: 465000 },
  { date: 'Oct 2', revenue: 590000, cost: 438000 },
  { date: 'Oct 3', revenue: 520000, cost: 390000 },
  { date: 'Oct 4', revenue: 555000, cost: 412000 },
  { date: 'Oct 5', revenue: 495000, cost: 368000 },
  { date: 'Oct 6', revenue: 640000, cost: 475000 },
  { date: 'Oct 7', revenue: 605000, cost: 450000 },
  { date: 'Oct 8', revenue: 575000, cost: 428000 },
  { date: 'Oct 9', revenue: 590000, cost: 440000 },
]

// Profit trend data
const profitTrendData = [
  { date: 'Sep 26', profit: 135000 },
  { date: 'Sep 27', profit: 123000 },
  { date: 'Sep 28', profit: 165000 },
  { date: 'Sep 29', profit: 152000 },
  { date: 'Sep 30', profit: 130000 },
  { date: 'Oct 1', profit: 160000 },
  { date: 'Oct 2', profit: 152000 },
  { date: 'Oct 3', profit: 130000 },
  { date: 'Oct 4', profit: 143000 },
  { date: 'Oct 5', profit: 127000 },
  { date: 'Oct 6', profit: 165000 },
  { date: 'Oct 7', profit: 155000 },
  { date: 'Oct 8', profit: 147000 },
  { date: 'Oct 9', profit: 150000 },
]

// Weekly sales data
const weeklySalesData = [
  { week: 'W 1', sales: 340000 },
  { week: 'W 2', sales: 420000 },
  { week: 'W 3', sales: 380000 },
  { week: 'W 4', sales: 450000 },
  { week: 'W 5', sales: 410000 },
]

// Monthly sales growth data
const monthlySalesData = [
  { month: 'Apr', sales: 1850000 },
  { month: 'May', sales: 2100000 },
  { month: 'Jun', sales: 2350000 },
  { month: 'Jul', sales: 2280000 },
  { month: 'Aug', sales: 2520000 },
  { month: 'Sep', sales: 2680000 },
]

// Best selling products
const bestSellingProducts = [
  { name: 'Cooking Oil 5L', revenue: 1897500 },
  { name: 'Coca-Cola 500ml (Crate of 24)', revenue: 1054500 },
  { name: 'Ballpoint Pens (Box of 50)', revenue: 572000 },
  { name: 'Wireless Mouse Logitech', revenue: 759500 },
  { name: 'Smartphone Charger Type-C', revenue: 367500 },
]

// Slow selling products
const slowSellingProducts = [
  { name: 'Maize Flour 25kg', units: 10 },
  { name: 'Fanta Orange 2L', units: 18 },
  { name: 'Bluetooth Speaker JBL Go', units: 22 },
  { name: 'School Uniform Set', units: 24 },
  { name: 'Office Stapler Heavy Duty', units: 24 },
]

export default function PerformancePage() {
  const totalRevenue = 7451005
  const costOfGoods = 5596800
  const grossProfit = totalRevenue - costOfGoods
  const transactions = 43
  const profitMargin = ((grossProfit / totalRevenue) * 100).toFixed(0)
  const avgTransaction = totalRevenue / transactions

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Business Performance</h1>
          <p className="page-sub">Profitability and growth at a glance</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Total Revenue */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#e8eefd', color: '#2f5df5' }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-[#0ea885] flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
              +6.1%
            </div>
          </div>
          <div className="kpi-label">Total Revenue (MTD, excl. VAT)</div>
          <div className="kpi-value">{money(totalRevenue)}</div>
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
          <div className="kpi-value">{money(costOfGoods)}</div>
        </Card>

        {/* Gross Profit */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#e3f8f2', color: '#0ea885' }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs font-semibold text-[#0ea885]">
              {profitMargin}% margin
            </div>
          </div>
          <div className="kpi-label">Gross Profit</div>
          <div className="kpi-value">{money(grossProfit)}</div>
        </Card>

        {/* Transactions */}
        <Card className="kpi">
          <div className="kpi-top">
            <div
              className="kpi-icon"
              style={{ background: '#efeafb', color: '#6a4fd6' }}
            >
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div className="text-xs text-[#0ea885]">
              Avg. {money(avgTransaction)}
            </div>
          </div>
          <div className="kpi-label">Transactions</div>
          <div className="kpi-value">{transactions}</div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Revenue vs Cost */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Revenue vs Cost</h3>
              <p className="text-xs text-gray-500 mt-0.5">Last 14 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueVsCostData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2f5df5" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2f5df5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c2372c" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#c2372c" stopOpacity={0}/>
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
                tickFormatter={(val) => `${val / 1000}k`}
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
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Area
                type="linear"
                dataKey="revenue"
                name="Revenue (excl. VAT)"
                stroke="#2f5df5"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                dot={{ fill: '#2f5df5', r: 4, strokeWidth: 0 }}
              />
              <Area
                type="linear"
                dataKey="cost"
                name="Cost"
                stroke="#c2372c"
                strokeWidth={2}
                fill="url(#colorCost)"
                dot={{ fill: '#c2372c', r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Profit Trend */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Profit Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={profitTrendData}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea885" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0ea885" stopOpacity={0}/>
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
                tickFormatter={(val) => `${val / 1000}k`}
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
                dataKey="profit"
                name="Profit"
                stroke="#0ea885"
                strokeWidth={2}
                fill="url(#colorProfit)"
                dot={{ fill: '#0ea885', r: 4, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Weekly Sales */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Weekly Sales</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: '#9aa3b2' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9aa3b2' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val / 1000}k`}
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
              <Bar dataKey="sales" fill="#2f5df5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Sales Growth */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Monthly Sales Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#9aa3b2' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9aa3b2' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val / 1000000}M`}
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
              <Bar dataKey="sales" fill="#6a4fd6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Product Lists */}
      <div className="grid grid-cols-2 gap-4">
        {/* Best Selling Products */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Best Selling Products</h3>
          </div>
          <div className="space-y-3">
            {bestSellingProducts.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="text-sm text-gray-900">{product.name}</div>
                <div className="text-sm font-semibold text-gray-900">{money(product.revenue)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Slow Selling Products */}
        <Card>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Slow Selling Products</h3>
          </div>
          <div className="space-y-3">
            {slowSellingProducts.map((product, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="text-sm text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">{product.units} units</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
