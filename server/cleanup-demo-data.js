/**
 * Complete Demo Data Cleanup Script
 * Removes ALL demo/sample data from database
 * Keeps ONLY admin user (you)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupDemoData() {
  console.log('🧹 Starting complete demo data cleanup...\n')

  try {
    // Get admin user (keep this one)
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@hhw.com' }
    })

    if (!adminUser) {
      console.log('❌ Admin user not found! Please ensure admin@hhw.com exists.')
      return
    }

    console.log(`✅ Found admin: ${adminUser.name} (${adminUser.email})`)
    console.log(`   This user will be kept.\n`)

    // 1. Delete all sales and related data
    console.log('🗑️  Deleting sales data...')
    const salesDeleted = await prisma.sale.deleteMany({})
    console.log(`   ✓ Deleted ${salesDeleted.count} sales`)

    // 2. Delete all invoices (if exists)
    console.log('🗑️  Deleting invoices...')
    try {
      const invoicesDeleted = await prisma.invoice.deleteMany({})
      console.log(`   ✓ Deleted ${invoicesDeleted.count} invoices`)
    } catch (error) {
      console.log(`   ℹ️  No invoices table found (skipped)`)
    }

    // 3. Delete all stock movements
    console.log('🗑️  Deleting stock movements...')
    const movementsDeleted = await prisma.stockMovement.deleteMany({})
    console.log(`   ✓ Deleted ${movementsDeleted.count} stock movements`)

    // 4. Delete all products
    console.log('🗑️  Deleting products...')
    const productsDeleted = await prisma.product.deleteMany({})
    console.log(`   ✓ Deleted ${productsDeleted.count} products`)

    // 5. Delete all employees (all are demo)
    console.log('🗑️  Deleting all employees...')
    const employeesDeleted = await prisma.employee.deleteMany({})
    console.log(`   ✓ Deleted ${employeesDeleted.count} employees`)

    // 6. Delete all audit logs first (before deleting users due to foreign key)
    console.log('🗑️  Deleting all audit logs...')
    const auditDeleted = await prisma.auditLog.deleteMany({})
    console.log(`   ✓ Deleted ${auditDeleted.count} audit logs`)

    // 7. Delete all users EXCEPT admin
    console.log('🗑️  Deleting demo users (keeping admin)...')
    const usersDeleted = await prisma.user.deleteMany({
      where: {
        email: {
          not: 'admin@hhw.com'
        }
      }
    })
    console.log(`   ✓ Deleted ${usersDeleted.count} demo users`)

    console.log('\n✅ Cleanup complete!')
    console.log('═'.repeat(60))
    console.log('Database is now clean. Only admin user remains.')
    console.log('\n📝 Next steps:')
    console.log('1. Login as admin (admin@hhw.com)')
    console.log('2. Go to Users page')
    console.log('3. Create your real team members')
    console.log('4. Add real products')
    console.log('5. Start making real sales!')
    console.log('═'.repeat(60))

  } catch (error) {
    console.error('❌ Cleanup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupDemoData()
