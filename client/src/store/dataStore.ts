import { create } from 'zustand'
import { API_BASE_URL } from '@/services/api'

// Types (keeping the interfaces we need)
interface Product {
  id: string
  sku: string
  name: string
  category: string
  cost: number
  price: number
  stock: number
  minStock: number
  status: string
}

interface Sale {
  id: string
  invoiceNo: string
  customer: string
  cashier: string
  date: string
  total: number
  status: string
  paymentMethod: string
  items?: any[]
  user?: {
    name: string
  }
}

interface StockMovement {
  id: string
  type: string
  productId: string
  quantity: number
  reference: string
  supplier?: string
  reason?: string
  movementDate: string
  product?: {
    name: string
    sku: string
  }
}

interface Employee {
  id: string
  name: string
  position: string
  department: string
  email: string
  phone: string
  status: string
}

interface InventoryMovement {
  id: string
  date: string
  time: string
  type: 'Stock In' | 'Stock Out'
  productName: string
  productSKU: string
  quantity: number
  beforeAmount: number
  afterAmount: number
  reason: string
  reference: string
  user: string
  userName: string
}

interface DataState {
  products: Product[]
  sales: Sale[]
  stockMovements: StockMovement[]
  employees: Employee[]
  inventoryMovements: InventoryMovement[]
  initialized: boolean
  isInitializing: boolean
  initializeData: () => Promise<void>
  resetData: () => void
  addSale: (sale: Sale, items: Array<{ productId: string; quantity: number; productName: string; sku: string }>) => void
  updateProductStock: (productId: string, quantityChange: number, reason: string, reference: string) => void
}

export const useDataStore = create<DataState>()((set, get) => ({
  products: [],
  sales: [],
  stockMovements: [],
  employees: [],
  inventoryMovements: [],
  initialized: false,
  isInitializing: false,

  initializeData: async () => {
    const state = get()
    
    // Prevent multiple simultaneous initializations
    if (state.isInitializing || state.initialized) {
      return
    }

    set({ isInitializing: true })

    try {
      // Fetch real data from API
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`
      }

      // Fetch products
      const productsRes = await fetch(`${API_BASE_URL}/products`, { headers })
      const productsData = await productsRes.json()
      const products = productsData.success ? productsData.data : []

      // Fetch sales
      const salesRes = await fetch(`${API_BASE_URL}/sales`, { headers })
      const salesData = await salesRes.json()
      const rawSales = salesData.success ? salesData.data : []
      
      // Map sales data to match dashboard expectations
      const sales = rawSales.map((sale: any) => ({
        id: sale.id,
        invoiceNo: sale.invoiceNo,
        customer: sale.customer,
        cashier: sale.cashier,
        date: sale.saleDate ? sale.saleDate.split('T')[0] : new Date().toISOString().split('T')[0], // Convert saleDate to date
        total: sale.total,
        status: sale.paymentStatus === 'PAID' ? 'Paid' : sale.paymentStatus === 'PENDING' ? 'Pending' : 'Partially Paid',
        payStatus: sale.paymentStatus === 'PAID' ? 'Paid' : sale.paymentStatus === 'PENDING' ? 'Pending' : 'Partially Paid', // Add payStatus field
        paymentMethod: sale.paymentMethod,
        items: sale.items || [],
        user: sale.user,
        subtotal: sale.subtotal || 0,
        vat: sale.vat || 0,
        discount: sale.discount || 0
      }))

      // Fetch stock movements
      const movementsRes = await fetch(`${API_BASE_URL}/inventory/movements`, { headers })
      const movementsData = await movementsRes.json()
      const rawMovements = movementsData.success ? movementsData.data : []
      
      // Map stock movements to match dashboard expectations
      const stockMovements = rawMovements.map((movement: any) => ({
        id: movement.id,
        type: movement.type === 'IN' ? 'in' : 'out', // Convert IN/OUT to in/out
        productId: movement.productId,
        productName: movement.product?.name || '',
        qty: movement.quantity, // Map quantity to qty
        date: movement.movementDate ? movement.movementDate.split('T')[0] : new Date().toISOString().split('T')[0], // Convert movementDate to date
        ref: movement.reference,
        supplier: movement.supplier,
        reason: movement.reason,
        notes: movement.notes
      }))

      // Fetch employees
      const employeesRes = await fetch(`${API_BASE_URL}/employees`, { headers })
      const employeesData = await employeesRes.json()
      const employees = employeesData.success ? employeesData.data : []

      set({
        products,
        sales,
        stockMovements,
        employees,
        initialized: true,
        isInitializing: false,
      })
    } catch (error) {
      console.error('Failed to initialize data:', error)
      // Set empty arrays on error
      set({
        products: [],
        sales: [],
        stockMovements: [],
        employees: [],
        initialized: true,
        isInitializing: false,
      })
    }
  },

  resetData: () => {
    set({
      products: [],
      sales: [],
      stockMovements: [],
      employees: [],
      inventoryMovements: [],
      initialized: false,
      isInitializing: false,
    })
  },

  addSale: (sale, items) => {
    const state = get()
    const newSales = [...state.sales, sale]
    const newMovements = [...state.inventoryMovements]
    const updatedProducts = [...state.products]

    // Create inventory movements for each item sold
    items.forEach((item) => {
      const product = updatedProducts.find(p => p.id === item.productId)
      if (product) {
        const beforeAmount = product.stock
        const afterAmount = beforeAmount - item.quantity

        // Update product stock
        product.stock = afterAmount
        if (afterAmount === 0) {
          product.status = 'Out of Stock'
        } else if (afterAmount <= product.minStock) {
          product.status = 'Low Stock'
        }

        // Create inventory movement record
        const now = new Date()
        const movement: InventoryMovement = {
          id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().split(' ')[0].substring(0, 5),
          type: 'Stock Out',
          productName: item.productName,
          productSKU: item.sku,
          quantity: item.quantity,
          beforeAmount,
          afterAmount,
          reason: 'Sale',
          reference: sale.invoiceNo,
          user: 'CM',
          userName: 'Chikondi Mvula',
        }
        newMovements.push(movement)
      }
    })

    set({
      sales: newSales,
      inventoryMovements: newMovements,
      products: updatedProducts,
    })
  },

  updateProductStock: (productId, quantityChange, reason, reference) => {
    const state = get()
    const updatedProducts = [...state.products]
    const newMovements = [...state.inventoryMovements]

    const product = updatedProducts.find(p => p.id === productId)
    if (product) {
      const beforeAmount = product.stock
      const afterAmount = beforeAmount + quantityChange
      const isStockIn = quantityChange > 0

      // Update product stock
      product.stock = afterAmount
      if (afterAmount === 0) {
        product.status = 'Out of Stock'
      } else if (afterAmount <= product.minStock) {
        product.status = 'Low Stock'
      } else {
        product.status = 'In Stock'
      }

      // Create inventory movement record
      const now = new Date()
      const movement: InventoryMovement = {
        id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0].substring(0, 5),
        type: isStockIn ? 'Stock In' : 'Stock Out',
        productName: product.name,
        productSKU: product.sku,
        quantity: Math.abs(quantityChange),
        beforeAmount,
        afterAmount,
        reason,
        reference,
        user: 'CM',
        userName: 'Chikondi Mvula',
      }
      newMovements.push(movement)

      set({
        inventoryMovements: newMovements,
        products: updatedProducts,
      })
    }
  },
}))
