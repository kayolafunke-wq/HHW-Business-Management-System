import { create } from 'zustand'
import {
  productsApi,
  salesApi,
  inventoryApi,
  employeesApi,
  Product,
  Sale,
  StockMovement,
  Employee,
  InventorySummary,
} from '@/services/api'

interface ApiState {
  // Data
  products: Product[]
  sales: Sale[]
  stockMovements: StockMovement[]
  employees: Employee[]
  inventorySummary: InventorySummary | null

  // Loading states
  loadingProducts: boolean
  loadingSales: boolean
  loadingStockMovements: boolean
  loadingEmployees: boolean

  // Errors
  error: string | null

  // Actions - Products
  fetchProducts: () => Promise<void>
  addProduct: (data: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Product>
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>

  // Actions - Sales
  fetchSales: () => Promise<void>
  createSale: (data: {
    customer: string
    customerPhone?: string
    items: Array<{ productId: string; quantity: number; price: number }>
    discount?: number
    paymentMethod: 'CASH' | 'BANK' | 'MOBILE_MONEY'
    cashier?: string
  }) => Promise<Sale>

  // Actions - Inventory
  fetchStockMovements: () => Promise<void>
  fetchInventorySummary: () => Promise<void>
  createStockMovement: (data: {
    productId: string
    type: 'IN' | 'OUT'
    quantity: number
    reference?: string
    supplier?: string
    reason: string
    notes?: string
  }) => Promise<StockMovement>

  // Actions - Employees
  fetchEmployees: () => Promise<void>
  addEmployee: (data: Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>) => Promise<Employee>

  // Initialize all data
  initializeData: () => Promise<void>
}

export const useApiStore = create<ApiState>()((set, get) => ({
  // Initial state
  products: [],
  sales: [],
  stockMovements: [],
  employees: [],
  inventorySummary: null,
  loadingProducts: false,
  loadingSales: false,
  loadingStockMovements: false,
  loadingEmployees: false,
  error: null,

  // Fetch products
  fetchProducts: async () => {
    set({ loadingProducts: true, error: null })
    try {
      const products = await productsApi.getAll()
      set({ products, loadingProducts: false })
    } catch (error: any) {
      console.error('Fetch products error:', error)
      set({ error: error.message, loadingProducts: false })
    }
  },

  // Add product
  addProduct: async (data) => {
    try {
      const newProduct = await productsApi.create(data)
      set((state) => ({ products: [...state.products, newProduct] }))
      return newProduct
    } catch (error: any) {
      console.error('Add product error:', error)
      throw error
    }
  },

  // Update product
  updateProduct: async (id, data) => {
    try {
      const updatedProduct = await productsApi.update(id, data)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
      }))
      return updatedProduct
    } catch (error: any) {
      console.error('Update product error:', error)
      throw error
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      await productsApi.delete(id)
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }))
    } catch (error: any) {
      console.error('Delete product error:', error)
      throw error
    }
  },

  // Fetch sales
  fetchSales: async () => {
    set({ loadingSales: true, error: null, sales: [] }) // Clear old data first
    try {
      const sales = await salesApi.getAll()
      console.log('Fetched sales:', sales.length, 'records')
      set({ sales, loadingSales: false })
    } catch (error: any) {
      console.error('Fetch sales error:', error)
      set({ error: error.message, loadingSales: false })
    }
  },

  // Create sale
  createSale: async (data) => {
    try {
      const newSale = await salesApi.create(data)
      set((state) => ({ sales: [newSale, ...state.sales] }))
      
      // Refresh products to get updated stock
      get().fetchProducts()
      
      return newSale
    } catch (error: any) {
      console.error('Create sale error:', error)
      throw error
    }
  },

  // Fetch stock movements
  fetchStockMovements: async () => {
    set({ loadingStockMovements: true, error: null })
    try {
      const movements = await inventoryApi.getAllMovements()
      set({ stockMovements: movements, loadingStockMovements: false })
    } catch (error: any) {
      console.error('Fetch stock movements error:', error)
      set({ error: error.message, loadingStockMovements: false })
    }
  },

  // Fetch inventory summary
  fetchInventorySummary: async () => {
    try {
      const summary = await inventoryApi.getSummary()
      set({ inventorySummary: summary })
    } catch (error: any) {
      console.error('Fetch inventory summary error:', error)
      set({ error: error.message })
    }
  },

  // Create stock movement
  createStockMovement: async (data) => {
    try {
      const movement = await inventoryApi.createMovement(data)
      set((state) => ({
        stockMovements: [movement, ...state.stockMovements],
      }))
      
      // Refresh products and summary to get updated stock
      get().fetchProducts()
      get().fetchInventorySummary()
      
      return movement
    } catch (error: any) {
      console.error('Create stock movement error:', error)
      throw error
    }
  },

  // Fetch employees
  fetchEmployees: async () => {
    set({ loadingEmployees: true, error: null })
    try {
      const employees = await employeesApi.getAll()
      set({ employees, loadingEmployees: false })
    } catch (error: any) {
      console.error('Fetch employees error:', error)
      set({ error: error.message, loadingEmployees: false })
    }
  },

  // Add employee
  addEmployee: async (data) => {
    try {
      const newEmployee = await employeesApi.create(data)
      set((state) => ({ employees: [...state.employees, newEmployee] }))
      return newEmployee
    } catch (error: any) {
      console.error('Add employee error:', error)
      throw error
    }
  },

  // Initialize all data
  initializeData: async () => {
    try {
      await Promise.all([
        get().fetchProducts(),
        get().fetchSales(),
        get().fetchStockMovements(),
        get().fetchEmployees(),
        get().fetchInventorySummary(),
      ])
    } catch (error: any) {
      console.error('Initialize data error:', error)
      set({ error: error.message })
    }
  },
}))
