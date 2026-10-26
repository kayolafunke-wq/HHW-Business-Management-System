import { useState, useEffect } from 'react'
import { Plus, Search, Eye, X, Printer, Download } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Pagination, usePagination } from '@/components/ui/Pagination'
import { useDataStore } from '@/store/dataStore'
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

function fmtDateShort(dstr: string): string {
  const d = new Date(dstr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function fmtDateLong(dstr: string): string {
  const d = new Date(dstr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface QuotationItem {
  productId: string
  name: string
  price: number
  quantity: number
  total: number
}

interface Quotation {
  id: string
  quoteNo: string
  customer: string
  phone: string
  date: string
  validUntil: string
  items: QuotationItem[]
  subtotal: number
  discount: number
  vat: number
  total: number
  status: 'Sent' | 'Accepted' | 'Declined'
  notes: string
}

// View Quotation Modal
function ViewQuotationModal({ quotation, onClose }: { quotation: Quotation; onClose: () => void }) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const quoteText = `
H.H WHOLESALERS
Area 4, Chilambura Road, Opposite Chipiku
Lilongwe, Malawi
+265 (0) 999 888 747 · hhw.malawi@gmail.com
VAT Reg. No. VAT-88214

========================
QUOTATION
========================

Quote No: ${quotation.quoteNo}
Date: ${fmtDateLong(quotation.date)}
Valid Until: ${fmtDateLong(quotation.validUntil)}

Customer: ${quotation.customer}
Phone: ${quotation.phone}

Status: ${quotation.status}

------------------------
ITEMS
------------------------
${quotation.items.map(item => `${item.name}\n  ${item.quantity} x ${money(item.price)} = ${money(item.total)}`).join('\n\n')}

------------------------
TOTALS
------------------------
Subtotal:    ${money(quotation.subtotal)}
Discount:   -${money(quotation.discount)}
VAT (17.5%): ${money(quotation.vat)}
------------------------
TOTAL:       ${money(quotation.total)}
========================

Notes: ${quotation.notes || 'N/A'}

This quotation is valid until ${fmtDateLong(quotation.validUntil)}
    `

    const blob = new Blob([quoteText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quotation-${quotation.quoteNo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Quotation downloaded')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{quotation.quoteNo}</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          {/* Company Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 sm:gap-4 mb-5 sm:mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center sm:items-start gap-3 min-w-0">
              <img
                src="/hhw-logo.png"
                alt="HHW Logo"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-contain shadow-sm ring-1 ring-blue-500/30 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="font-display font-bold text-base text-gray-900 leading-tight">
                  H.H Wholesalers
                </div>
                <div className="text-xs text-gray-500 leading-tight mt-0.5">Area 4, Chilambura Road, Opposite Chipiku</div>
                <div className="text-xs text-gray-500 leading-tight">Lilongwe, Malawi</div>
                <div className="text-xs text-gray-500 leading-tight mt-0.5">+265 (0) 999 888 747 · hhw.malawi@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right pt-2.5 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex-shrink-0">
              <div className="font-display font-bold text-base sm:text-lg text-gray-900">QUOTATION</div>
              <div className="text-xs sm:text-sm font-semibold text-[#2f5df5] font-mono whitespace-nowrap">{quotation.quoteNo}</div>
              <div className="text-xs text-gray-500 whitespace-nowrap">{fmtDateLong(quotation.date)}</div>
            </div>
          </div>

          {/* Client & Validity Info */}
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">CLIENT</div>
              <div className="font-semibold text-sm text-gray-900">{quotation.customer}</div>
              <div className="text-xs text-gray-500">{quotation.phone}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 mb-2">VALID UNTIL</div>
              <div className="font-semibold text-sm text-gray-900">{fmtDateLong(quotation.validUntil)}</div>
              <Badge
                variant={
                  quotation.status === 'Accepted'
                    ? 'success'
                    : quotation.status === 'Sent'
                    ? 'default'
                    : 'default'
                }
              >
                {quotation.status}
              </Badge>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {quotation.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">{money(quotation.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-red-600">-{money(quotation.discount)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (17.5%)</span>
                <span className="font-semibold text-gray-900">{money(quotation.vat)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">{money(quotation.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quotation.notes && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-xs font-semibold text-gray-500 mb-2">NOTES / TERMS</div>
              <div className="text-sm text-gray-700">{quotation.notes}</div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <div className="text-sm text-gray-600">
              This quotation is valid until <span className="font-semibold">{fmtDateLong(quotation.validUntil)}</span>
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

// New Quotation Modal
function NewQuotationModal({ onClose, onCreated }: { onClose: () => void; onCreated: (quotation: Quotation) => void }) {
  const { products } = useDataStore()
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [notes, setNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [items, setItems] = useState<QuotationItem[]>([])
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

  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setItems(items.filter(i => i.productId !== productId))
      return
    }
    setItems(items.map(i => 
      i.productId === productId 
        ? { ...i, quantity: newQuantity, total: newQuantity * i.price }
        : i
    ))
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

  // Save quotation
  const handleSave = () => {
    if (!clientName.trim()) {
      toast.error('Please enter client name')
      return
    }
    if (!validUntil) {
      toast.error('Please select valid until date')
      return
    }
    if (items.length === 0) {
      toast.error('Please add at least one item')
      return
    }

    const quotation: Quotation = {
      id: Date.now().toString(),
      quoteNo: 'QT-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
      customer: clientName,
      phone,
      date: new Date().toISOString().split('T')[0],
      validUntil,
      items,
      subtotal,
      discount: discountAmount,
      vat,
      total,
      status: 'Sent',
      notes,
    }

    toast.success('Quotation created successfully!')
    onCreated(quotation)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">New Quotation</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          {/* Client Info */}
          <div className="grid grid-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Client Name
              </label>
              <Input
                type="text"
                placeholder="Walk-in / client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Phone
              </label>
              <Input
                type="text"
                placeholder="+265 99 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Valid Until
              </label>
              <Input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Notes / Terms
              </label>
              <Input
                type="text"
                placeholder="e.g., Delivery included"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Product Search */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Add Product
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <select
                  className="input w-full"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addItem(e.target.value)
                      e.target.value = ''
                    }
                  }}
                >
                  <option value="">Samsung 32" LED TV — MK 265,000</option>
                  {products.filter(p => p.stock > 0).map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} — {money(product.price)}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={() => {
                const select = document.querySelector('select') as HTMLSelectElement
                if (select && select.value) {
                  addItem(select.value)
                  select.value = ''
                }
              }}>
                + Add
              </Button>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="text-sm text-gray-500">No items added yet.</div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.productId}>
                      <td>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm text-gray-700">{money(item.price)}</div>
                      </td>
                      <td className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{money(item.total)}</div>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="w-6 h-6 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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

          <div className="divider"></div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
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
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">{money(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Quotation
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem('hhw_quotations')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem('hhw_quotations', JSON.stringify(quotations))
    } catch (e) {
      console.error('Failed to save quotations to storage', e)
    }
  }, [quotations])

  // Calculate KPIs
  const totalQuotations = quotations.length
  const awaitingAnswer = quotations.filter(q => q.status === 'Sent').length
  const accepted = quotations.filter(q => q.status === 'Accepted').length

  // Filter quotations
  const filteredQuotations = quotations.filter(q => 
    q.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.quoteNo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(filteredQuotations, 15)

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Quotations</h1>
          <p className="page-sub">Give clients a price before they buy</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}>
          <Plus className="w-4 h-4" />
          New Quotation
        </Button>
      </div>

      {/* KPI Cards - 3 columns horizontal */}
      <div className="grid grid-3 gap-[18px] mb-5">{/* Force refresh */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e8eefd] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#2f5df5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 2H8a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2Z"/>
                <path d="M9 8h6M9 12h6M9 16h4"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-0.5">Total Quotations</div>
              <div className="text-2xl font-bold text-gray-900">{totalQuotations}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#fbf0dd] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#f59e0b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-0.5">Awaiting Answer</div>
              <div className="text-2xl font-bold text-gray-900">{awaitingAnswer}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e3f8f2] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#0ea885]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-0.5">Accepted</div>
              <div className="text-2xl font-bold text-gray-900">{accepted}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Table */}
      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search customer or quote no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Quote No</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Valid Until</th>
                <th className="text-right">Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((quotation) => (
                <tr key={quotation.id}>
                  <td>
                    <div className="cell-strong">{quotation.quoteNo}</div>
                  </td>
                  <td>
                    <div className="cell-strong">{quotation.customer}</div>
                  </td>
                  <td>
                    <div className="cell-sub">{fmtDateShort(quotation.date)}</div>
                  </td>
                  <td>
                    <div className="cell-sub">{fmtDateShort(quotation.validUntil)}</div>
                  </td>
                  <td className="text-right">
                    <div className="cell-strong">{money(quotation.total)}</div>
                  </td>
                  <td>
                    <Badge
                      variant={
                        quotation.status === 'Accepted'
                          ? 'success'
                          : quotation.status === 'Sent'
                          ? 'default'
                          : 'default'
                      }
                    >
                      {quotation.status}
                    </Badge>
                  </td>
                  <td>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => setSelectedQuotation(quotation)}
                    >
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

        {filteredQuotations.length === 0 && (
          <div className="empty-state">
            <svg className="w-10 h-10 text-gray-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <div className="text-sm font-semibold text-gray-700 mb-1">No quotations found</div>
            <div className="text-xs text-gray-500">Try adjusting your search</div>
          </div>
        )}
      </Card>

      {/* New Quotation Modal */}
      {showNewModal && (
        <NewQuotationModal 
          onClose={() => setShowNewModal(false)}
          onCreated={(quotation) => {
            setQuotations([quotation, ...quotations])
            setSelectedQuotation(quotation)
          }}
        />
      )}

      {/* View Quotation Modal */}
      {selectedQuotation && (
        <ViewQuotationModal 
          quotation={selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
        />
      )}
    </div>
  )
}
