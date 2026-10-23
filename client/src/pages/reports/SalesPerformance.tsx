import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useApiStore } from '@/store/apiStore'
import { TrendingUp, TrendingDown, Award, Users, DollarSign, ShoppingCart, Calendar } from 'lucide-react'
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
  LineChart,
  Line,
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
  const { sales, fetchSales } = useApiStore()
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [selectedYear, setSelectedYear] = useState<string>('2026')
  const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformance[]>([])

  // Fetch fresh data on component mount
  useEffect(() => {
    fetchSales()
  }, [])

  useEffect(() => {
    calculatePerformance()
  }, [sales, selectedMonth, selectedYear])

  const calculatePerformance = () => {
    // Filter sales by selected month and year
    let filteredSales = sales
    if (selectedMonth !== 'all') {
      const targetYear = parseInt(selectedYear)
      const currentDate = new Date()
      const targetMonth = selectedMonth === 'current' 
        ? currentDate.getMonth() 
        : parseInt(selectedMonth)
      
      filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.saleDate)
        return saleDate.getMonth() === targetMonth && saleDate.getFullYear() === targetYear
      })
    }

    // Group sales by cashier/employee
    const performanceMap = new Map<string, { totalSales: number; totalRevenue: number }>()

    filteredSales.forEach(sale => {
      // Use user.name instead of cashier field
      const cashierName = sale.user?.name || sale.cashier || 'Unknown'
      
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
          <button
            onClick={() => fetchSales()}
            className="px-4 py-2 bg-[#2f5df5] text-white rounded-lg text-sm font-medium hover:bg-[#2651d4] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
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
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
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
          <ResponsiveContainer width="100%" height={350}>
            <PieChart margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => money(value)} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value: string, entry: any) => (
                  <span className="text-xs font-medium text-gray-700">
                    {value}
                  </span>
                )}
              />
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
                <th style={{ width: '60px', textAlign: 'center' }}>Rank</th>
                <th>Employee</th>
                <th style={{ textAlign: 'right' }}>Total Sales</th>
                <th style={{ textAlign: 'right' }}>Total Revenue</th>
                <th style={{ textAlign: 'right' }}>Avg Sale Value</th>
                <th style={{ textAlign: 'right' }}>Performance</th>
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
                      <td style={{ textAlign: 'center' }}>
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
                      <td style={{ textAlign: 'right' }}>
                        <div className="cell-strong">{emp.totalSales}</div>
                        <div className="text-xs text-gray-500">transactions</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="cell-strong">{money(emp.totalRevenue)}</div>
                        <div className="text-xs text-gray-500">{revenuePercent.toFixed(1)}% of total</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
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

      {/* Monthly Performance Comparison */}
      <Card className="mt-5">
        <div className="mb-4">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-1">
            Monthly Performance Trend
          </h2>
          <p className="text-xs text-gray-500">
            Compare employee performance across the last 6 months
          </p>
        </div>

        <MonthlyComparisonTable sales={sales} />
      </Card>
    </div>
  )
}

// Monthly Comparison Component
function MonthlyComparisonTable({ sales }: { sales: any[] }) {
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    calculateMonthlyPerformance()
  }, [sales])

  const calculateMonthlyPerformance = () => {
    // Get last 6 months
    const months: string[] = []
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentDate = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      months.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`)
    }

    // Group sales by employee and month
    const employeeMonthlyMap = new Map<string, Map<string, { revenue: number; count: number }>>()

    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate)
      const monthKey = `${monthNames[saleDate.getMonth()]} ${saleDate.getFullYear()}`
      const employeeName = sale.user?.name || sale.cashier || 'Unknown'

      if (!employeeMonthlyMap.has(employeeName)) {
        employeeMonthlyMap.set(employeeName, new Map())
      }

      const employeeData = employeeMonthlyMap.get(employeeName)!
      if (!employeeData.has(monthKey)) {
        employeeData.set(monthKey, { revenue: 0, count: 0 })
      }

      const monthData = employeeData.get(monthKey)!
      monthData.revenue += sale.total
      monthData.count += 1
    })

    // Convert to table format
    const tableData: any[] = []
    employeeMonthlyMap.forEach((monthsMap, employee) => {
      const row: any = { employee }
      months.forEach(month => {
        const data = monthsMap.get(month) || { revenue: 0, count: 0 }
        row[month] = data
      })
      // Calculate total
      row.total = Array.from(monthsMap.values()).reduce((sum, data) => sum + data.revenue, 0)
      tableData.push(row)
    })

    // Sort by total revenue
    tableData.sort((a, b) => b.total - a.total)
    setMonthlyData(tableData)

    // Prepare chart data (revenue trend for top 3 employees)
    const top3 = tableData.slice(0, 3)
    const chartDataArray = months.map(month => {
      const dataPoint: any = { month: month.split(' ')[0] } // Just month name
      top3.forEach(emp => {
        dataPoint[emp.employee] = emp[month]?.revenue || 0
      })
      return dataPoint
    })
    setChartData(chartDataArray)
  }

  const getMonthColumns = () => {
    if (monthlyData.length === 0) return []
    const firstRow = monthlyData[0]
    return Object.keys(firstRow).filter(key => key !== 'employee' && key !== 'total')
  }

  const monthColumns = getMonthColumns()

  return (
    <>
      {/* Trend Chart */}
      {chartData.length > 0 && monthlyData.length > 0 && (
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number) => money(value)}
                contentStyle={{ fontSize: 12 }}
              />
              <Legend />
              {monthlyData.slice(0, 3).map((emp, index) => (
                <Line
                  key={emp.employee}
                  type="monotone"
                  dataKey={emp.employee}
                  stroke={COLORS[index]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Table */}
      <div className="data-table-wrapper" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>
                Employee
              </th>
              {monthColumns.map(month => (
                <th key={month} style={{ textAlign: 'right', minWidth: '120px' }}>
                  {month}
                </th>
              ))}
              <th style={{ textAlign: 'right', minWidth: '140px' }}>
                Total (6 months)
              </th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.length === 0 ? (
              <tr>
                <td colSpan={monthColumns.length + 2} className="text-center text-gray-500 py-8">
                  No sales data available
                </td>
              </tr>
            ) : (
              monthlyData.map((row, index) => (
                <tr key={row.employee}>
                  <td style={{ position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <div className="flex-shrink-0">
                          {index === 0 && <Award className="w-4 h-4 text-yellow-500" />}
                          {index === 1 && <Award className="w-4 h-4 text-gray-400" />}
                          {index === 2 && <Award className="w-4 h-4 text-orange-600" />}
                        </div>
                      )}
                      <div className="cell-strong">{row.employee}</div>
                    </div>
                  </td>
                  {monthColumns.map(month => {
                    const data = row[month]
                    const hasData = data && data.revenue > 0
                    return (
                      <td key={month} style={{ textAlign: 'right' }}>
                        {hasData ? (
                          <>
                            <div className="text-sm font-medium text-gray-900">
                              {money(data.revenue)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {data.count} {data.count === 1 ? 'sale' : 'sales'}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-400">-</div>
                        )}
                      </td>
                    )
                  })}
                  <td style={{ textAlign: 'right' }}>
                    <div className="cell-strong">{money(row.total)}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
