import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { useDataStore } from '@/store/dataStore'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

function money(n: number): string {
  return (
    'MK ' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

// Sample data for fast selling products
const fastSellingData = [
  { name: 'Maize Flour 25kg', units: 284, revenue: 2139000, stock: 4, trend: 'up' },
  { name: 'Samsung 32" LED TV', units: 55, revenue: 14575000, stock: 14, trend: 'up' },
  { name: 'Toilet Tissue (Pack...', units: 48, revenue: 580800, stock: 29, trend: 'up' },
  { name: 'Rice 25kg Bag', units: 45, revenue: 1890000, stock: 8, trend: 'up' },
  { name: 'Smartphone Charger...', units: 44, revenue: 660000, stock: 32, trend: 'up' },
  { name: 'Iron Washing Liqu...', units: 41, revenue: 984000, stock: 18, trend: 'up' },
]

// Sample data for slow selling products
const slowSellingData = [
  { name: 'Office Stapler Heavy Duty', units: 20, revenue: 148000, stock: 11, trend: 'down' },
  { name: 'Coca-Cola 500ml (Crate of 24)', units: 23, revenue: 425500, stock: 26, trend: 'down' },
  { name: 'Salt 1kg (Pack of 10)', units: 24, revenue: 220800, stock: 0, trend: 'down' },
]

// Category mix data
const categoryData = [
  { name: 'Electronics', value: 5232800, color: '#2f5df5' },
  { name: 'Groceries', value: 2024800, color: '#0ea885' },
  { name: 'Beverages', value: 456800, color: '#f59e0b' },
  { name: 'Stationery', value: 107200, color: '#6a4fd6' },
  { name: 'Household', value: 577100, color: '#ec4899' },
  { name: 'Clothing', value: 220200, color: '#111827' },
]

export default function FastSlowMovers() {
  const { products } = useDataStore()
  const [activeTab, setActiveTab] = useState<'fast' | 'slow'>('fast')

  const displayData = activeTab === 'fast' ? fastSellingData : slowSellingData

  // Calculate total for category mix center
  const totalSales = categoryData.reduce((sum, cat) => sum + cat.value, 0)
  const formattedTotal = (totalSales / 1000000).toFixed(2) + 'M'

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
            <Badge style={{ background: '#e3f8f2', color: '#0ea885', fontSize: '11px', padding: '2px 8px' }}>
              Top 6
            </Badge>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fastSellingData} layout="vertical" margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 11, fill: '#6b7280' }} 
                  width={150}
                />
                <Bar dataKey="units" fill="#2f5df5" radius={[0, 4, 4, 0]} />
              </BarChart>
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
            </ResponsiveContainer>
            
            {/* Legend */}
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
              Fast Selling
            </button>
            <button
              className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                activeTab === 'slow'
                  ? 'text-[#2f5df5] border-[#2f5df5]'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('slow')}
            >
              Slow Selling
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th className="text-right">Units Sold</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Current Stock</th>
                <th className="text-right">Sales Trend</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((product, i) => (
                <tr key={i}>
                  <td>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="text-right">
                    <div className="text-sm text-gray-700">{product.units}</div>
                  </td>
                  <td className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{money(product.revenue)}</div>
                  </td>
                  <td className="text-right">
                    <div className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </div>
                  </td>
                  <td className="text-right">
                    <Badge
                      style={
                        product.trend === 'up'
                          ? { background: '#e3f8f2', color: '#0ea885' }
                          : { background: '#fbe9e7', color: '#c2372c' }
                      }
                    >
                      {product.trend === 'up' ? 'Trending Up' : 'Trending Down'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
