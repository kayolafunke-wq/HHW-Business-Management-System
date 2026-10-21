import prisma from '../config/database.js'
import bcrypt from 'bcryptjs'

export async function seedDatabase(clearExisting = false): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🌱 Starting database seed...')

    if (clearExisting) {
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
    }

    // 1. Create or ensure Users
    console.log('👥 Seeding users...')
    const hashedPassword = await bcrypt.hash('password123', 10)

    const admin = await prisma.user.upsert({
      where: { email: 'admin@hhw.com' },
      update: {},
      create: {
        firebaseUid: 'firebase-admin-uid',
        name: 'Chikondi Mvula',
        email: 'admin@hhw.com',
        username: 'admin',
        role: 'ADMINISTRATOR',
        status: 'ACTIVE',
      },
    })

    const salesUser = await prisma.user.upsert({
      where: { email: 'grace.sales@hhw.com' },
      update: {},
      create: {
        firebaseUid: 'firebase-sales-uid',
        name: 'Grace Mwale',
        email: 'grace.sales@hhw.com',
        username: 'grace.sales',
        role: 'SALES_USER',
        status: 'ACTIVE',
      },
    })

    await prisma.user.upsert({
      where: { email: 'steven.inv@hhw.com' },
      update: {},
      create: {
        firebaseUid: 'firebase-inventory-uid',
        name: 'Steven Mbewe',
        email: 'steven.inv@hhw.com',
        username: 'steven.inv',
        role: 'INVENTORY_USER',
        status: 'ACTIVE',
      },
    })

    await prisma.user.upsert({
      where: { email: 'faith.hr@hhw.com' },
      update: {},
      create: {
        firebaseUid: 'firebase-hr-uid',
        name: 'Faith Nyasulu',
        email: 'faith.hr@hhw.com',
        username: 'faith.hr',
        role: 'HR_USER',
        status: 'ACTIVE',
      },
    })

    // 2. Create Products
    console.log('📦 Seeding products...')
    const products = [
      // Electronics
      { sku: 'SKU-ELE-101', name: 'Samsung Galaxy A54', category: 'ELECTRONICS' as const, cost: 280000, price: 350000, stock: 25, minStock: 5 },
      { sku: 'SKU-ELE-102', name: 'HP Laptop 15-inch', category: 'ELECTRONICS' as const, cost: 450000, price: 550000, stock: 15, minStock: 3 },
      { sku: 'SKU-ELE-103', name: 'Dell Monitor 24"', category: 'ELECTRONICS' as const, cost: 120000, price: 150000, stock: 30, minStock: 5 },
      { sku: 'SKU-ELE-104', name: 'Smartphone Charger Type-C', category: 'ELECTRONICS' as const, cost: 3500, price: 5000, stock: 100, minStock: 20 },
      { sku: 'SKU-ELE-105', name: 'Wireless Mouse Logitech', category: 'ELECTRONICS' as const, cost: 8000, price: 12000, stock: 50, minStock: 10 },
      
      // Groceries
      { sku: 'SKU-GRO-201', name: 'Rice 25kg Bag', category: 'GROCERIES' as const, cost: 28000, price: 35000, stock: 200, minStock: 30 },
      { sku: 'SKU-GRO-202', name: 'Sugar 10kg', category: 'GROCERIES' as const, cost: 15000, price: 18500, stock: 150, minStock: 25 },
      { sku: 'SKU-GRO-203', name: 'Cooking Oil 5L', category: 'GROCERIES' as const, cost: 14000, price: 18000, stock: 80, minStock: 15 },
      { sku: 'SKU-GRO-204', name: 'Maize Flour 25kg', category: 'GROCERIES' as const, cost: 22000, price: 27000, stock: 120, minStock: 20 },
      { sku: 'SKU-GRO-205', name: 'Salt 1kg Pack', category: 'GROCERIES' as const, cost: 800, price: 1200, stock: 300, minStock: 50 },
      
      // Beverages
      { sku: 'SKU-BEV-301', name: 'Coca Cola 500ml (Crate)', category: 'BEVERAGES' as const, cost: 12000, price: 15000, stock: 100, minStock: 15 },
      { sku: 'SKU-BEV-302', name: 'Fanta Orange 500ml (Crate)', category: 'BEVERAGES' as const, cost: 11500, price: 14500, stock: 80, minStock: 15 },
      { sku: 'SKU-BEV-303', name: 'Bottled Water 500ml (Pack 24)', category: 'BEVERAGES' as const, cost: 8000, price: 10000, stock: 150, minStock: 20 },
      { sku: 'SKU-BEV-304', name: 'Carlsberg Beer (Crate)', category: 'BEVERAGES' as const, cost: 18000, price: 23000, stock: 60, minStock: 10 },
      { sku: 'SKU-BEV-305', name: 'Juice Box Assorted (Pack 12)', category: 'BEVERAGES' as const, cost: 7000, price: 9500, stock: 90, minStock: 15 },
      
      // Stationery
      { sku: 'SKU-STA-401', name: 'A4 Paper Ream', category: 'STATIONERY' as const, cost: 5500, price: 7500, stock: 200, minStock: 30 },
      { sku: 'SKU-STA-402', name: 'Pen Box (50pcs)', category: 'STATIONERY' as const, cost: 8000, price: 11000, stock: 80, minStock: 15 },
      { sku: 'SKU-STA-403', name: 'Exercise Books (Pack 10)', category: 'STATIONERY' as const, cost: 4000, price: 6000, stock: 150, minStock: 25 },
      { sku: 'SKU-STA-404', name: 'Stapler Heavy Duty', category: 'STATIONERY' as const, cost: 3500, price: 5500, stock: 40, minStock: 8 },
      { sku: 'SKU-STA-405', name: 'Calculator Scientific', category: 'STATIONERY' as const, cost: 12000, price: 16000, stock: 30, minStock: 5 },
      
      // Household
      { sku: 'SKU-HOU-501', name: 'Detergent Powder 2kg', category: 'HOUSEHOLD' as const, cost: 6000, price: 8500, stock: 100, minStock: 20 },
      { sku: 'SKU-HOU-502', name: 'Bleach 2L', category: 'HOUSEHOLD' as const, cost: 3000, price: 4500, stock: 80, minStock: 15 },
      { sku: 'SKU-HOU-503', name: 'Dish Soap 750ml', category: 'HOUSEHOLD' as const, cost: 2500, price: 3800, stock: 120, minStock: 20 },
      { sku: 'SKU-HOU-504', name: 'Toilet Paper (Pack 12)', category: 'HOUSEHOLD' as const, cost: 8000, price: 11000, stock: 90, minStock: 15 },
      { sku: 'SKU-HOU-505', name: 'Broom Plastic', category: 'HOUSEHOLD' as const, cost: 2000, price: 3500, stock: 50, minStock: 10 },
    ]

    for (const prod of products) {
      let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
      if (prod.stock === 0) status = 'OUT_OF_STOCK'
      else if (prod.stock <= prod.minStock) status = 'LOW_STOCK'

      await prisma.product.upsert({
        where: { sku: prod.sku },
        update: {},
        create: {
          ...prod,
          status,
        },
      })
    }

    // 3. Create Employees
    console.log('👔 Seeding employees...')
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

    for (const emp of employees) {
      await prisma.employee.upsert({
        where: { email: emp.email },
        update: {},
        create: emp,
      })
    }

    // 4. Create Business Config
    console.log('⚙️  Seeding business config...')
    const configs = [
      { key: 'business_name', value: 'H.H Wholesalers', description: 'Company name' },
      { key: 'business_address', value: 'Area 4, Chilambura Road, Opposite Chipiku, Lilongwe', description: 'Physical address' },
      { key: 'business_phone', value: '+265 (0) 999 888 747', description: 'Contact phone' },
      { key: 'business_email', value: 'hhw.malawi@gmail.com', description: 'Contact email' },
      { key: 'vat_number', value: 'VAT-88214', description: 'VAT registration number' },
      { key: 'vat_rate', value: '17.5', description: 'VAT percentage' },
      { key: 'currency', value: 'MK', description: 'Currency symbol' },
    ]

    for (const conf of configs) {
      await prisma.businessConfig.upsert({
        where: { key: conf.key },
        update: {},
        create: conf,
      })
    }

    // 5. Create Sample Sales if none exist
    const salesCount = await prisma.sale.count()
    if (salesCount === 0) {
      const riceProduct = await prisma.product.findUnique({ where: { sku: 'SKU-GRO-201' } })
      const sugarProduct = await prisma.product.findUnique({ where: { sku: 'SKU-GRO-202' } })
      const tvProduct = await prisma.product.findUnique({ where: { sku: 'SKU-ELE-101' } })
      const mouseProduct = await prisma.product.findUnique({ where: { sku: 'SKU-ELE-105' } })

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (riceProduct && sugarProduct) {
        await prisma.sale.create({
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
                { quantity: 10, price: 35000, total: 350000, productId: riceProduct.id },
                { quantity: 2, price: 17500, total: 35000, productId: sugarProduct.id },
              ],
            },
          },
        })
      }

      if (tvProduct && mouseProduct) {
        await prisma.sale.create({
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
            saleDate: new Date(),
            userId: salesUser.id,
            items: {
              create: [
                { quantity: 1, price: 350000, total: 350000, productId: tvProduct.id },
                { quantity: 1, price: 12000, total: 12000, productId: mouseProduct.id },
              ],
            },
          },
        })
      }
    }

    console.log('✅ Database seeded successfully!')
    return { success: true, message: 'Database successfully seeded with initial data!' }
  } catch (error: any) {
    console.error('❌ Seeder error:', error)
    return { success: false, message: error.message || 'Seeder failed' }
  }
}
