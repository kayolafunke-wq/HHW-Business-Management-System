import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Search, X, Printer, Download } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Pagination, usePagination } from '@/components/ui/Pagination'
import { useApiStore } from '@/store/apiStore'
import toast from 'react-hot-toast'

// Define Sale type from API
interface Sale {
  id: string
  invoiceNo: string
  customer: string
  customerPhone?: string
  saleDate: string // API uses saleDate
  items: any[] // API returns array of SaleItem objects
  subtotal: number
  vat: number
  total: number
  paymentMethod: 'CASH' | 'BANK' | 'MOBILE_MONEY'
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'PENDING' // API uses paymentStatus
  cashier: string
}

function money(n: number): string {
  return (
    'MK ' +
    Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  )
}

function fmtDateLong(dstr?: string): string {
  if (!dstr) return 'N/A'
  const d = new Date(dstr)
  if (isNaN(d.getTime())) return dstr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Invoice Modal Component
function InvoiceModal({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create a simple text invoice
    const invoiceText = `
H.H WHOLESALERS
Area 4, Chilambura Road, Opposite Chipiku
Lilongwe, Malawi
+265 (0) 999 888 747 · hhw.malawi@gmail.com
VAT Reg. No. VAT-88214

========================
INVOICE
========================

Invoice No: ${sale.invoiceNo}
Date: ${fmtDateLong(sale.saleDate)}
Customer: ${sale.customer}
Cashier: ${sale.cashier}
Payment: ${sale.paymentMethod}
Status: ${sale.paymentStatus}

------------------------
TOTALS
------------------------
Subtotal:    ${money(sale.subtotal)}
VAT (17.5%): ${money(sale.vat)}
------------------------
TOTAL:       ${money(sale.total)}
========================

Thank you for your business!
    `

    const blob = new Blob([invoiceText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${sale.invoiceNo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Invoice downloaded')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{sale.invoiceNo}</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          {/* Company Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2f5df5] to-[#6a4fd6] flex items-center justify-center font-display font-bold text-white text-lg">
                H
              </div>
              <div>
                <div className="font-display font-semibold text-base text-gray-900">
                  H.H Wholesalers
                </div>
                <div className="text-xs text-gray-500">Area 4, Chilambura Road, Opposite Chipiku</div>
                <div className="text-xs text-gray-500">Lilongwe, Malawi</div>
                <div className="text-xs text-gray-500">+265 (0) 999 888 747 · hhw.malawi@gmail.com</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-bold text-lg text-gray-900 mb-1">RECEIPT</div>
              <div className="text-sm font-semibold text-gray-900">{sale.invoiceNo}</div>
              <div className="text-xs text-gray-500">{fmtDateLong(sale.saleDate)}</div>
            </div>
          </div>

          {/* Billed To & Payment Status */}
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">BILLED TO</div>
              <div className="font-semibold text-sm text-gray-900">{sale.customer}</div>
              <div className="text-xs text-gray-500">+265 998833551</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 mb-2">PAYMENT STATUS</div>
              <Badge
                variant={
                  sale.paymentStatus === 'PAID'
                    ? 'green'
                    : sale.paymentStatus === 'PENDING'
                    ? 'amber'
                    : 'gray'
                }
              >
                {sale.paymentStatus}
              </Badge>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td>
                        <div className="text-sm font-medium text-gray-900">
                          {item.product?.name || item.productName || 'Product'}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="text-sm text-gray-700">{item.quantity}</div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm text-gray-700">{money(item.price)}</div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {money(item.total)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-4">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">{money(sale.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-gray-900">-{money(0)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (17.5%)</span>
                <span className="font-semibold text-gray-900">{money(sale.vat)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">{money(sale.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SalesList() {
  const navigate = useNavigate()
  const { sales } = useApiStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  // Calculate KPIs
  const todaySalesData = sales.filter(s => {
    const today = new Date().toISOString().split('T')[0]
    const saleDay = s.saleDate ? s.saleDate.split('T')[0] : ''
    return saleDay === today
  })
  const todayRevenue = todaySalesData.reduce((sum, s) => sum + s.total, 0)
  const totalTransactions = sales.length
  const outstandingCount = sales.filter(s => s.paymentStatus === 'PENDING' || s.paymentStatus === 'PARTIALLY_PAID').length

  // Filter sales
  const filteredSales = sales.filter(s => {
    const matchesSearch = s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         s.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || s.paymentStatus === statusFilter
    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    // Sort by date descending (newest first), then by ID descending
    const dateCompare = b.saleDate.localeCompare(a.saleDate)
    if (dateCompare !== 0) return dateCompare
    return b.id.localeCompare(a.id)
  })

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(filteredSales, 15)

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Sales</h1>
          <p className="page-sub">All completed and pending transactions</p>
        </div>
        <Button onClick={() => navigate('/sales/create')}>
          <Plus className="w-4 h-4" />
          New Sale
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid mb-5" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#e3f8f2]">
              <svg className="w-4 h-4 text-[#0ea885]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Today's Sales</div>
          <div className="kpi-value">{money(todayRevenue)}</div>
        </Card>

        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#e8eefd]">
              <svg className="w-4 h-4 text-[#2f5df5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 2-1.58l1.65-7.42H5.12"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Total Transactions</div>
          <div className="kpi-value">{totalTransactions}</div>
        </Card>

        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#fbf0dd]">
              <svg className="w-4 h-4 text-[#c97a1a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 2H8a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2Z"/>
                <path d="M9 8h6M9 12h6M9 16h4"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Outstanding</div>
          <div className="kpi-value">{outstandingCount}</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="toolbar">
          <div className="toolbar-left">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search customer or invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              className="input filter-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            {filteredSales.length} transaction{filteredSales.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Mobile Connected Box Cards View - No Horizontal Scroll Needed */}
        <div className="md:hidden space-y-3 mb-4">
          {paginatedItems.map((sale) => (
            <div 
              key={sale.id}
              className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {sale.invoiceNo}
                </span>
                <Badge
                  variant={
                    sale.paymentStatus === 'PAID'
                      ? 'green'
                      : sale.paymentStatus === 'PENDING'
                      ? 'amber'
                      : 'gray'
                  }
                >
                  {sale.paymentStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-gray-100 my-1">
                <div>
                  <span className="text-gray-400 block text-[10px]">Customer</span>
                  <span className="font-semibold text-gray-900 truncate block">{sale.customer}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Date</span>
                  <span className="text-gray-600">{fmtDateLong(sale.saleDate)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Items</span>
                  <span className="text-gray-700 font-medium">{sale.items.length} item(s)</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Payment Method</span>
                  <span className="text-gray-700 font-medium">{sale.paymentMethod}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] text-gray-400 block">Total Amount</span>
                  <span className="text-base font-bold text-gray-900">{money(sale.total)}</span>
                </div>
                <button 
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  onClick={() => setSelectedSale(sale)}
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Method</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((sale) => (
                <tr key={sale.id}>
                  <td>
                    <div className="cell-strong">{sale.invoiceNo}</div>
                  </td>
                  <td>
                    <div className="cell-strong">{sale.customer}</div>
                  </td>
                  <td>
                    <div className="cell-sub">{fmtDateLong(sale.saleDate)}</div>
                  </td>
                  <td>
                    <div className="text-gray-700">{sale.items.length} item(s)</div>
                  </td>
                  <td>
                    <div className="text-gray-700">{sale.paymentMethod}</div>
                  </td>
                  <td>
                    <div className="cell-strong">{money(sale.total)}</div>
                  </td>
                  <td>
                    <Badge
                      variant={
                        sale.paymentStatus === 'PAID'
                          ? 'green'
                          : sale.paymentStatus === 'PENDING'
                          ? 'amber'
                          : 'gray'
                      }
                    >
                      {sale.paymentStatus}
                    </Badge>
                  </td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />

        {filteredSales.length === 0 && (
          <div className="empty-state">
            <svg className="w-10 h-10 text-gray-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <div className="text-sm font-semibold text-gray-700 mb-1">No sales found</div>
            <div className="text-xs text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}
      </Card>

      {/* Invoice Modal */}
      {selectedSale && (
        <InvoiceModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
      )}
    </div>
  )
}
