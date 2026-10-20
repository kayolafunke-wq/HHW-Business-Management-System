import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSalesAPI() {
  try {
    console.log('=== TESTING SALES API DATA ===\n')
    
    // Fetch sales with items
    const sales = await prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        saleDate: 'desc'
      }
    })
    
    console.log(`Total sales found: ${sales.length}\n`)
    
    sales.forEach((sale, index) => {
      console.log(`Sale ${index + 1}:`)
      console.log(`  Invoice: ${sale.invoiceNo}`)
      console.log(`  Customer: ${sale.customer}`)
      console.log(`  Total: MK ${sale.total.toLocaleString()}`)
      console.log(`  Date: ${sale.saleDate}`)
      console.log(`  Payment Status: ${sale.paymentStatus}`)
      console.log(`  Items: ${sale.items.length}`)
      sale.items.forEach(item => {
        console.log(`    - ${item.product.name}: ${item.quantity} x MK ${item.price.toLocaleString()} = MK ${item.total.toLocaleString()}`)
      })
      console.log(`  Subtotal: MK ${sale.subtotal.toLocaleString()}`)
      console.log(`  Discount: MK ${sale.discount.toLocaleString()}`)
      console.log(`  VAT: MK ${sale.vat.toLocaleString()}`)
      console.log(`  Total: MK ${sale.total.toLocaleString()}`)
      console.log()
    })
    
    // Test what the API would return
    console.log('=== API RESPONSE FORMAT ===\n')
    const apiResponse = {
      success: true,
      data: sales
    }
    console.log(JSON.stringify(apiResponse, null, 2))
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testSalesAPI()
