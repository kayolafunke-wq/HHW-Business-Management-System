// Data generation service matching the prototype exactly

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  cost: number
  price: number
  stock: number
  min: number
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  createdAt: string
}

export interface Sale {
  id: string
  invoiceNo: string
  customer: string
  date: string
  items: number
  subtotal: number
  vat: number
  total: number
  method: string
  payStatus: 'Paid' | 'Partially Paid' | 'Pending'
  cashier: string
}

export interface StockMovement {
  id: string
  type: 'in' | 'out'
  productId: string
  productName: string
  qty: number
  date: string
  ref: string
  supplier?: string
  reason?: string
  notes?: string
}

export interface Employee {
  id: string
  name: string
  position: string
  department: string
  phone: string
  email: string
  hireDate: string
  status: 'Active' | 'On Leave' | 'Suspended'
  salary: number
}

export interface Invoice {
  id: string
  invoiceNo: string
  customer: string
  date: string
  items: number
  subtotal: number
  vat: number
  total: number
  status: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue'
}

// Constants
const CATEGORIES = ['Electronics', 'Groceries', 'Beverages', 'Stationery', 'Household', 'Clothing']
const CUSTOMERS = [
  'Chikondi Banda',
  'Grace Phiri',
  'Thoko Mwale',
  'James Zulu',
  'Mercy Kachale',
  'Peter Nkhoma',
  'Anesu Chirwa',
  'Blessings Gondwe',
  'Walk-in Customer',
  'Esther Mvula',
  'Loyd Chirwa',
  'Faith Nyirenda',
]
const SUPPLIERS = [
  'Malawi Wholesalers Ltd',
  'Prime Distributors',
  'Sunrise Imports',
  'ABC Traders',
  'Metro Supplies Co.',
]
const PAYMENT_METHODS = ['Cash', 'Bank', 'Mobile Money']

// Utility functions
function pad(n: number): string {
  return n < 10 ? '0' + n : '' + n
}

function fmtDate(d: Date): string {
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

// Product seed data (matching prototype)
const PRODUCT_SEED: [string, string, number, number, number, number][] = [
  ['Samsung 32" LED TV', 'Electronics', 210000, 265000, 14, 5],
  ['HP LaserJet Printer', 'Electronics', 185000, 235000, 6, 4],
  ['Bluetooth Speaker JBL Go', 'Electronics', 28000, 42000, 3, 10],
  ['Wireless Mouse Logitech', 'Electronics', 9500, 15500, 42, 15],
  ['Smartphone Charger Type-C', 'Electronics', 4200, 7500, 58, 20],
  ['LED Bulb 9W (Pack of 4)', 'Electronics', 3800, 6200, 120, 30],
  ['Rice 25kg Bag', 'Groceries', 38000, 46000, 32, 10],
  ['Cooking Oil 5L', 'Groceries', 21000, 27500, 18, 10],
  ['Sugar 2kg', 'Groceries', 5200, 7200, 64, 20],
  ['Maize Flour 25kg', 'Groceries', 24500, 31000, 4, 10],
  ['Salt 1kg (Pack of 10)', 'Groceries', 6100, 9200, 0, 15],
  ['Coca-Cola 500ml (Crate of 24)', 'Beverages', 13500, 18500, 26, 8],
  ['Bottled Water 1.5L (Pack of 6)', 'Beverages', 5800, 8400, 9, 10],
  ['Fanta Orange 2L', 'Beverages', 3200, 4900, 48, 12],
  ['A4 Paper Ream (80gsm)', 'Stationery', 9800, 13500, 55, 15],
  ['Ballpoint Pens (Box of 50)', 'Stationery', 7200, 11000, 2, 10],
  ['Exercise Books (Pack of 12)', 'Stationery', 6400, 9800, 73, 20],
  ['Office Stapler Heavy Duty', 'Stationery', 4600, 7300, 11, 6],
  ['Laundry Detergent 2kg', 'Household', 6900, 10200, 37, 12],
  ['Dish Washing Liquid 750ml', 'Household', 3100, 4900, 5, 10],
  ['Toilet Tissue (Pack of 12)', 'Household', 8300, 12100, 29, 10],
  ['Broom & Dustpan Set', 'Household', 4100, 6500, 16, 8],
  ["Men's Cotton T-Shirt", 'Clothing', 5200, 9800, 22, 10],
  ["Women's Casual Dress", 'Clothing', 11500, 19500, 8, 6],
  ['School Uniform Set', 'Clothing', 13800, 21000, 1, 8],
]

// Generate products
export function generateProducts(): Product[] {
  return PRODUCT_SEED.map((p, i) => {
    const [name, cat, cost, price, stock, min] = p
    const status = stock === 0 ? 'Out of Stock' : stock <= min ? 'Low Stock' : 'In Stock'
    return {
      id: 'P' + (1000 + i),
      sku: 'SKU-' + cat.slice(0, 3).toUpperCase() + '-' + (100 + i),
      name,
      category: cat,
      cost,
      price,
      stock,
      min,
      status,
      createdAt: fmtDate(daysAgo(90 - i * 2)),
    }
  })
}

// Generate sales
export function generateSales(products: Product[]): Sale[] {
  const sales: Sale[] = []
  let invoiceCounter = 6150

  // Generate 154 sales over the last 60 days
  for (let d = 60; d >= 0; d--) {
    const numSales = Math.random() < 0.7 ? 1 + Math.floor(Math.random() * 4) : 0
    for (let i = 0; i < numSales; i++) {
      const dt = daysAgo(d)
      const items = 1 + Math.floor(Math.random() * 4)
      let subtotal = 0
      for (let j = 0; j < items; j++) {
        const prod = products[Math.floor(Math.random() * products.length)]
        const qty = 1 + Math.floor(Math.random() * 3)
        subtotal += prod.price * qty
      }
      const vat = subtotal * 0.175
      const total = subtotal + vat

      const payStatusRand = Math.random()
      const payStatus = payStatusRand < 0.75 ? 'Paid' : payStatusRand < 0.90 ? 'Pending' : 'Partially Paid'

      sales.push({
        id: 'S' + invoiceCounter,
        invoiceNo: 'INV-' + invoiceCounter,
        customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
        date: fmtDate(dt),
        items,
        subtotal,
        vat,
        total,
        method: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
        payStatus,
        cashier: Math.random() < 0.6 ? 'Chikondi Mvula' : 'Grace Mwale',
      })
      invoiceCounter++
    }
  }

  return sales.sort((a, b) => b.invoiceNo.localeCompare(a.invoiceNo))
}

// Generate stock movements
export function generateStockMovements(products: Product[]): StockMovement[] {
  const movements: StockMovement[] = []
  let idCounter = 2000

  for (let d = 45; d >= 0; d--) {
    const dt = daysAgo(d)
    const nIn = Math.random() < 0.35 ? 1 : 0
    const nOut = Math.random() < 0.6 ? 1 + Math.floor(Math.random() * 2) : 0

    for (let i = 0; i < nIn; i++) {
      const p = products[Math.floor(Math.random() * products.length)]
      movements.push({
        id: 'SM' + idCounter++,
        type: 'in',
        productId: p.id,
        productName: p.name,
        qty: 10 + Math.floor(Math.random() * 40),
        date: fmtDate(dt),
        ref: 'GRN-' + (5000 + idCounter),
        supplier: SUPPLIERS[Math.floor(Math.random() * SUPPLIERS.length)],
        notes: 'Routine restock',
      })
    }

    for (let i = 0; i < nOut; i++) {
      const p = products[Math.floor(Math.random() * products.length)]
      movements.push({
        id: 'SM' + idCounter++,
        type: 'out',
        productId: p.id,
        productName: p.name,
        qty: 1 + Math.floor(Math.random() * 6),
        date: fmtDate(dt),
        ref: 'SO-' + (5000 + idCounter),
        reason: Math.random() < 0.85 ? 'Sale' : 'Damaged/Expired',
        notes: '',
      })
    }
  }

  return movements
}

// Generate employees
export function generateEmployees(): Employee[] {
  const employees: Employee[] = [
    {
      id: 'E001',
      name: 'Chikondi Mvula',
      position: 'General Manager',
      department: 'Management',
      phone: '+265 991 234 567',
      email: 'chikondi@hhw.com',
      hireDate: '2023-01-15',
      status: 'Active',
      salary: 850000,
    },
    {
      id: 'E002',
      name: 'Grace Mwale',
      position: 'Sales Manager',
      department: 'Sales',
      phone: '+265 991 234 568',
      email: 'grace@hhw.com',
      hireDate: '2023-03-20',
      status: 'Active',
      salary: 450000,
    },
    {
      id: 'E003',
      name: 'Steven Mbewe',
      position: 'Inventory Manager',
      department: 'Operations',
      phone: '+265 991 234 569',
      email: 'steven@hhw.com',
      hireDate: '2023-02-10',
      status: 'Active',
      salary: 400000,
    },
    {
      id: 'E004',
      name: 'Faith Nyasulu',
      position: 'HR Manager',
      department: 'Human Resources',
      phone: '+265 991 234 570',
      email: 'faith@hhw.com',
      hireDate: '2023-04-05',
      status: 'Active',
      salary: 420000,
    },
    {
      id: 'E005',
      name: 'Peter Nkhoma',
      position: 'Sales Assistant',
      department: 'Sales',
      phone: '+265 991 234 571',
      email: 'peter@hhw.com',
      hireDate: '2024-01-10',
      status: 'Active',
      salary: 180000,
    },
    {
      id: 'E006',
      name: 'Mercy Phiri',
      position: 'Cashier',
      department: 'Sales',
      phone: '+265 991 234 572',
      email: 'mercy@hhw.com',
      hireDate: '2024-02-15',
      status: 'Active',
      salary: 150000,
    },
    {
      id: 'E007',
      name: 'James Banda',
      position: 'Stock Clerk',
      department: 'Operations',
      phone: '+265 991 234 573',
      email: 'james@hhw.com',
      hireDate: '2024-03-01',
      status: 'Active',
      salary: 140000,
    },
    {
      id: 'E008',
      name: 'Thoko Chirwa',
      position: 'Accountant',
      department: 'Finance',
      phone: '+265 991 234 574',
      email: 'thoko@hhw.com',
      hireDate: '2023-06-20',
      status: 'Active',
      salary: 380000,
    },
    {
      id: 'E009',
      name: 'Blessings Mwanza',
      position: 'Security Guard',
      department: 'Security',
      phone: '+265 991 234 575',
      email: 'blessings@hhw.com',
      hireDate: '2023-08-10',
      status: 'Active',
      salary: 120000,
    },
    {
      id: 'E010',
      name: 'Loyd Gondwe',
      position: 'Driver',
      department: 'Logistics',
      phone: '+265 991 234 576',
      email: 'loyd@hhw.com',
      hireDate: '2023-09-15',
      status: 'Active',
      salary: 130000,
    },
    {
      id: 'E011',
      name: 'Esther Nyirenda',
      position: 'Cleaner',
      department: 'Facilities',
      phone: '+265 991 234 577',
      email: 'esther@hhw.com',
      hireDate: '2024-05-01',
      status: 'On Leave',
      salary: 95000,
    },
    {
      id: 'E012',
      name: 'Anesu Kachale',
      position: 'IT Support',
      department: 'IT',
      phone: '+265 991 234 578',
      email: 'anesu@hhw.com',
      hireDate: '2024-06-10',
      status: 'Active',
      salary: 320000,
    },
  ]

  return employees
}

// Helper functions for calculations
export function lowStockItems(products: Product[]): Product[] {
  return products.filter((p) => p.status === 'Low Stock')
}

export function outOfStockItems(products: Product[]): Product[] {
  return products.filter((p) => p.status === 'Out of Stock')
}

export function totalStockValue(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.cost * p.stock, 0)
}

export function todaySales(sales: Sale[]): Sale[] {
  const today = fmtDate(new Date())
  return sales.filter((s) => s.date === today)
}

export function monthSales(sales: Sale[]): Sale[] {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthStartStr = fmtDate(monthStart)
  return sales.filter((s) => s.date >= monthStartStr)
}

export function outstandingInvoices(sales: Sale[]): Sale[] {
  return sales.filter((s) => s.payStatus === 'Pending' || s.payStatus === 'Partially Paid')
}

export function productSalesAgg(sales: Sale[], products: Product[]): any[] {
  // This would aggregate product sales - simplified for now
  return products.map((p) => ({
    productId: p.id,
    productName: p.name,
    unitsSold: Math.floor(Math.random() * 100),
    revenue: Math.floor(Math.random() * 500000),
  }))
}
