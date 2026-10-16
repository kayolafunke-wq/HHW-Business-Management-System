import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useApiStore } from '@/store/apiStore'
import { TrendingUp, TrendingDown, Award, Users, DollarSign, ShoppingCart } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
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

interface EmployeePerformance {
  name: string
  totalSales: number
  totalRevenue: number
  averageSale: number
  rank: number
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function SalesPerformance() {
  const { sales } = useApiStore()
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([])

  useEffect(() => {
    calculatePerformance()
  }, [sales, selectedMonth])

  const calculatePerformance = () => {
    // Filter sales by selected month
    let filteredSales = sales
    if (selectedMonth !== 'all') {
      const currentDate = new Date()
      const targetMonth = selectedMonth === 'current' 
        ? currentDate.getMonth() 
        : parseInt(selectedMonth)
      
      filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.saleDate)
        return saleDate.getMonth() === targetMonth
      })
    }

    // Group sales by cashier/employee
    const performanceMap = new Map<string, { totalSales: number; totalRevenue: number }>()

    filteredSales.forEach(sale => {
      const cashierName = sale.cashier || sale.user?.name || 'Walk-in Customer'
      
      if (!performanceMap.has(cashierName)) {
        performanceMap.set(cashierName, { totalSales: 0, totalRevenue: 0 })
      }

      const current = performanceMap.get(cashierName)!
      current.totalSales += 1
      current.totalRevenue += sale.total
    })

    // Convert to array and calculate averages
    const performance: EmployeePerformance[] = Array.from(performanceMap.entries()).map(
      ([name, data]) => ({
        name,
        totalSales: data.totalSales,
        totalRevenue: data.totalRevenue,
        averageSale: data.totalRevenue / data.totalSales,
        rank: 0,
      })
    )

    // Sort by revenue and assign ranks
    performance.sort((a, b) => b.totalRevenue - a.totalRevenue)
    performance.forEach((emp, index) => {
      emp.rank = index + 1
    })

    setEmployeePerformance(performance)
  }

  // Calculate totals
  const totalRevenue = employeePerformance.reduce((sum, emp) => sum + emp.totalRevenue, 0)
  const totalSalesCount = employeePerformance.reduce((sum, emp) => sum + emp.totalSales, 0)
  const averageSaleValue = totalSalesCount > 0 ? totalRevenue / totalSalesCount : 0

  // Prepare chart data
  const chartData = employeePerformance.map(emp => ({
    name: emp.name.split(' ')[0], // First name only for chart
    revenue: emp.totalRevenue,
    sales: emp.totalSales,
  }))

  const pieData = employeePerformance.map(emp => ({
    name: emp.name,
    value: emp.totalRevenue,
  }))

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Sales Performance by Employee</h1>
          <p className="page-sub">Track individual salesperson performance and rankings</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Time</option>
            <option value="current">Current Month</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        <Card className="kpi">
          <div className="kpi-icon" style={{ background: '#e3f8f2' }}>
            <DollarSign className="w-5 h-5" style={{ color: '#0ea885' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Revenue</div>
            <div className="kpi-value">{money(totalRevenue)}</div>
          </div>
        </Card>

        <Card className="kpi">
          <div className="kpi-icon" style={{ background: '#e5edff' }}>
            <ShoppingCart className="w-5 h-5" style={{ color: '#2f5df5' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Total Sales</div>
            <div className="kpi-value">{totalSalesCount}</div>
          </div>
        </Card>

        <Card className="kpi">
          <div className="kpi-icon" style={{ background: '#fbf0dd' }}>
            <TrendingUp className="w-5 h-5" style={{ color: '#c97a1a' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Average Sale Value</div>
            <div className="kpi-value">{money(averageSaleValue)}</div>
          </div>
        </Card>

        <Card className="kpi">
          <div className="kpi-icon" style={{ background: '#f3e8ff' }}>
            <Users className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          </div>
          <div className="kpi-content">
            <div className="kpi-label">Active Salespeople</div>
            <div className="kpi-value">{employeePerformance.length}</div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid mb-5" style={{ gridTemplateColumns: '2fr 1fr', gap: '18px' }}>
        {/* Revenue by Employee Bar Chart */}
        <Card>
          <div className="mb-4">
            <h2 className="font-display font-semibold text-base text-gray-900 mb-1">
              Revenue by Salesperson
            </h2>
            <p className="text-xs text-gray-500">
              Total sales revenue generated by each employee
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => money(value)}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Distribution Pie Chart */}
        <Card>
          <div className="mb-4">
            <h2 className="font-display font-semibold text-base text-gray-900 mb-1">
              Revenue Share
            </h2>
            <p className="text-xs text-gray-500">
              Percentage of total revenue
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => money(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Performance Leaderboard */}
      <Card>
        <div className="mb-4">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-1">
            Performance Leaderboard
          </h2>
          <p className="text-xs text-gray-500">
            Ranked by total sales revenue
          </p>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>Employee</th>
                <th className="text-right">Total Sales</th>
                <th className="text-right">Total Revenue</th>
                <th className="text-right">Avg Sale Value</th>
                <th className="text-right">Performance</th>
              </tr>
            </thead>
            <tbody>
              {employeePerformance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-8">
                    No sales data available for the selected period
                  </td>
                </tr>
              ) : (
                employeePerformance.map((emp) => {
                  const revenuePercent = totalRevenue > 0 ? (emp.totalRevenue / totalRevenue) * 100 : 0
                  
                  return (
                    <tr key={emp.name}>
                      <td>
                        <div className="flex items-center justify-center">
                          {emp.rank === 1 && (
                            <Award className="w-5 h-5 text-yellow-500" />
                          )}
                          {emp.rank === 2 && (
                            <Award className="w-5 h-5 text-gray-400" />
                          )}
                          {emp.rank === 3 && (
                            <Award className="w-5 h-5 text-orange-600" />
                          )}
                          {emp.rank > 3 && (
                            <span className="font-semibold text-gray-600">{emp.rank}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div>
                            <div className="cell-strong">{emp.name}</div>
                            {emp.rank <= 3 && (
                              <div className="text-xs text-gray-500">
                                {emp.rank === 1 ? '🏆 Top Performer' : emp.rank === 2 ? '🥈 Runner Up' : '🥉 Third Place'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="cell-strong">{emp.totalSales}</div>
                        <div className="text-xs text-gray-500">transactions</div>
                      </td>
                      <td className="text-right">
                        <div className="cell-strong">{money(emp.totalRevenue)}</div>
                        <div className="text-xs text-gray-500">{revenuePercent.toFixed(1)}% of total</div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-medium text-gray-900">{money(emp.averageSale)}</div>
                        <div className="text-xs text-gray-500">per sale</div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {revenuePercent >= 30 ? (
                            <Badge variant="green">Excellent</Badge>
                          ) : revenuePercent >= 20 ? (
                            <Badge variant="blue">Good</Badge>
                          ) : revenuePercent >= 10 ? (
                            <Badge variant="amber">Average</Badge>
                          ) : (
                            <Badge variant="gray">Needs Improvement</Badge>
                          )}
                          {emp.totalRevenue > averageSaleValue * emp.totalSales && (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
