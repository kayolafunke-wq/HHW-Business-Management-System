import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Plus, X, Trash2, Check, Printer, Download } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { useApiStore } from '@/store/apiStore'
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

function fmtDateLong(dstr?: string): string {
  if (!dstr) return 'N/A'
  const d = new Date(dstr)
  if (isNaN(d.getTime())) return dstr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface CartItem {
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  subtotal: number
}

interface CompletedSale {
  invoiceNo: string
  customer: string
  date: string
  items: CartItem[]
  subtotal: number
  discount: number
  vat: number
  total: number
  method: string
}

// Receipt Modal
function ReceiptModal({ sale, onClose }: { sale: CompletedSale; onClose: () => void }) {
  const navigate = useNavigate()
  
  const handlePrint = () => {
    window.print()
  }
  
  const handleViewSales = () => {
    onClose()
    navigate('/sales')
  }

  const handleDownload = () => {
    // Create a simple text receipt
    const receiptText = `
H.H WHOLESALERS
Area 4, Chilambura Road, Opposite Chipiku
Lilongwe, Malawi
+265 (0) 999 888 747
VAT Reg. No. VAT-88214

========================
RECEIPT
========================

Invoice No: ${sale.invoiceNo}
Date: ${fmtDateLong(sale.date)}
Customer: ${sale.customer}
Payment: ${sale.method}

------------------------
ITEMS
------------------------
${sale.items.map(item => `${item.name}\n  ${item.quantity} x ${money(item.price)} = ${money(item.subtotal)}`).join('\n\n')}

------------------------
TOTALS
------------------------
Subtotal:    ${money(sale.subtotal)}
Discount:   -${money(sale.discount)}
VAT (17.5%): ${money(sale.vat)}
------------------------
TOTAL:       ${money(sale.total)}
========================

Status: PAID

Thank you for your business!
    `

    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-${sale.invoiceNo}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Receipt downloaded')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-title">Sale Receipt</div>
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
              <div className="font-display font-bold text-base sm:text-lg text-gray-900">RECEIPT</div>
              <div className="text-xs sm:text-sm font-semibold text-[#2f5df5] font-mono whitespace-nowrap">{sale.invoiceNo}</div>
              <div className="text-xs text-gray-500 whitespace-nowrap">{fmtDateLong(sale.date)}</div>
            </div>
          </div>

          {/* Customer & Payment Info */}
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-2">CUSTOMER</div>
              <div className="font-semibold text-sm text-gray-900">{sale.customer}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 mb-2">PAYMENT</div>
              <div className="flex items-center gap-2 justify-end">
                <Badge variant="success">PAID</Badge>
                <span className="text-sm text-gray-700">{sale.method}</span>
              </div>
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
                {sale.items.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.sku}</div>
                    </td>
                    <td className="text-center">
                      <div className="text-sm text-gray-700">{item.quantity}</div>
                    </td>
                    <td className="text-right">
                      <div className="text-sm text-gray-700">{money(item.price)}</div>
                    </td>
                    <td className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{money(item.subtotal)}</div>
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
                <span className="font-semibold text-gray-900">{money(sale.subtotal)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-red-600">-{money(sale.discount)}</span>
                </div>
              )}
              <div className="divider"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (17.5%)</span>
                <span className="font-semibold text-gray-900">{money(sale.vat)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total Paid</span>
                <span className="font-bold text-lg text-[#0ea885]">{money(sale.total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <div className="text-sm font-semibold text-gray-900 mb-1">Thank you for your business!</div>
            <div className="text-xs text-gray-500">Please keep this receipt for your records</div>
          </div>
        </div>

        <div className="modal-foot">
          <Button variant="outline" onClick={handleViewSales}>
            View All Sales
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

const CUSTOMERS = [
  'Walk-in Customer',
  'Chikondi Banda',
  'Grace Phiri',
  'Thoko Mwale',
  'James Zulu',
  'Mercy Kachale',
  'Peter Nkhoma',
  'Anesu Chirwa',
  'Blessings Gondwe',
]

export default function CreateSale() {
  const navigate = useNavigate()
  const { products, createSale: apiCreateSale } = useApiStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [customer, setCustomer] = useState('Walk-in Customer')
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [completedSale, setCompletedSale] = useState<CompletedSale | null>(null)
  const [mobileTab, setMobileTab] = useState<'products' | 'cart'>('products')

  // Filter products
  const filteredProducts = products
    .filter(
      (p) =>
        p.stock > 0 &&
        (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .slice(0, 20)

  // Add product to cart
  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existingItem = cart.find((item) => item.productId === productId)
    if (existingItem) {
      // Increase quantity
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      )
    } else {
      // Add new item
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          quantity: 1,
          subtotal: product.price,
        },
      ])
    }
    toast.success(`Added ${product.name}`)
  }

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId))
  }

  // Update quantity
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart(
      cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
          : item
      )
    )
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    setDiscount(0)
  }

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0)
  const discountAmount = discount
  const subtotalAfterDiscount = subtotal - discountAmount
  const vat = subtotalAfterDiscount * 0.175 // 17.5% VAT
  const total = subtotalAfterDiscount + vat

  // Complete sale
  const completeSale = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    if (!customer || customer.trim() === '') {
      toast.error('Please enter customer name')
      return
    }

    try {
      // Prepare sale data for API
      const saleData = {
        customer,
        customerPhone: undefined, // Can add phone field later
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        discount: discountAmount,
        paymentMethod: paymentMethod.toUpperCase().replace(' ', '_') as 'CASH' | 'BANK' | 'MOBILE_MONEY',
        cashier: 'Chikondi Mvula',
      }

      // Create sale via API
      const createdSale = await apiCreateSale(saleData)

      // Prepare completed sale for receipt
      const sale: CompletedSale = {
        invoiceNo: createdSale.invoiceNo,
        customer,
        date: new Date().toISOString().split('T')[0],
        items: cart,
        subtotal,
        discount: discountAmount,
        vat,
        total,
        method: paymentMethod,
      }

      // Show receipt modal
      setCompletedSale(sale)
      
      // Clear cart
      setCart([])
      setDiscount(0)
      setCustomer('Walk-in Customer')
      setPaymentMethod('Cash')
      setMobileTab('products')

      toast.success('Sale completed! Stock updated.')
    } catch (error: any) {
      console.error('Sale creation error:', error)
      toast.error(error.response?.data?.message || 'Failed to create sale')
    }
  }

  // Handle barcode scan — matches barcode field first, then falls back to SKU
  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault()
    const query = barcodeInput.trim()
    if (!query) return

    // 1. Match by barcode field (exact, so a scanner auto-submit works)
    let product = products.find(
      (p) => p.barcode && p.barcode === query && p.stock > 0
    )

    // 2. Fall back to matching by SKU
    if (!product) {
      product = products.find(
        (p) => p.sku.toLowerCase() === query.toLowerCase() && p.stock > 0
      )
    }

    // 3. Check if product exists but is out of stock
    if (!product) {
      const outOfStock = products.find(
        (p) => (p.barcode === query || p.sku.toLowerCase() === query.toLowerCase()) && p.stock === 0
      )
      if (outOfStock) {
        toast.error(`"${outOfStock.name}" is out of stock`)
        return
      }
    }

    if (product) {
      addToCart(product.id)
      toast.success(`${product.name} added to cart`, { duration: 1500 })
      setBarcodeInput('')
    } else {
      toast.error('Product not found. Check the barcode or SKU.')
    }
  }

  return (
    <div className="fade-in">
      <div className="page-head flex-wrap gap-3">
        <div>
          <h1 className="page-title">Create Sale</h1>
          <p className="page-sub">Ring up a new transaction</p>
        </div>
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <Button variant="outline" onClick={clearCart} className="text-xs">
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-gray-100 p-1 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setMobileTab('products')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'products'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Products ({filteredProducts.length})
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('cart')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'cart'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Cart ({cart.reduce((s, i) => s + i.quantity, 0)})
          {cart.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
              {money(total)}
            </span>
          )}
        </button>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 ${cart.length > 0 && mobileTab === 'products' ? 'pb-20 lg:pb-0' : ''}`}>
        {/* Left: Product List */}
        <div className={`${mobileTab === 'products' ? 'block' : 'hidden'} lg:block`}>
          <Card>
            <div className="mb-4">
              <form onSubmit={handleBarcodeScan} className="mb-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Scan or enter barcode/SKU..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    className="pr-20"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold text-brand hover:text-brand-dark px-2 py-1"
                  >
                    Scan
                  </button>
                </div>
              </form>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-brand hover:bg-blue-50 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-semibold text-sm text-gray-900 truncate">{product.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{product.sku}</div>
                    {product.barcode && (
                      <div className="text-[10px] text-gray-400 font-mono">{product.barcode}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-sm text-gray-900">{money(product.price)}</div>
                      <div className="text-xs text-gray-500">{product.stock} in stock</div>
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="btn btn-sm btn-primary flex items-center gap-1 active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </button>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="empty-state py-12">
                  <ShoppingCart className="w-10 h-10 text-gray-400 mb-3 mx-auto" />
                  <div className="text-sm font-semibold text-gray-700 mb-1">No products found</div>
                  <div className="text-xs text-gray-500">Try a different search term</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Cart & Checkout */}
        <div className={`${mobileTab === 'cart' ? 'block' : 'hidden'} lg:block space-y-4`}>
          <Card>
            <div className="card-head flex items-center justify-between">
              <div className="card-title">Current Sale</div>
              <button
                type="button"
                onClick={() => setMobileTab('products')}
                className="lg:hidden text-xs font-semibold text-brand hover:underline"
              >
                ← Add more items
              </button>
            </div>

            {/* Customer Selection */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-700 mb-2 block">Customer</label>
              <select
                className="input w-full"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              >
                {CUSTOMERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items */}
            <div className="mb-4">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <div className="text-sm font-semibold text-gray-600">Cart is empty</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Add products from the list to start a sale.
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">{money(item.price)} each</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold text-gray-900 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="w-6 h-6 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-sm font-bold text-gray-900 w-20 text-right">
                        {money(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discount */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
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

            {/* Payment Method */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
                Payment Method
              </label>
              <select
                className="input w-full"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Mobile Money">Mobile Money</option>
              </select>
            </div>

            <div className="divider"></div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">{money(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-red-600">-{money(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (17.5%)</span>
                <span className="font-semibold text-gray-900">{money(vat)}</span>
              </div>
              <div className="divider"></div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">{money(total)}</span>
              </div>
            </div>

            <Button
              onClick={completeSale}
              disabled={cart.length === 0}
              className="w-full mt-4 !py-3"
            >
              <Check className="w-4 h-4" />
              Complete Sale
            </Button>
          </Card>
        </div>
      </div>

      {/* Mobile Sticky Cart Bar */}
      {cart.length > 0 && mobileTab === 'products' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-40 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-gray-500">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} item{cart.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 's' : ''} in cart
            </div>
            <div className="text-base font-bold text-gray-900">{money(total)}</div>
          </div>
          <Button onClick={() => setMobileTab('cart')} className="!py-2.5 !px-4 text-xs font-semibold shadow-md shadow-blue-500/20">
            <ShoppingCart className="w-3.5 h-3.5" />
            View Cart & Pay
          </Button>
        </div>
      )}

      {/* Receipt Modal */}
      {completedSale && (
        <ReceiptModal 
          sale={completedSale} 
          onClose={() => {
            setCompletedSale(null)
            // Optionally navigate to sales list
            // navigate('/sales')
          }} 
        />
      )}
    </div>
  )
}
