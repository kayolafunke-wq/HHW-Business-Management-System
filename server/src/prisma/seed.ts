import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (optional - be careful in production!)
  console.log('🗑️  Clearing existing data...')
  await prisma.saleItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.stockMovement.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.product.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.user.deleteMany()
  await prisma.businessConfig.deleteMany()

  // Create Users
  console.log('👥 Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const admin = await prisma.user.create({
    data: {
      firebaseUid: 'firebase-admin-uid',
      name: 'Chikondi Mvula',
      email: 'admin@hhw.com',
      username: 'admin',
      role: 'ADMINISTRATOR',
      status: 'ACTIVE',
    },
  })

  const salesUser = await prisma.user.create({
    data: {
      firebaseUid: 'firebase-sales-uid',
      name: 'Grace Mwale',
      email: 'grace.sales@hhw.com',
      username: 'grace.sales',
      role: 'SALES_USER',
      status: 'ACTIVE',
    },
  })

  const inventoryUser = await prisma.user.create({
    data: {
      firebaseUid: 'firebase-inventory-uid',
      name: 'Steven Mbewe',
      email: 'steven.inv@hhw.com',
      username: 'steven.inv',
      role: 'INVENTORY_USER',
      status: 'ACTIVE',
    },
  })

  const hrUser = await prisma.user.create({
    data: {
      firebaseUid: 'firebase-hr-uid',
      name: 'Faith Nyasulu',
      email: 'faith.hr@hhw.com',
      username: 'faith.hr',
      role: 'HR_USER',
      status: 'ACTIVE',
    },
  })

  console.log(`✅ Created ${4} users`)

  // Create Products
  console.log('📦 Creating products...')
  const products = [
    // Electronics
    { sku: 'SKU-ELE-101', name: 'Samsung Galaxy A54', category: 'ELECTRONICS', cost: 280000, price: 350000, stock: 25, minStock: 5 },
    { sku: 'SKU-ELE-102', name: 'HP Laptop 15-inch', category: 'ELECTRONICS', cost: 450000, price: 550000, stock: 15, minStock: 3 },
    { sku: 'SKU-ELE-103', name: 'Dell Monitor 24"', category: 'ELECTRONICS', cost: 120000, price: 150000, stock: 30, minStock: 5 },
    { sku: 'SKU-ELE-104', name: 'Smartphone Charger Type-C', category: 'ELECTRONICS', cost: 3500, price: 5000, stock: 100, minStock: 20 },
    { sku: 'SKU-ELE-105', name: 'Wireless Mouse Logitech', category: 'ELECTRONICS', cost: 8000, price: 12000, stock: 50, minStock: 10 },
    
    // Groceries
    { sku: 'SKU-GRO-201', name: 'Rice 25kg Bag', category: 'GROCERIES', cost: 28000, price: 35000, stock: 200, minStock: 30 },
    { sku: 'SKU-GRO-202', name: 'Sugar 10kg', category: 'GROCERIES', cost: 15000, price: 18500, stock: 150, minStock: 25 },
    { sku: 'SKU-GRO-203', name: 'Cooking Oil 5L', category: 'GROCERIES', cost: 14000, price: 18000, stock: 80, minStock: 15 },
    { sku: 'SKU-GRO-204', name: 'Maize Flour 25kg', category: 'GROCERIES', cost: 22000, price: 27000, stock: 120, minStock: 20 },
    { sku: 'SKU-GRO-205', name: 'Salt 1kg Pack', category: 'GROCERIES', cost: 800, price: 1200, stock: 300, minStock: 50 },
    
    // Beverages
    { sku: 'SKU-BEV-301', name: 'Coca Cola 500ml (Crate)', category: 'BEVERAGES', cost: 12000, price: 15000, stock: 100, minStock: 15 },
    { sku: 'SKU-BEV-302', name: 'Fanta Orange 500ml (Crate)', category: 'BEVERAGES', cost: 11500, price: 14500, stock: 80, minStock: 15 },
    { sku: 'SKU-BEV-303', name: 'Bottled Water 500ml (Pack 24)', category: 'BEVERAGES', cost: 8000, price: 10000, stock: 150, minStock: 20 },
    { sku: 'SKU-BEV-304', name: 'Carlsberg Beer (Crate)', category: 'BEVERAGES', cost: 18000, price: 23000, stock: 60, minStock: 10 },
    { sku: 'SKU-BEV-305', name: 'Juice Box Assorted (Pack 12)', category: 'BEVERAGES', cost: 7000, price: 9500, stock: 90, minStock: 15 },
    
    // Stationery
    { sku: 'SKU-STA-401', name: 'A4 Paper Ream', category: 'STATIONERY', cost: 5500, price: 7500, stock: 200, minStock: 30 },
    { sku: 'SKU-STA-402', name: 'Pen Box (50pcs)', category: 'STATIONERY', cost: 8000, price: 11000, stock: 80, minStock: 15 },
    { sku: 'SKU-STA-403', name: 'Exercise Books (Pack 10)', category: 'STATIONERY', cost: 4000, price: 6000, stock: 150, minStock: 25 },
    { sku: 'SKU-STA-404', name: 'Stapler Heavy Duty', category: 'STATIONERY', cost: 3500, price: 5500, stock: 40, minStock: 8 },
    { sku: 'SKU-STA-405', name: 'Calculator Scientific', category: 'STATIONERY', cost: 12000, price: 16000, stock: 30, minStock: 5 },
    
    // Household
    { sku: 'SKU-HOU-501', name: 'Detergent Powder 2kg', category: 'HOUSEHOLD', cost: 6000, price: 8500, stock: 100, minStock: 20 },
    { sku: 'SKU-HOU-502', name: 'Bleach 2L', category: 'HOUSEHOLD', cost: 3000, price: 4500, stock: 80, minStock: 15 },
    { sku: 'SKU-HOU-503', name: 'Dish Soap 750ml', category: 'HOUSEHOLD', cost: 2500, price: 3800, stock: 120, minStock: 20 },
    { sku: 'SKU-HOU-504', name: 'Toilet Paper (Pack 12)', category: 'HOUSEHOLD', cost: 8000, price: 11000, stock: 90, minStock: 15 },
    { sku: 'SKU-HOU-505', name: 'Broom Plastic', category: 'HOUSEHOLD', cost: 2000, price: 3500, stock: 50, minStock: 10 },
  ]

  const createdProducts = []
  for (const product of products) {
    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
    if (product.stock === 0) status = 'OUT_OF_STOCK'
    else if (product.stock <= product.minStock) status = 'LOW_STOCK'

    const p = await prisma.product.create({
      data: {
        ...product,
        status,
      },
    })
    createdProducts.push(p)
  }

  console.log(`✅ Created ${createdProducts.length} products`)

  // Create Employees
  console.log('👔 Creating employees...')
  const employees = [
    {
      employeeId: 'EMP-001',
      name: 'Chikondi Mvula',
      email: 'chikondi@hhw.com',
      phone: '+265999123456',
      position: 'General Manager',
      department: 'Management',
      salary: 850000,
      dateEmployed: new Date('2020-01-15'),
      status: 'ACTIVE' as const,
    },
    {
      employeeId: 'EMP-002',
      name: 'Grace Mwale',
      email: 'grace@hhw.com',
      phone: '+265999234567',
      position: 'Sales Manager',
      department: 'Sales',
      salary: 550000,
      dateEmployed: new Date('2021-03-10'),
      status: 'ACTIVE' as const,
    },
    {
      employeeId: 'EMP-003',
      name: 'Steven Mbewe',
      email: 'steven@hhw.com',
      phone: '+265999345678',
      position: 'Inventory Manager',
      department: 'Warehouse',
      salary: 500000,
      dateEmployed: new Date('2021-06-01'),
      status: 'ACTIVE' as const,
    },
    {
      employeeId: 'EMP-004',
      name: 'Faith Nyasulu',
      email: 'faith@hhw.com',
      phone: '+265999456789',
      position: 'HR Officer',
      department: 'Human Resources',
      salary: 480000,
      dateEmployed: new Date('2022-02-14'),
      status: 'ACTIVE' as const,
    },
    {
      employeeId: 'EMP-005',
      name: 'James Banda',
      email: 'james@hhw.com',
      phone: '+265999567890',
      position: 'Sales Representative',
      department: 'Sales',
      salary: 380000,
      dateEmployed: new Date('2022-08-20'),
      status: 'ACTIVE' as const,
    },
  ]

  for (const employee of employees) {
    await prisma.employee.create({ data: employee })
  }

  console.log(`✅ Created ${employees.length} employees`)

  // Create Sample Sales
  console.log('💰 Creating sample sales...')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Sale 1 - Yesterday
  const sale1 = await prisma.sale.create({
    data: {
      invoiceNo: 'INV-2025-000001',
      customer: 'ABC Trading Ltd',
      customerPhone: '+265999111222',
      subtotal: 385000,
      discount: 0,
      taxable: 385000,
      vat: 67375,
      total: 452375,
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',
      cashier: 'Grace Mwale',
      saleDate: yesterday,
      userId: salesUser.id,
      items: {
        create: [
          {
            quantity: 10,
            price: 35000,
            total: 350000,
            productId: createdProducts.find(p => p.sku === 'SKU-GRO-201')!.id,
          },
          {
            quantity: 2,
            price: 17500,
            total: 35000,
            productId: createdProducts.find(p => p.sku === 'SKU-GRO-202')!.id,
          },
        ],
      },
    },
  })

  // Update stock for sale 1
  await prisma.product.update({
    where: { sku: 'SKU-GRO-201' },
    data: { stock: { decrement: 10 } },
  })
  await prisma.product.update({
    where: { sku: 'SKU-GRO-202' },
    data: { stock: { decrement: 2 } },
  })

  // Sale 2 - Today
  const sale2 = await prisma.sale.create({
    data: {
      invoiceNo: 'INV-2025-000002',
      customer: 'John Phiri',
      customerPhone: '+265888222333',
      subtotal: 362000,
      discount: 12000,
      taxable: 350000,
      vat: 61250,
      total: 411250,
      paymentMethod: 'MOBILE_MONEY',
      paymentStatus: 'PAID',
      cashier: 'Grace Mwale',
      saleDate: today,
      userId: salesUser.id,
      items: {
        create: [
          {
            quantity: 1,
            price: 350000,
            total: 350000,
            productId: createdProducts.find(p => p.sku === 'SKU-ELE-101')!.id,
          },
          {
            quantity: 1,
            price: 12000,
            total: 12000,
            productId: createdProducts.find(p => p.sku === 'SKU-ELE-105')!.id,
          },
        ],
      },
    },
  })

  // Update stock for sale 2
  await prisma.product.update({
    where: { sku: 'SKU-ELE-101' },
    data: { stock: { decrement: 1 } },
  })
  await prisma.product.update({
    where: { sku: 'SKU-ELE-105' },
    data: { stock: { decrement: 1 } },
  })

  console.log(`✅ Created 2 sample sales`)

  // Create Stock Movements
  console.log('📊 Creating stock movements...')
  const movements = [
    {
      type: 'IN' as const,
      quantity: 50,
      reference: 'PO-2025-001',
      supplier: 'Tech Distributors',
      reason: 'Purchase Order',
      notes: 'Monthly stock replenishment',
      movementDate: new Date('2025-01-10'),
      productId: createdProducts.find(p => p.sku === 'SKU-ELE-101')!.id,
    },
    {
      type: 'OUT' as const,
      quantity: 10,
      reference: 'INV-2025-000001',
      reason: 'Sale',
      movementDate: yesterday,
      productId: createdProducts.find(p => p.sku === 'SKU-GRO-201')!.id,
    },
    {
      type: 'OUT' as const,
      quantity: 1,
      reference: 'INV-2025-000002',
      reason: 'Sale',
      movementDate: today,
      productId: createdProducts.find(p => p.sku === 'SKU-ELE-101')!.id,
    },
  ]

  for (const movement of movements) {
    await prisma.stockMovement.create({ data: movement })
  }

  console.log(`✅ Created ${movements.length} stock movements`)

  // Create Business Config
  console.log('⚙️  Creating business configuration...')
  const configs = [
    { key: 'business_name', value: 'H.H Wholesalers', description: 'Company name' },
    { key: 'business_address', value: 'Area 4, Chilambura Road, Opposite Chipiku, Lilongwe', description: 'Physical address' },
    { key: 'business_phone', value: '+265 (0) 999 888 747', description: 'Contact phone' },
    { key: 'business_email', value: 'hhw.malawi@gmail.com', description: 'Contact email' },
    { key: 'vat_number', value: 'VAT-88214', description: 'VAT registration number' },
    { key: 'vat_rate', value: '17.5', description: 'VAT percentage' },
    { key: 'currency', value: 'MK', description: 'Currency symbol' },
  ]

  for (const config of configs) {
    await prisma.businessConfig.create({ data: config })
  }

  console.log(`✅ Created ${configs.length} configuration entries`)

  console.log('✅ Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
