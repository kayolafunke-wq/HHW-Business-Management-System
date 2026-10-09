import prisma from '../config/database.js'
import { auth } from '../config/firebase.js'

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users in Firebase and database
  const demoUsers = [
    {
      name: 'Admin User',
      email: 'admin@hhw.com',
      username: 'admin',
      password: 'password123',
      role: 'ADMINISTRATOR',
    },
    {
      name: 'Grace Mwale',
      email: 'sales@hhw.com',
      username: 'grace.sales',
      password: 'password123',
      role: 'SALES_USER',
    },
    {
      name: 'Steven Mbewe',
      email: 'inventory@hhw.com',
      username: 'steven.inv',
      password: 'password123',
      role: 'INVENTORY_USER',
    },
    {
      name: 'Faith Nyasulu',
      email: 'hr@hhw.com',
      username: 'faith.hr',
      password: 'password123',
      role: 'HR_USER',
    },
  ]

  console.log('Creating demo users...')
  for (const userData of demoUsers) {
    try {
      // Check if user exists in Firebase
      let firebaseUser
      try {
        firebaseUser = await auth.getUserByEmail(userData.email)
        console.log(`  ✓ Firebase user already exists: ${userData.email}`)
      } catch {
        // Create in Firebase
        firebaseUser = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.name,
        })
        console.log(`  ✓ Created Firebase user: ${userData.email}`)
      }

      // Check if user exists in database
      const existingUser = await prisma.user.findUnique({
        where: { firebaseUid: firebaseUser.uid },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            firebaseUid: firebaseUser.uid,
            name: userData.name,
            email: userData.email,
            username: userData.username,
            role: userData.role as any,
            status: 'ACTIVE',
          },
        })
        console.log(`  ✓ Created database user: ${userData.name}`)
      } else {
        console.log(`  ✓ Database user already exists: ${userData.name}`)
      }
    } catch (error) {
      console.error(`  ✗ Error creating user ${userData.email}:`, error)
    }
  }

  // Seed Products
  console.log('\nCreating sample products...')
  const productData = [
    { name: 'Samsung 32" LED TV', category: 'ELECTRONICS', cost: 210000, price: 265000, stock: 14, minStock: 5 },
    { name: 'HP LaserJet Printer', category: 'ELECTRONICS', cost: 185000, price: 235000, stock: 6, minStock: 4 },
    { name: 'Wireless Mouse Logitech', category: 'ELECTRONICS', cost: 9500, price: 15500, stock: 42, minStock: 15 },
    { name: 'Rice 25kg Bag', category: 'GROCERIES', cost: 38000, price: 46000, stock: 32, minStock: 10 },
    { name: 'Cooking Oil 5L', category: 'GROCERIES', cost: 21000, price: 27500, stock: 18, minStock: 10 },
    { name: 'Coca-Cola 500ml (Crate)', category: 'BEVERAGES', cost: 13500, price: 18500, stock: 26, minStock: 8 },
    { name: 'A4 Paper Ream', category: 'STATIONERY', cost: 9800, price: 13500, stock: 55, minStock: 15 },
    { name: 'Laundry Detergent 2kg', category: 'HOUSEHOLD', cost: 6900, price: 10200, stock: 37, minStock: 12 },
    { name: "Men's Cotton T-Shirt", category: 'CLOTHING', cost: 5200, price: 9800, stock: 22, minStock: 10 },
    { name: 'Office Chair', category: 'OTHER', cost: 45000, price: 62000, stock: 8, minStock: 5 },
  ]

  for (let i = 0; i < productData.length; i++) {
    const product = productData[i]
    const sku = `SKU-${product.category.slice(0, 3)}-${100 + i}`
    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
    if (product.stock === 0) status = 'OUT_OF_STOCK'
    else if (product.stock <= product.minStock) status = 'LOW_STOCK'

    await prisma.product.upsert({
      where: { sku },
      update: {},
      create: {
        sku,
        name: product.name,
        category: product.category as any,
        cost: product.cost,
        price: product.price,
        stock: product.stock,
        minStock: product.minStock,
        status,
      },
    })
  }
  console.log(`  ✓ Created ${productData.length} products`)

  // Seed Employees
  console.log('\nCreating sample employees...')
  const employeeData = [
    { name: 'John Banda', email: 'john.banda@hhw.com', phone: '+265881234567', position: 'Sales Associate', department: 'Sales', salary: 180000 },
    { name: 'Grace Phiri', email: 'grace.phiri@hhw.com', phone: '+265881234568', position: 'Store Keeper', department: 'Inventory', salary: 195000 },
    { name: 'Bright Kamanga', email: 'bright.kamanga@hhw.com', phone: '+265881234569', position: 'Cashier', department: 'Finance', salary: 175000 },
    { name: 'Chisomo Zulu', email: 'chisomo.zulu@hhw.com', phone: '+265881234570', position: 'HR Officer', department: 'HR', salary: 220000 },
    { name: 'Patricia Nkhoma', email: 'patricia.nkhoma@hhw.com', phone: '+265881234571', position: 'Operations Manager', department: 'Operations', salary: 285000 },
  ]

  for (let i = 0; i < employeeData.length; i++) {
    const emp = employeeData[i]
    const employeeId = `EMP-${100 + i}`

    await prisma.employee.upsert({
      where: { employeeId },
      update: {},
      create: {
        employeeId,
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        position: emp.position,
        department: emp.department,
        salary: emp.salary,
        dateEmployed: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
        status: 'ACTIVE',
        address: 'Area 47, Lilongwe',
        emergencyContact: '+265991234567',
      },
    })
  }
  console.log(`  ✓ Created ${employeeData.length} employees`)

  console.log('\n✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
