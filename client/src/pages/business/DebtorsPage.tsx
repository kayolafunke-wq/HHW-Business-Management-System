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

interface Debtor {
  id: string
  name: string
  phone: string
  reference: string
  date: string
  dueDate: string
  amount: number
  paid: number
  balance: number
  status: 'Overdue' | 'Part Paid' | 'Paid'
  payments: Payment[]
}

// Add Debtor Modal
function AddDebtorModal({ onClose, onCreated }: { onClose: () => void; onCreated: (debtor: Debtor) => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [reference, setReference] = useState('')
  const [amount, setAmount] = useState(0)
  const [alreadyPaid, setAlreadyPaid] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Please enter debtor name')
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
    const debtor: Debtor = {
      id: Date.now().toString(),
      name,
      phone,
      reference,
      date,
      dueDate,
      amount,
      paid: alreadyPaid,
      balance,
      status: balance === 0 ? 'Paid' : alreadyPaid > 0 ? 'Part Paid' : new Date(dueDate) < new Date() ? 'Overdue' : 'Part Paid',
      payments: alreadyPaid > 0 ? [{ date, amount: alreadyPaid }] : [],
    }

    toast.success('Debtor added successfully!')
    onCreated(debtor)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Add Debtor</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <p className="text-xs text-gray-600 mb-4">Debtor (who owes us)</p>

          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Name</label>
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
function PaymentHistoryModal({ debtor, onClose }: { debtor: Debtor; onClose: () => void }) {
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
            <div className="font-semibold text-sm text-gray-900">{debtor.name}</div>
            <div className="text-xs text-gray-500">
              {debtor.reference} · Total {money(debtor.amount)} · Balance {money(debtor.balance)}
            </div>
          </div>

          {debtor.payments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-sm text-gray-500">No payments yet</div>
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
                {debtor.payments.map((payment, i) => (
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

// Receive Payment Modal
function ReceivePaymentModal({ debtor, onClose, onReceived }: { debtor: Debtor; onClose: () => void; onReceived: (debtorId: string, amount: number, date: string) => void }) {
  const [amount, setAmount] = useState(debtor.balance)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleRecord = () => {
    if (amount <= 0) {
      toast.error('Please enter amount')
      return
    }
    if (amount > debtor.balance) {
      toast.error('Amount cannot exceed balance')
      return
    }

    toast.success('Payment recorded successfully!')
    onReceived(debtor.id, amount, date)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Receive Payment</div>
          <button onClick={onClose} className="icon-btn">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="modal-body">
          <div className="mb-4">
            <div className="font-semibold text-sm text-gray-900">{debtor.name}</div>
            <div className="text-xs text-gray-500">Balance: {money(debtor.balance)}</div>
          </div>

          <div className="grid grid-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                Amount Received (MK)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
                max={debtor.balance}
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

export default function DebtorsPage() {
  const [debtors, setDebtors] = useState<Debtor[]>(() => {
    try {
      const saved = localStorage.getItem('hhw_debtors')
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
      localStorage.setItem('hhw_debtors', JSON.stringify(debtors))
    } catch (e) {
      console.error('Failed to save debtors to storage', e)
    }
  }, [debtors])
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showReceiveModal, setShowReceiveModal] = useState(false)

  // Calculate KPIs
  const totalOwed = debtors.reduce((sum, d) => sum + d.balance, 0)
  const overdueDebtors = debtors.filter(d => d.status === 'Overdue')
  const overdueCount = overdueDebtors.length
  const overdueAmount = overdueDebtors.reduce((sum, d) => sum + d.balance, 0)
  const debtorsCount = debtors.length

  // Filter debtors
  const filteredDebtors = debtors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.reference.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const { currentPage, totalPages, paginatedItems, setCurrentPage, totalItems, itemsPerPage } = usePagination(filteredDebtors, 15)

  // Handle receive payment
  const handleReceivePayment = (debtorId: string, amount: number, date: string) => {
    setDebtors(debtors.map(d => {
      if (d.id === debtorId) {
        const newPaid = d.paid + amount
        const newBalance = d.balance - amount
        return {
          ...d,
          paid: newPaid,
          balance: newBalance,
          status: newBalance === 0 ? 'Paid' : 'Part Paid',
          payments: [...d.payments, { date, amount }],
        }
      }
      return d
    }))
  }

  return (
    <div className="fade-in">
      <div className="page-head">
        <div>
          <h1 className="page-title">Debtors</h1>
          <p className="page-sub">People who owe us money</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          Add Debtor
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-3 gap-[18px] mb-5">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e3f8f2] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#0ea885]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Owed To Us</div>
              <div className="text-xl font-bold text-gray-900">{money(totalOwed)}</div>
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
              <div className="text-xs text-gray-500 mb-1">Debtors</div>
              <div className="text-2xl font-bold text-gray-900">{debtorsCount}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Debtors Table */}
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
                <th>Debtor</th>
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
              {paginatedItems.map((debtor) => (
                <tr key={debtor.id}>
                  <td>
                    <div className="text-sm font-semibold text-gray-900">{debtor.name}</div>
                    <div className="text-xs text-gray-500">{debtor.phone}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">{debtor.reference}</div>
                  </td>
                  <td>
                    <div className="text-sm text-gray-700">{fmtDateShort(debtor.dueDate)}</div>
                  </td>
                  <td className="text-right">
                    <div className="text-sm text-gray-700">{money(debtor.amount)}</div>
                  </td>
                  <td className="text-right">
                    <div className="text-sm text-gray-700">{money(debtor.paid)}</div>
                  </td>
                  <td className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{money(debtor.balance)}</div>
                  </td>
                  <td>
                    <Badge
                      variant={
                        debtor.status === 'Paid'
                          ? 'success'
                          : debtor.status === 'Overdue'
                          ? 'default'
                          : 'default'
                      }
                      style={
                        debtor.status === 'Overdue'
                          ? { background: '#fbe9e7', color: '#c2372c' }
                          : debtor.status === 'Part Paid'
                          ? { background: '#e8eefd', color: '#2f5df5' }
                          : undefined
                      }
                    >
                      {debtor.status}
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
                        cursor: debtor.balance === 0 ? 'not-allowed' : 'pointer',
                        opacity: debtor.balance === 0 ? 0.5 : 1,
                      }}
                      onClick={() => {
                        if (debtor.balance > 0) {
                          setSelectedDebtor(debtor)
                          setShowReceiveModal(true)
                        }
                      }}
                      disabled={debtor.balance === 0}
                    >
                      Receive
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
                        setSelectedDebtor(debtor)
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

      {/* Add Debtor Modal */}
      {showAddModal && (
        <AddDebtorModal
          onClose={() => setShowAddModal(false)}
          onCreated={(debtor) => setDebtors([debtor, ...debtors])}
        />
      )}

      {/* Payment History Modal */}
      {showHistoryModal && selectedDebtor && (
        <PaymentHistoryModal
          debtor={selectedDebtor}
          onClose={() => {
            setShowHistoryModal(false)
            setSelectedDebtor(null)
          }}
        />
      )}

      {/* Receive Payment Modal */}
      {showReceiveModal && selectedDebtor && (
        <ReceivePaymentModal
          debtor={selectedDebtor}
          onClose={() => {
            setShowReceiveModal(false)
            setSelectedDebtor(null)
          }}
          onReceived={handleReceivePayment}
        />
      )}
    </div>
  )
}
