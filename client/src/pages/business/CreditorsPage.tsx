import { useState, useEffect } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Pagination, usePagination } from '@/components/ui/Pagination'
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

interface Payment {
  date: string
  amount: number
}

interface Creditor {
  id: string
  name: string
  phone: string
  reference: string
  date: string
  dueDate: string
  amount: number
  paid: number
  balance: number
  status: 'Overdue' | 'Outstanding' | 'Paid'
  payments: Payment[]
}

// Add Creditor Modal
function AddCreditorModal({ onClose, onCreated }: { onClose: () => void; onCreated: (creditor: Creditor) => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [reference, setReference] = useState('')
  const [amount, setAmount] = useState(0)
  const [alreadyPaid, setAlreadyPaid] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter creditor name')
      return
    }
    if (amount <= 0) {
      toast.error('Please enter amount')
      return
    }
    if (!dueDate) {
      toast.error('Please select due date')
      return
    }

    const balance = amount - alreadyPaid
    const creditor: Creditor = {
      id: Date.now().toString(),
      name,
      phone,
      reference,
      date,
      dueDate,
      amount,
      paid: alreadyPaid,
      balance,
      status: balance === 0 ? 'Paid' : new Date(dueDate) < new Date() ? 'Overdue' : 'Outstanding',
      payments: alreadyPaid > 0 ? [{ date, amount: alreadyPaid }] : [],
    }

    toast.success('Creditor added successfully!')
    onCreated(creditor)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Add Creditor</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-xs text-gray-600 mb-4">Creditor (who we owe)</p>

          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Supplier name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Phone</label>
              <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Reference</label>
              <Input
                type="text"
                placeholder="Invoice / description"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Amount (MK)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Already Paid (MK)</label>
              <Input
                type="number"
                value={alreadyPaid}
                onChange={(e) => setAlreadyPaid(Number(e.target.value))}
                min="0"
                max={amount}
              />
            </div>
          </div>

          <div className="grid grid-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

// Payment History Modal
function PaymentHistoryModal({ creditor, onClose }: { creditor: Creditor; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Payment History</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <div className="font-semibold text-sm text-gray-900">{creditor.name}</div>
            <div className="text-xs text-gray-500">
              {creditor.reference} · Total {money(creditor.amount)} · Balance {money(creditor.balance)}
            </div>
          </div>

          {creditor.payments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm text-gray-500">No payments yet.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {creditor.payments.map((payment, i) => (
                  <tr key={i}>
                    <td>
                      <div className="text-sm text-gray-700">{fmtDateShort(payment.date)}</div>
                    </td>
                    <td className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{money(payment.amount)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// Make Payment Modal
function MakePaymentModal({ creditor, onClose, onPaid }: { creditor: Creditor; onClose: () => void; onPaid: (creditorId: string, amount: number, date: string) => void }) {
  const [amount, setAmount] = useState(creditor.balance)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleRecord = () => {
    if (amount <= 0) {
      toast.error('Please enter amount')
      return
    }
    if (amount > creditor.balance) {
      toast.error('Amount cannot exceed balance')
      return
    }

    toast.success('Payment recorded successfully!')
    onPaid(creditor.id, amount, date)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Make Payment</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <div className="font-semibold text-sm text-gray-900">{creditor.name}</div>
            <div className="text-xs text-gray-500">Balance: {money(creditor.balance)}</div>
          </div>

          <div className="grid grid-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Amount Paid (MK)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
                max={creditor.balance}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRecord}>
            Record
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CreditorsPage() {
  const [creditors, setCreditors] = useState<Creditor[]>(() => {
    try {
      const saved = localStorage.getItem('hhw_creditors')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('hhw_creditors', JSON.stringify(creditors))
    } catch (e) {
      console.error('Failed to save creditors to storage', e)
    }
  }, [creditors])
  const [selectedCreditor, setSelectedCreditor] = useState<Creditor | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)

  // Calculate KPIs
  const totalWeOwe = creditors.reduce((sum, c) => sum + c.balance, 0)
  const overdueCreditors = creditors.filter(c => c.status === 'Overdue')
  const overdueCount = overdueCreditors.length
  const overdueAmount = overdueCreditors.reduce((sum, c) => sum + c.balance, 0)
  const creditorsCount = creditors.length

  // Filter creditors
  const filteredCreditors = creditors.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.reference.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(filteredCreditors, 15)

  // Handle make payment
  const handleMakePayment = (creditorId: string, amount: number, date: string) => {
    setCreditors(creditors.map(c => {
      if (c.id === creditorId) {
        const newPaid = c.paid + amount
        const newBalance = c.balance - amount
        return {
          ...c,
          paid: newPaid,
          balance: newBalance,
          status: newBalance === 0 ? 'Paid' : c.status,
          payments: [...c.payments, { date, amount }],
        }
      }
      return c
    }))
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Creditors</h1>
          <p className="page-sub">People and suppliers we owe money</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Creditor
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-3 gap-[18px] mb-5">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fbf0dd] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#f59e0b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total We Owe</div>
              <div className="text-xl font-bold text-gray-900">{money(totalWeOwe)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fbe9e7] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#c2372c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Overdue</div>
              <div className="text-xl font-bold text-gray-900">{overdueCount} · {money(overdueAmount)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#efeafb] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#6a4fd6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Creditors</div>
              <div className="text-2xl font-bold text-gray-900">{creditorsCount}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Creditors Table */}
      <Card>
        <div className="p-4 pb-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search name..."
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
                <th>Creditor</th>
                <th>Reference</th>
                <th>Due</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Paid</th>
                <th className="text-right">Balance</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((creditor) => (
                <tr key={creditor.id}>
                  <td>
                    <div className="text-sm font-semibold text-gray-900">{creditor.name}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">{creditor.reference}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">{fmtDateShort(creditor.dueDate)}</div>
                  </td>
                  <td className="text-right">
                    <div className="text-sm text-gray-700">{money(creditor.amount)}</div>
                  </td>
                  <td className="text-right">
                    <div className="text-sm text-gray-700">{money(creditor.paid)}</div>
                  </td>
                  <td className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{money(creditor.balance)}</div>
                  </td>
                  <td>
                    <Badge
                      style={
                        creditor.status === 'Overdue'
                          ? { background: '#fbe9e7', color: '#c2372c' }
                          : { background: '#fbf0dd', color: '#f59e0b' }
                      }
                    >
                      {creditor.status}
                    </Badge>
                  </td>
                  <td>
                    <button
                      style={{ 
                        background: '#2f5df5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: creditor.balance === 0 ? 'not-allowed' : 'pointer',
                        opacity: creditor.balance === 0 ? 0.5 : 1,
                      }}
                      onClick={() => {
                        if (creditor.balance > 0) {
                          setSelectedCreditor(creditor)
                          setShowPayModal(true)
                        }
                      }}
                      disabled={creditor.balance === 0}
                    >
                      Pay
                    </button>
                  </td>
                  <td>
                    <button
                      style={{ 
                        background: 'white',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        setSelectedCreditor(creditor)
                        setShowHistoryModal(true)
                      }}
                    >
                      History
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
      </Card>

      {/* Add Creditor Modal */}
      {showAddModal && (
        <AddCreditorModal
          onClose={() => setShowAddModal(false)}
          onCreated={(creditor) => setCreditors([creditor, ...creditors])}
        />
      )}

      {/* Payment History Modal */}
      {showHistoryModal && selectedCreditor && (
        <PaymentHistoryModal
          creditor={selectedCreditor}
          onClose={() => {
            setShowHistoryModal(false)
            setSelectedCreditor(null)
          }}
        />
      )}

      {/* Make Payment Modal */}
      {showPayModal && selectedCreditor && (
        <MakePaymentModal
          creditor={selectedCreditor}
          onClose={() => {
            setShowPayModal(false)
            setSelectedCreditor(null)
          }}
          onPaid={handleMakePayment}
        />
      )}
    </div>
  )
}
