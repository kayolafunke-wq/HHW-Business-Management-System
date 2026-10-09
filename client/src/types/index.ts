// User Types
export interface User {
  id: string
  firebaseUid: string
  name: string
  email: string
  username: string
  role: UserRole
  status: UserStatus
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMINISTRATOR = 'Administrator',
  SALES_USER = 'Sales User',
  INVENTORY_USER = 'Inventory User',
  HR_USER = 'HR User',
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

// Product Types
export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  description?: string
  cost: number
  price: number
  stock: number
  minStock: number
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

export enum ProductCategory {
  ELECTRONICS = 'Electronics',
  GROCERIES = 'Groceries',
  BEVERAGES = 'Beverages',
  STATIONERY = 'Stationery',
  HOUSEHOLD = 'Household',
  CLOTHING = 'Clothing',
  OTHER = 'Other',
}

export enum ProductStatus {
  IN_STOCK = 'In Stock',
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock',
}

// Sale Types
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
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  cashier: string
  notes?: string
  saleDate: string
  createdAt: string
  updatedAt: string
  userId: string
  items: SaleItem[]
}

export interface SaleItem {
  id: string
  quantity: number
  price: number
  total: number
  productId: string
  product: Product
}

export enum PaymentMethod {
  CASH = 'Cash',
  BANK = 'Bank',
  MOBILE_MONEY = 'Mobile Money',
}

export enum PaymentStatus {
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  PENDING = 'Pending',
}

// Stock Movement Types
export interface StockMovement {
  id: string
  type: MovementType
  quantity: number
  reference: string
  supplier?: string
  reason?: string
  notes?: string
  movementDate: string
  createdAt: string
  productId: string
  product: Product
}

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
}

// Employee Types
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
  status: EmployeeStatus
  address?: string
  emergencyContact?: string
  createdAt: string
  updatedAt: string
}

export enum EmployeeStatus {
  ACTIVE = 'Active',
  ON_LEAVE = 'On Leave',
  INACTIVE = 'Inactive',
}

// Attendance Types
export interface Attendance {
  id: string
  date: string
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  notes?: string
  employeeId: string
  employee: Employee
  createdAt: string
  updatedAt: string
}

export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  LEAVE = 'Leave',
}

// Audit Log Types
export interface AuditLog {
  id: string
  action: string
  details?: string
  ipAddress?: string
  userAgent?: string
  timestamp: string
  userId: string
  user: User
}

// Dashboard Stats
export interface DashboardStats {
  totalProducts: number
  totalStockValue: number
  todaySales: number
  monthlySales: number
  totalEmployees: number
  presentToday: number
  lowStockItems: number
  outOfStockItems: number
  salesTrend: { date: string; amount: number }[]
  topProducts: { name: string; units: number }[]
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}
