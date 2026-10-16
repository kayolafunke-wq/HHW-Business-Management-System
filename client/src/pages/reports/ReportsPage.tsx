import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { 
  FileText, 
  Download, 
  Printer,
  TrendingUp,
  Package,
  Users,
  BarChart3,
  Calendar
} from 'lucide-react'
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

// Sample data for different reports
const salesData = [
  { date: '09-29', sales: 520000 },
  { date: '10-01', sales: 625000 },
  { date: '10-03', sales: 520000 },
  { date: '10-05', sales: 495000 },
  { date: '10-07', sales: 605000 },
  { date: '10-09', sales: 640000 },
  { date: '10-11', sales: 605000 },
  { date: '10-12', sales: 575000 },
]

const inventoryByCategory = [
  { name: 'Electronics', value: 5232600, color: '#2f5df5' },
  { name: 'Groceries', value: 2024800, color: '#0ea885' },
  { name: 'Beverages', value: 556800, color: '#c97a1a' },
  { name: 'Stationery', value: 1077000, color: '#6a4fd6' },
  { name: 'Household', value: 577100, color: '#c2372c' },
  { name: 'Clothing', value: 220200, color: '#9333ea' },
]

const stockMovementData = [
  { date: '10-01', stockIn: 8, stockOut: 15 },
  { date: '10-02', stockIn: 12, stockOut: 10 },
  { date: '10-03', stockIn: 5, stockOut: 18 },
  { date: '10-04', stockIn: 9, stockOut: 14 },
  { date: '10-05', stockIn: 7, stockOut: 16 },
  { date: '10-06', stockIn: 15, stockOut: 22 },
  { date: '10-07', stockIn: 11, stockOut: 19 },
  { date: '10-08', stockIn: 6, stockOut: 12 },
  { date: '10-09', stockIn: 13, stockOut: 18 },
  { date: '10-10', stockIn: 10, stockOut: 14 },
  { date: '10-11', stockIn: 8, stockOut: 9 },
  { date: '10-12', stockIn: 14, stockOut: 11 },
]

const businessPerformanceData = [
  { date: '09-29', revenue: 520000, profit: 135000 },
  { date: '10-01', revenue: 625000, profit: 160000 },
  { date: '10-03', revenue: 520000, profit: 130000 },
  { date: '10-05', revenue: 495000, profit: 127000 },
  { date: '10-07', revenue: 605000, profit: 155000 },
  { date: '10-09', revenue: 640000, profit: 165000 },
  { date: '10-11', revenue: 605000, profit: 155000 },
  { date: '10-12', revenue: 575000, profit: 147000 },
]

const invoiceStatusData = [
  { name: 'Paid', value: 107, color: '#0ea885' },
  { name: 'Partially Paid', value: 32, color: '#c97a1a' },
  { name: 'Pending', value: 13, color: '#6a4fd6' },
]

// Sales Performance by Employee
const salesPerformanceData = [
  { name: 'Chikondi Mvula', sales: 45, revenue: 2450000, avg: 54444 },
  { name: 'Grace Mwale', sales: 38, revenue: 1980000, avg: 52105 },
  { name: 'John Banda', sales: 29, revenue: 1520000, avg: 52414 },
  { name: 'Walk-in Customer', sales: 12, revenue: 580000, avg: 48333 },
]

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('sales')
  const [fromDate, setFromDate] = useState('2026-09-12')
  const [toDate, setToDate] = useState('2026-10-12')
  const [category, setCategory] = useState('All')

  const handleGenerateReport = () => {
    alert('Generating report...')
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    alert('Exporting report to PDF...')
  }

  const renderReportContent = () => {
    switch (activeReport) {
      case 'sales':
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesData}>
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
                  dataKey="sales" 
                  stroke="#2f5df5" 
                  strokeWidth={2}
                  fill="url(#colorSales)"
                  dot={{ fill: '#2f5df5', r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="text-sm font-medium text-[#2f5df5]">INV-1023</div></td>
                  <td><div className="text-sm text-gray-900">Grace Phiri</div></td>
                  <td><div className="text-sm text-gray-700">Oct 10, 2026</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 180,000</div></td>
                  <td><span className="badge badge-green">Paid</span></td>
                </tr>
                <tr>
                  <td><div className="text-sm font-medium text-[#2f5df5]">INV-1022</div></td>
                  <td><div className="text-sm text-gray-900">James Zulu</div></td>
                  <td><div className="text-sm text-gray-700">Oct 09, 2026</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 425,500</div></td>
                  <td><span className="badge badge-green">Paid</span></td>
                </tr>
                <tr>
                  <td><div className="text-sm font-medium text-[#2f5df5]">INV-1021</div></td>
                  <td><div className="text-sm text-gray-900">Walk-in Customer</div></td>
                  <td><div className="text-sm text-gray-700">Oct 08, 2026</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 156,800</div></td>
                  <td><span className="badge badge-green">Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )

      case 'sales-performance':
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f4" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#9aa3b2' }}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [money(value), 'Revenue']
                    return [value, 'Sales Count']
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th className="text-right">Total Sales</th>
                  <th className="text-right">Total Revenue</th>
                  <th className="text-right">Avg Sale Value</th>
                  <th className="text-right">Performance</th>
                </tr>
              </thead>
              <tbody>
                {salesPerformanceData.map((emp, index) => {
                  const totalRevenue = salesPerformanceData.reduce((sum, e) => sum + e.revenue, 0)
                  const revenuePercent = (emp.revenue / totalRevenue) * 100
                  return (
                    <tr key={emp.name}>
                      <td>
                        <div className="flex items-center gap-2">
                          {index === 0 && <span className="text-yellow-500">🏆</span>}
                          {index === 1 && <span className="text-gray-400">🥈</span>}
                          {index === 2 && <span className="text-orange-600">🥉</span>}
                          <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{emp.sales}</div>
                        <div className="text-xs text-gray-500">transactions</div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{money(emp.revenue)}</div>
                        <div className="text-xs text-gray-500">{revenuePercent.toFixed(1)}% of total</div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm text-gray-900">{money(emp.avg)}</div>
                      </td>
                      <td className="text-right">
                        {revenuePercent >= 30 ? (
                          <span className="badge badge-green">Excellent</span>
                        ) : revenuePercent >= 20 ? (
                          <span className="badge badge-blue">Good</span>
                        ) : revenuePercent >= 10 ? (
                          <span className="badge badge-amber">Average</span>
                        ) : (
                          <span className="badge badge-gray">Needs Improvement</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )

      case 'inventory':
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={inventoryByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {inventoryByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => money(value)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap justify-center gap-4 text-xs">
              {inventoryByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }}></div>
                  <span className="text-gray-600">{cat.name} ({money(cat.value)})</span>
                </div>
              ))}
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Stock Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="text-sm font-medium text-gray-900">Samsung 32" LED TV</div></td>
                  <td><div className="text-sm text-gray-700">Electronics</div></td>
                  <td><div className="text-sm text-gray-900">12</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 2,520,000</div></td>
                  <td><span className="badge badge-green">In Stock</span></td>
                </tr>
                <tr>
                  <td><div className="text-sm font-medium text-gray-900">Cooking Oil 5L</div></td>
                  <td><div className="text-sm text-gray-700">Groceries</div></td>
                  <td><div className="text-sm text-gray-900">68</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 1,428,000</div></td>
                  <td><span className="badge badge-green">In Stock</span></td>
                </tr>
                <tr>
                  <td><div className="text-sm font-medium text-gray-900">Maize Flour 25kg</div></td>
                  <td><div className="text-sm text-gray-700">Groceries</div></td>
                  <td><div className="text-sm text-gray-900">4</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 98,000</div></td>
                  <td><span className="badge badge-amber">Low Stock</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )

      case 'stock-movement':
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stockMovementData}>
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
                />
                <Tooltip 
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #e6e9ef',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar dataKey="stockIn" name="Stock In" fill="#0ea885" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stockOut" name="Stock Out" fill="#c2372c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Ref</th>
                  <th>Type</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="text-sm font-medium text-[#2f5df5]">PO-5678</div></td>
                  <td><span className="badge badge-green">Stock In</span></td>
                  <td><div className="text-sm text-gray-900">Cooking Oil 5L</div></td>
                  <td><div className="text-sm font-semibold text-[#0ea885]">+50</div></td>
                  <td><div className="text-sm text-gray-700">Oct 10, 2026</div></td>
                </tr>
                <tr>
                  <td><div className="text-sm font-medium text-[#2f5df5]">SALE-1234</div></td>
                  <td><span className="badge badge-amber">Stock Out</span></td>
                  <td><div className="text-sm text-gray-900">Samsung 32" LED TV</div></td>
                  <td><div className="text-sm font-semibold text-[#c97a1a]">-2</div></td>
                  <td><div className="text-sm text-gray-700">Oct 10, 2026</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        )

      case 'business-performance':
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={businessPerformanceData}>
                <defs>
                  <linearGradient id="colorRevenue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2f5df5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2f5df5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit2" x1="0" y1="0" x2="0" y2="1">
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
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconType="circle"
                />
                <Area 
                  type="linear" 
                  dataKey="revenue" 
                  name="Net Revenue"
                  stroke="#2f5df5" 
                  strokeWidth={2}
                  fill="url(#colorRevenue2)"
                  dot={{ fill: '#2f5df5', r: 4, strokeWidth: 0 }}
                />
                <Area 
                  type="linear" 
                  dataKey="profit" 
                  name="Profit"
                  stroke="#0ea885" 
                  strokeWidth={2}
                  fill="url(#colorProfit2)"
                  dot={{ fill: '#0ea885', r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[#2f5df5]" />
                  <div className="text-xs text-gray-500">Revenue (MTD)</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{money(7451005)}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-[#6a4fd6]" />
                  <div className="text-xs text-gray-500">Stock Value</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{money(9682700)}</div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#0ea885]" />
                  <div className="text-xs text-gray-500">Active Staff</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">11</div>
              </Card>
            </div>
          </div>
        )

      case 'invoice':
        return (
          <div className="space-y-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap justify-center gap-4 text-xs">
              {invoiceStatusData.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: status.color }}></div>
                  <span className="text-gray-600">{status.name} ({status.value})</span>
                </div>
              ))}
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="text-sm font-medium text-[#2f5df5]">INV-1023</div></td>
                  <td><div className="text-sm text-gray-900">Grace Phiri</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 180,000</div></td>
                  <td><span className="badge badge-green">Paid</span></td>
                </tr>
                <tr>
                  <td><div className="text-sm font-medium text-[#2f5df5]">INV-1022</div></td>
                  <td><div className="text-sm text-gray-900">James Zulu</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 425,500</div></td>
                  <td><span className="badge badge-green">Paid</span></td>
                </tr>
                <tr>
                  <td><div className="text-sm font-medium text-[#2f5df5]">INV-1020</div></td>
                  <td><div className="text-sm text-gray-900">Thoko Mwale</div></td>
                  <td><div className="text-sm font-semibold text-gray-900">MK 95,000</div></td>
                  <td><span className="badge badge-amber">Partially Paid</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <div className="text-sm font-medium">Select a report type to view data</div>
          </div>
        )
    }
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-sub">Generate and export business reports</p>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="mb-4">
        <div className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="field" style={{ minWidth: '140px' }}>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">From Date</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="field" style={{ minWidth: '140px' }}>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">To Date</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="field" style={{ minWidth: '140px' }}>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Category</label>
              <select
                className="input w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Electronics">Electronics</option>
                <option value="Groceries">Groceries</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <Button onClick={handleGenerateReport}>
              <FileText className="w-4 h-4" />
              Generate
            </Button>

            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
              Print
            </Button>

            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Tabs and Content */}
      <Card>
        {/* Report Type Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 px-4 pt-4">
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'sales'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('sales')}
          >
            Sales
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'sales-performance'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('sales-performance')}
          >
            Sales Performance
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'inventory'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('inventory')}
          >
            Inventory
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'stock-movement'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('stock-movement')}
          >
            Stock Movement
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'fast-moving'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('fast-moving')}
          >
            Fast Moving
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'slow-moving'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('slow-moving')}
          >
            Slow Moving
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'employee-attendance'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('employee-attendance')}
          >
            Attendance
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'employee-performance'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('employee-performance')}
          >
            Performance
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'invoice'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('invoice')}
          >
            Invoice
          </button>
          <button
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeReport === 'business-performance'
                ? 'text-[#2f5df5] border-[#2f5df5]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => setActiveReport('business-performance')}
          >
            Business
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 px-4 py-2 border-b border-gray-200">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Report Content */}
        <div className="p-4">
          {renderReportContent()}
        </div>
      </Card>
    </div>
  )
}
