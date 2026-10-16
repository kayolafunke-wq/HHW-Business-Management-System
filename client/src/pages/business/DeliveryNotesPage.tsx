import { useState } from 'react'
import { Plus, Search, X, Printer, Download } from 'lucide-react'
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

interface DeliveryItem {
  productId: string
  name: string
  ordered: number
  delivered: number
  inStock: number
  supplyNow: number
  balanceAfter: number
}

interface DeliveryNote {
  id: string
  noteNo: string
  customer: string
  phone: string
  deliveryAddress: string
  reference: string
  driver: string
  date: string
  items: DeliveryItem[]
  status: 'Delivered' | 'Partial' | 'Pending'
  hasBalance: boolean
}

// Sample delivery notes
const SAMPLE_NOTES: DeliveryNote[] = []

// View Delivery Note Modal
function ViewDeliveryNoteModal({ note, onClose }: { note: DeliveryNote; onClose: () => void }) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const noteText = `
H.H WHOLESALERS
Area 4, Chilambura Road, Opposite Chipiku
Lilongwe, Malawi
+265 (0) 999 888 747 · hhw.malawi@gmail.com
VAT Reg. No. VAT-88214

========================
DELIVERY NOTE
========================

Note No: ${note.noteNo}
Date: ${fmtDateLong(note.date)}

Customer: ${note.customer}
Phone: ${note.phone}
Delivery Address: ${note.deliveryAddress}
Reference: ${note.reference}
Driver: ${note.driver}

Status: ${note.status}

------------------------
ITEMS DELIVERED
------------------------
${note.items.map(item => `${item.name}\n  Ordered: ${item.ordered}, Delivered: ${item.delivered}, Balance: ${item.balanceAfter}`).join('\n\n')}

========================

Goods received in good condition.
    `

    const blob = new Blob([noteText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `delivery-note-${note.noteNo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Delivery note downloaded')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">{note.noteNo}</div>
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
              <div className="font-display font-bold text-lg text-gray-900 mb-1">DELIVERY NOTE</div>
              <div className="text-sm font-semibold text-gray-900">{note.noteNo}</div>
              <div className="text-xs text-gray-500">{fmtDateLong(note.date)}</div>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="grid grid-2 gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">CUSTOMER</div>
              <div className="font-semibold text-sm text-gray-900">{note.customer}</div>
              <div className="text-xs text-gray-500">{note.phone}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">DELIVERY ADDRESS</div>
              <div className="text-sm text-gray-700">{note.deliveryAddress}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">REFERENCE</div>
              <div className="text-sm text-gray-700">{note.reference}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">DRIVER / VEHICLE</div>
              <div className="text-sm text-gray-700">{note.driver}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-center">Ordered</th>
                  <th className="text-center">Delivered</th>
                  <th className="text-center">Balance After</th>
                </tr>
              </thead>
              <tbody>
                {note.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="text-center">
                      <div className="text-sm text-gray-700">{item.ordered}</div>
                    </td>
                    <td className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{item.delivered}</div>
                    </td>
                    <td className="text-center">
                      <div className={`text-sm font-semibold ${item.balanceAfter > 0 ? 'text-amber-600' : 'text-gray-700'}`}>
                        {item.balanceAfter}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4">
              I confirm that the goods listed above have been received in good condition.
            </div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">CUSTOMER SIGNATURE</div>
                <div className="w-48 border-b border-gray-300 pb-1"></div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    note.status === 'Delivered'
                      ? 'success'
                      : note.status === 'Partial'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {note.status}
                </Badge>
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

// New Delivery Note Modal
function NewDeliveryNoteModal({ onClose, onCreated }: { onClose: () => void; onCreated: (note: DeliveryNote) => void }) {
  const { products } = useDataStore()
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [reference, setReference] = useState('')
  const [driver, setDriver] = useState('')
  const [items, setItems] = useState<DeliveryItem[]>([])

  // Add item
  const addItem = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const existing = items.find(i => i.productId === productId)
    if (!existing) {
      setItems([...items, {
        productId: product.id,
        name: product.name,
        ordered: 1,
        delivered: 0,
        inStock: product.stock,
        supplyNow: Math.min(1, product.stock),
        balanceAfter: 1 - Math.min(1, product.stock),
      }])
    }
  }

  // Update item quantity
  const updateQuantity = (productId: string, field: 'ordered' | 'supplyNow', value: number) => {
    setItems(items.map(i => {
      if (i.productId === productId) {
        const newItem = { ...i, [field]: value }
        if (field === 'ordered' || field === 'supplyNow') {
          newItem.balanceAfter = newItem.ordered - (newItem.delivered + newItem.supplyNow)
        }
        return newItem
      }
      return i
    }))
  }

  // Remove item
  const removeItem = (productId: string) => {
    setItems(items.filter(i => i.productId !== productId))
  }

  // Create delivery note
  const handleCreate = () => {
    if (!customer.trim()) {
      toast.error('Please enter customer name')
      return
    }
    if (items.length === 0) {
      toast.error('Please add at least one item')
      return
    }

    const hasBalance = items.some(i => i.balanceAfter > 0)
    const allDelivered = items.every(i => i.balanceAfter === 0)

    const note: DeliveryNote = {
      id: Date.now().toString(),
      noteNo: 'DN-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
      customer,
      phone,
      deliveryAddress,
      reference,
      driver,
      date: new Date().toISOString().split('T')[0],
      items: items.map(i => ({
        ...i,
        delivered: i.delivered + i.supplyNow,
      })),
      status: allDelivered ? 'Delivered' : hasBalance ? 'Partial' : 'Pending',
      hasBalance,
    }

    toast.success('Delivery note created successfully!')
    onCreated(note)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">New Delivery Note</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          {/* Customer Info */}
          <div className="grid grid-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Customer
              </label>
              <Input
                type="text"
                placeholder="Customer name"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
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
                Delivery Address
              </label>
              <Input
                type="text"
                placeholder="Delivery location"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Reference (PO / Quote)
              </label>
              <Input
                type="text"
                placeholder="e.g., PO-1234"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Driver / Vehicle
            </label>
            <Input
              type="text"
              placeholder="Driver name or vehicle"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
            />
          </div>

          <div className="divider"></div>

          {/* Add Item */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Add Ordered Item
            </label>
            <div className="flex gap-2">
              <select
                id="productSelect"
                className="input flex-1"
                defaultValue=""
              >
                <option value="" disabled>
                  {products.length > 0 
                    ? `${products[0].name} (stock: ${products[0].stock})`
                    : 'Select a product'}
                </option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} (stock: {product.stock})
                  </option>
                ))}
              </select>
              <Button
                onClick={() => {
                  const select = document.getElementById('productSelect') as HTMLSelectElement
                  if (select && select.value) {
                    addItem(select.value)
                    select.value = ''
                  }
                }}
              >
                + Add
              </Button>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-center">Ordered</th>
                  <th className="text-center">Delivered Before</th>
                  <th className="text-center">In Stock</th>
                  <th className="text-center">Supply Now</th>
                  <th className="text-center">Balance After</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="text-sm text-gray-500">Add the items the customer ordered.</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Supply Now defaults to what is in stock (never more than the customer still needs).
                        Anything left over is saved as a balance to deliver later.
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.productId}>
                      <td>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td>
                        <Input
                          type="number"
                          className="w-20 text-center"
                          value={item.ordered}
                          onChange={(e) => updateQuantity(item.productId, 'ordered', Number(e.target.value))}
                          min="0"
                        />
                      </td>
                      <td className="text-center">
                        <div className="text-sm text-gray-700">{item.delivered}</div>
                      </td>
                      <td className="text-center">
                        <div className="text-sm text-gray-700">{item.inStock}</div>
                      </td>
                      <td>
                        <Input
                          type="number"
                          className="w-20 text-center"
                          value={item.supplyNow}
                          onChange={(e) => updateQuantity(item.productId, 'supplyNow', Number(e.target.value))}
                          min="0"
                          max={Math.min(item.inStock, item.ordered - item.delivered)}
                        />
                      </td>
                      <td className="text-center">
                        <div className={`text-sm font-semibold ${item.balanceAfter > 0 ? 'text-amber-600' : 'text-gray-700'}`}>
                          {item.balanceAfter}
                        </div>
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

          {items.length > 0 && (
            <div className="text-xs text-gray-500 italic">
              Supply Now defaults to what is in stock (never more than the customer still needs). 
              Anything left over is saved as a balance to deliver later.
            </div>
          )}
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>
            Create Delivery Note
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DeliveryNotesPage() {
  const [notes, setNotes] = useState<DeliveryNote[]>(SAMPLE_NOTES)
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<DeliveryNote | null>(null)

  // Calculate KPIs
  const totalNotes = notes.length
  const ordersWithBalance = notes.filter(n => n.hasBalance).length
  const completedOrders = notes.filter(n => n.status === 'Delivered').length

  // Get orders waiting for balance
  const ordersWaitingBalance = notes.filter(n => n.hasBalance)

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(notes, 15)

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Delivery Notes</h1>
          <p className="page-sub">Track goods supplied and balances still owed to customers</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}>
          <Plus className="w-4 h-4" />
          New Delivery Note
        </Button>
      </div>

      {/* KPI Cards - 3 columns horizontal like prototype */}
      <div className="grid grid-3 gap-[18px] mb-5">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8eefd] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#2f5df5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Delivery Notes</div>
              <div className="text-2xl font-bold text-gray-900">{totalNotes}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fbf0dd] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#f59e0b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Orders With Balance</div>
              <div className="text-2xl font-bold text-gray-900">{ordersWithBalance}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e3f8f2] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#0ea885]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Completed Orders</div>
              <div className="text-2xl font-bold text-gray-900">{completedOrders}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders Waiting For Balance */}
      <Card className="mb-5">
        <div className="p-4 pb-0">
          <div className="font-semibold text-sm text-gray-900 mb-3">Orders Waiting For Balance</div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Still To Deliver</th>
              </tr>
            </thead>
            <tbody>
              {ordersWaitingBalance.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8">
                    <div className="text-sm text-gray-500">No outstanding balances</div>
                  </td>
                </tr>
              ) : (
                ordersWaitingBalance.map((note) => (
                  <tr key={note.id}>
                    <td>
                      <div className="cell-strong">{note.noteNo}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-700">{note.customer}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-700">
                        {note.items.filter(i => i.balanceAfter > 0).length} item(s)
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* All Delivery Notes */}
      <Card>
        <div className="p-4 pb-0">
          <div className="font-semibold text-sm text-gray-900 mb-3">All Delivery Notes</div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Note No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {notes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16">
                    <div className="text-sm font-semibold text-gray-700 mb-1">No delivery notes yet</div>
                    <div className="text-xs text-gray-500">Create one when goods leave for a customer.</div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((note) => (
                  <tr key={note.id}>
                    <td>
                      <div className="cell-strong">{note.noteNo}</div>
                    </td>
                    <td>
                      <div className="cell-sub">{fmtDateShort(note.date)}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-700">{note.customer}</div>
                    </td>
                    <td>
                      <div className="text-sm text-gray-700">{note.reference || 'N/A'}</div>
                    </td>
                    <td>
                      <Badge
                        variant={
                          note.status === 'Delivered'
                            ? 'success'
                            : note.status === 'Partial'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {note.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
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
      </Card>

      {/* New Delivery Note Modal */}
      {showNewModal && (
        <NewDeliveryNoteModal 
          onClose={() => setShowNewModal(false)}
          onCreated={(note) => {
            setNotes([note, ...notes])
            setSelectedNote(note)
          }}
        />
      )}

      {/* View Delivery Note Modal */}
      {selectedNote && (
        <ViewDeliveryNoteModal 
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  )
}
