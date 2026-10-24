import { useState } from 'react'
import { Eye, Search, Plus, Download, X, Printer } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Pagination, usePagination } from '@/components/ui/Pagination'
import { useApiStore } from '@/store/apiStore'
import { useDataStore } from '@/store/dataStore'
import type { Sale } from '@/services/api'
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

function fmtDateLong(dstr: string): string {
  const d = new Date(dstr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface InvoiceItem {
  productId: string
  name: string
  price: number
  quantity: number
  total: number
}

interface CreatedInvoice {
  invoiceNo: string
  customer?: string
  customerName?: string
  phoneNumber: string
  date: string
  items: InvoiceItem[]
  subtotal: number
  discount: number
  vat: number
  total: number
  status: string
}

// View Invoice Modal
function ViewInvoiceModal({ invoice, onClose }: { invoice: Sale | CreatedInvoice; onClose: () => void }) {
  const { inventoryMovements } = useDataStore()
  
  // Get invoice number from either Sale or CreatedInvoice
  const isSale = 'saleDate' in invoice // Sale has saleDate, CreatedInvoice has date
  const invoiceNo = invoice.invoiceNo
  const customerName = invoice.customer || (invoice as CreatedInvoice).customerName
  const invoiceDate = isSale ? (invoice as Sale).saleDate.split('T')[0] : invoice.date
  
  // Find related inventory movements for this invoice
  const relatedMovements = inventoryMovements.filter(m => m.reference === invoiceNo)
  
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

Invoice No: ${invoiceNo}
Date: ${fmtDateLong(invoiceDate)}
Customer: ${customerName}
Status: ${isSale ? (invoice as Sale).paymentStatus : (invoice as CreatedInvoice).status}

------------------------
ITEMS
------------------------
${items && items.length > 0 ? 
  items.map(item => 
    `${isSale && item.product ? item.product.name : item.name}\n  ${item.quantity} x ${money(item.price)} = ${money(item.total)}`
  ).join('\n\n') : 
  'No items found'}

------------------------
TOTALS
------------------------
Subtotal:    ${money(invoice.subtotal)}
Discount:   -${money(invoice.discount || 0)}
VAT (17.5%): ${money(invoice.vat)}
------------------------
TOTAL:       ${money(invoice.total)}
========================

Thank you for your business!
    `

    const blob = new Blob([invoiceText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoiceNo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Invoice downloaded')
  }

  // Variables are already declared at component level (lines 52-54)
  const items = isSale ? (invoice as Sale).items : (invoice as CreatedInvoice).items

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{invoiceNo}</div>
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
              <div className="font-display font-bold text-lg text-gray-900 mb-1">INVOICE</div>
              <div className="text-sm font-semibold text-gray-900">
                {invoiceNo}
              </div>
              <div className="text-xs text-gray-500">{fmtDateLong(invoiceDate)}</div>
            </div>
          </div>

          {/* Billed To & Payment Status */}
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">BILLED TO</div>
              <div className="font-semibold text-sm text-gray-900">{customerName}</div>
              {!isSale && (invoice as CreatedInvoice).phoneNumber && (
                <div className="text-xs text-gray-500">{(invoice as CreatedInvoice).phoneNumber}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 mb-2">PAYMENT STATUS</div>
              <Badge
                variant={
                  (isSale ? (invoice as Sale).paymentStatus : (invoice as CreatedInvoice).status) === 'PAID' || 
                  (isSale ? (invoice as Sale).paymentStatus : (invoice as CreatedInvoice).status) === 'Paid'
                    ? 'success'
                    : 'warning'
                }
              >
                {isSale ? (invoice as Sale).paymentStatus : (invoice as CreatedInvoice).status}
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
                {items && items.length > 0 ? (
                  items.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div className="text-sm font-medium text-gray-900">
                          {isSale && item.product ? item.product.name : item.name}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="text-sm text-gray-700">{item.quantity}</div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm text-gray-700">{money(item.price)}</div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{money(item.total)}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="text-center text-sm text-gray-500 py-4">No items found</div>
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
                <span className="font-semibold text-gray-900">{money(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-gray-900">-{money(invoice.discount || 0)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (17.5%)</span>
                <span className="font-semibold text-gray-900">{money(invoice.vat)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">{money(invoice.total)}</span>
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
            Print Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}

// Create Invoice Modal
function CreateInvoiceModal({ onClose, onCreated }: { onClose: () => void; onCreated: (invoice: CreatedInvoice) => void }) {
  const { products } = useApiStore()
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [discount, setDiscount] = useState(0)

  // Filter products
  const filteredProducts = products
    .filter(p => 
      p.stock > 0 && 
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 10)

  // Add item
  const addItem = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const existing = items.find(i => i.productId === productId)
    if (existing) {
      setItems(items.map(i => 
        i.productId === productId 
          ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.price }
          : i
      ))
    } else {
      setItems([...items, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
      }])
    }
    setSearchQuery('')
  }

  // Remove item
  const removeItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId))
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const discountAmount = discount
  const vat = (subtotal - discountAmount) * 0.175
  const total = subtotal - discountAmount + vat

  // Generate invoice
  const handleGenerate = () => {
    if (!customerName.trim()) {
      toast.error('Please enter customer name')
      return
    }
    if (items.length === 0) {
      toast.error('Please add at least one item')
      return
    }

    const invoice: CreatedInvoice = {
      invoiceNo: 'INV-' + Math.floor(Math.random() * 10000),
      customerName,
      phoneNumber,
      date: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      discount: discountAmount,
      vat,
      total,
      status: 'Pending',
    }

    toast.success('Invoice created successfully!')
    onCreated(invoice)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Create Invoice</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-xs text-gray-600 mb-4">
            Use this for a client who just wants a bill or quote — it won't record a sale or reduce stock.
          </p>

          {/* Customer Info */}
          <div className="grid grid-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Customer Name
              </label>
              <Input
                type="text"
                placeholder="e.g. Chikondi Banda"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Phone Number
              </label>
              <Input
                type="text"
                placeholder="+265 99 000 0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Product Search */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search product to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && filteredProducts.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-gray-900">{money(product.price)}</div>
                      <button
                        onClick={() => addItem(product.id)}
                        className="text-xs font-semibold text-brand hover:text-brand-dark"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="mb-4">
            {items.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 2H8a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2Z"/>
                  <path d="M9 8h6M9 12h6M9 16h4"/>
                </svg>
                <div className="text-sm font-semibold text-gray-600 mb-1">No items added yet</div>
                <div className="text-xs text-gray-500">Search above and add the products or services to include.</div>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.quantity} × {money(item.price)}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">{money(item.total)}</div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="w-6 h-6 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="divider"></div>

          {/* Discount */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Discount (MK)
            </label>
            <Input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              min="0"
              max={subtotal}
            />
          </div>

          {/* Totals */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-semibold text-red-600">-{money(discountAmount)}</span>
            </div>
            <div className="divider !my-2"></div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">VAT (17.5%)</span>
              <span className="font-semibold text-gray-900">{money(vat)}</span>
            </div>
            <div className="divider !my-2"></div>
            <div className="flex justify-between">
              <span className="font-bold text-gray-900">Total Due</span>
              <span className="font-bold text-lg text-gray-900">{money(total)}</span>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerate}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 2H8a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2Z"/>
              <path d="M9 8h6M9 12h6M9 16h4"/>
            </svg>
            Generate Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function InvoicesList() {
  const { sales } = useApiStore()
  const { inventoryMovements } = useDataStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | CreatedInvoice | null>(null)

  // Use sales as invoices
  const invoices = sales

  // Calculate KPIs
  const totalInvoices = invoices.length
  const paidCount = invoices.filter(i => i.paymentStatus === 'PAID').length
  const pendingCount = invoices.filter(i => i.paymentStatus === 'PENDING').length
  const totalRevenue = invoices.reduce((sum, i) => sum + i.total, 0)

  // Filter invoices
  const filteredInvoices = invoices.filter(i => {
    const matchesSearch = i.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         i.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || i.paymentStatus === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(filteredInvoices, 15)

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-sub">Manage customer invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-4 mb-5">
        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#e8eefd]">
              <svg className="w-4 h-4 text-[#2f5df5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 2H8a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2Z"/>
                <path d="M9 8h6M9 12h6M9 16h4"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Total Invoices</div>
          <div className="kpi-value">{totalInvoices}</div>
        </Card>

        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#e3f8f2]">
              <svg className="w-4 h-4 text-[#0ea885]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Paid</div>
          <div className="kpi-value">{paidCount}</div>
        </Card>

        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#fbf0dd]">
              <svg className="w-4 h-4 text-[#c97a1a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Pending</div>
          <div className="kpi-value">{pendingCount}</div>
        </Card>

        <Card className="kpi">
          <div className="kpi-top">
            <div className="kpi-icon bg-[#efeafb]">
              <svg className="w-4 h-4 text-[#6a4fd6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <div className="kpi-label">Total Revenue</div>
          <div className="kpi-value">{money(totalRevenue)}</div>
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
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partially Paid">Partially Paid</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Mobile Connected Box Cards View - No Horizontal Scroll Needed */}
        <div className="md:hidden space-y-3 mb-4">
          {paginatedItems.map((invoice: any) => {
            const itemCount = Array.isArray(invoice.items) ? invoice.items.length : 0

            return (
              <div 
                key={invoice.id}
                className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-200 transition-colors"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {invoice.invoiceNo}
                  </span>
                  <Badge
                    variant={
                      invoice.paymentStatus === 'PAID'
                        ? 'success'
                        : invoice.paymentStatus === 'PENDING'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {invoice.paymentStatus === 'PAID' ? 'Paid' : invoice.paymentStatus === 'PENDING' ? 'Pending' : 'Partially Paid'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-gray-100 my-1">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Customer</span>
                    <span className="font-semibold text-gray-900 truncate block">{invoice.customer}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Date</span>
                    <span className="text-gray-600">{fmtDateLong(invoice.saleDate.split('T')[0])}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Items</span>
                    <span className="text-gray-700 font-medium">{itemCount} item(s)</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Subtotal (excl. VAT)</span>
                    <span className="text-gray-700 font-medium">{money(invoice.subtotal || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Total</span>
                    <span className="text-base font-bold text-gray-900">{money(invoice.total)}</span>
                  </div>
                  <button 
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Subtotal</th>
                <th>VAT</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((invoice: any) => {
                const itemCount = Array.isArray(invoice.items) ? invoice.items.length : 0
                
                return (
                <tr key={invoice.id}>
                  <td>
                    <div className="cell-strong">{invoice.invoiceNo}</div>
                  </td>
                  <td>
                    <div className="cell-strong">{invoice.customer}</div>
                  </td>
                  <td>
                    <div className="cell-sub">{fmtDateLong(invoice.saleDate.split('T')[0])}</div>
                  </td>
                  <td>
                    <div className="text-gray-700">{itemCount} item(s)</div>
                  </td>
                  <td>
                    <div className="text-gray-700">{money(invoice.subtotal || 0)}</div>
                  </td>
                  <td>
                    <div className="text-gray-700">{money(invoice.vat || 0)}</div>
                  </td>
                  <td>
                    <div className="cell-strong">{money(invoice.total)}</div>
                  </td>
                  <td>
                    <Badge
                      variant={
                        invoice.paymentStatus === 'PAID'
                          ? 'success'
                          : invoice.paymentStatus === 'PENDING'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {invoice.paymentStatus === 'PAID' ? 'Paid' : invoice.paymentStatus === 'PENDING' ? 'Pending' : 'Partially Paid'}
                    </Badge>
                  </td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedInvoice(invoice)}
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </td>
                </tr>
                )
              })}
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

        {filteredInvoices.length === 0 && (
          <div className="empty-state">
            <svg className="w-10 h-10 text-gray-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <div className="text-sm font-semibold text-gray-700 mb-1">No invoices found</div>
            <div className="text-xs text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}
      </Card>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <CreateInvoiceModal 
          onClose={() => setShowCreateModal(false)}
          onCreated={(invoice) => {
            setSelectedInvoice(invoice)
          }}
        />
      )}

      {/* View Invoice Modal */}
      {selectedInvoice && (
        <ViewInvoiceModal 
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  )
}
