import { create } from 'zustand'
import {
  Product,
  Sale,
  StockMovement,
  Employee,
  generateProducts,
  generateSales,
  generateStockMovements,
  generateEmployees,
} from '@/services/dataGenerator'

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
  initializeData: () => void
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

  initializeData: () => {
    const products = generateProducts()
    const sales = generateSales(products)
    const stockMovements = generateStockMovements(products)
    const employees = generateEmployees()

    set({
      products,
      sales,
      stockMovements,
      employees,
      initialized: true,
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
        } else if (afterAmount <= product.min) {
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
      } else if (afterAmount <= product.min) {
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
