import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      console.error('Unauthorized access')
    }
    return Promise.reject(error)
  }
)

// ============================================
// PRODUCTS API
// ============================================

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  description?: string
  cost: number
  price: number
  stock: number
  minStock: number
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  createdAt: string
  updatedAt: string
}

export const productsApi = {
  getAll: async (params?: { category?: string; status?: string; search?: string }) => {
    const response = await api.get<{ success: boolean; data: Product[] }>('/products', { params })
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Product }>(`/products/${id}`)
    return response.data.data
  },

  create: async (data: Omit<Product, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<{ success: boolean; data: Product }>('/products', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<Product>) => {
    const response = await api.put<{ success: boolean; data: Product }>(`/products/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/products/${id}`)
    return response.data
  },
}

// ============================================
// SALES API
// ============================================

export interface SaleItem {
  id: string
  productId: string
  quantity: number
  price: number
  total: number
  product?: Product
}

export interface Sale {
  id: string
  invoiceNo: string
  customer: string
  customerPhone?: string
  subtotal: number
  discount: number
  taxable: number
  vat: number
  total: number
  paymentMethod: 'CASH' | 'BANK' | 'MOBILE_MONEY'
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'PENDING'
  cashier: string
  notes?: string
  saleDate: string
  createdAt: string
  updatedAt: string
  userId: string
  items: SaleItem[]
  user?: {
    name: string
    email: string
  }
}

export interface CreateSaleData {
  customer: string
  customerPhone?: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  discount?: number
  paymentMethod: 'CASH' | 'BANK' | 'MOBILE_MONEY'
  paymentStatus?: 'PAID' | 'PARTIALLY_PAID' | 'PENDING'
  cashier?: string
  notes?: string
}

export const salesApi = {
  getAll: async (params?: {
    startDate?: string
    endDate?: string
    paymentMethod?: string
    paymentStatus?: string
  }) => {
    const response = await api.get<{ success: boolean; data: Sale[] }>('/sales', { params })
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Sale }>(`/sales/${id}`)
    return response.data.data
  },

  create: async (data: CreateSaleData) => {
    const response = await api.post<{ success: boolean; data: Sale }>('/sales', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<Sale>) => {
    const response = await api.put<{ success: boolean; data: Sale }>(`/sales/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/sales/${id}`)
    return response.data
  },

  getStats: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get<{ success: boolean; data: any }>('/sales/stats', { params })
    return response.data.data
  },
}

// ============================================
// INVENTORY API
// ============================================

export interface StockMovement {
  id: string
  type: 'IN' | 'OUT'
  quantity: number
  reference: string
  supplier?: string
  reason: string
  notes?: string
  movementDate: string
  createdAt: string
  productId: string
  product?: {
    id: string
    sku: string
    name: string
    category: string
    stock: number
  }
}

export interface CreateStockMovementData {
  productId: string
  type: 'IN' | 'OUT'
  quantity: number
  reference?: string
  supplier?: string
  reason: string
  notes?: string
}

export interface InventorySummary {
  totalProducts: number
  inStockCount: number
  lowStockCount: number
  outOfStockCount: number
  totalStockUnits: number
  totalStockValue: number
  recentMovements: StockMovement[]
}

export const inventoryApi = {
  // Stock movements
  getAllMovements: async (params?: {
    productId?: string
    type?: string
    startDate?: string
    endDate?: string
    reference?: string
  }) => {
    const response = await api.get<{ success: boolean; data: StockMovement[] }>(
      '/inventory/movements',
      { params }
    )
    return response.data.data
  },

  getMovementById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: StockMovement }>(
      `/inventory/movements/${id}`
    )
    return response.data.data
  },

  createMovement: async (data: CreateStockMovementData) => {
    const response = await api.post<{ success: boolean; data: StockMovement }>(
      '/inventory/movements',
      data
    )
    return response.data.data
  },

  updateMovement: async (id: string, data: Partial<StockMovement>) => {
    const response = await api.put<{ success: boolean; data: StockMovement }>(
      `/inventory/movements/${id}`,
      data
    )
    return response.data.data
  },

  deleteMovement: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/inventory/movements/${id}`
    )
    return response.data
  },

  // Inventory reports
  getSummary: async () => {
    const response = await api.get<{ success: boolean; data: InventorySummary }>(
      '/inventory/summary'
    )
    return response.data.data
  },

  getLowStock: async () => {
    const response = await api.get<{ success: boolean; data: Product[] }>('/inventory/low-stock')
    return response.data.data
  },

  getProductHistory: async (productId: string) => {
    const response = await api.get<{
      success: boolean
      data: { product: Product; movements: StockMovement[] }
    }>(`/inventory/product/${productId}/history`)
    return response.data.data
  },
}

// ============================================
// EMPLOYEES API
// ============================================

export interface Employee {
  id: string
  employeeId: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  salary: number
  dateEmployed: string
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE'
  address?: string
  emergencyContact?: string
  createdAt: string
  updatedAt: string
}

export interface Attendance {
  id: string
  employeeId: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE'
  checkIn?: string
  checkOut?: string
  notes?: string
  createdAt: string
  updatedAt: string
  employee?: {
    employeeId: string
    name: string
    department: string
    position: string
  }
}

export const employeesApi = {
  getAll: async (params?: { department?: string; status?: string; search?: string }) => {
    const response = await api.get<{ success: boolean; data: Employee[] }>('/employees', {
      params,
    })
    return response.data.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Employee & { attendance: Attendance[] } }>(
      `/employees/${id}`
    )
    return response.data.data
  },

  create: async (data: Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post<{ success: boolean; data: Employee }>('/employees', data)
    return response.data.data
  },

  update: async (id: string, data: Partial<Employee>) => {
    const response = await api.put<{ success: boolean; data: Employee }>(`/employees/${id}`, data)
    return response.data.data
  },

  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/employees/${id}`)
    return response.data
  },

  // Attendance
  getAttendance: async (params?: {
    employeeId?: string
    startDate?: string
    endDate?: string
    status?: string
  }) => {
    const response = await api.get<{ success: boolean; data: Attendance[] }>(
      '/employees/attendance',
      { params }
    )
    return response.data.data
  },

  markAttendance: async (data: {
    employeeId: string
    date: string
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'LEAVE'
    checkIn?: string
    checkOut?: string
    notes?: string
  }) => {
    const response = await api.post<{ success: boolean; data: Attendance }>(
      '/employees/attendance',
      data
    )
    return response.data.data
  },
}

export default api
