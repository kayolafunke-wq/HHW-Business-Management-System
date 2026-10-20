import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkStockMovements() {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: {
        product: {
          select: {
            name: true,
            sku: true
          }
        }
      },
      orderBy: {
        movementDate: 'desc'
      }
    })
    
    console.log(`Total stock movements: ${movements.length}\n`)
    
    movements.forEach((m, i) => {
      console.log(`${i + 1}. ${m.type}: ${m.product.name}`)
      console.log(`   Quantity: ${m.quantity}`)
      console.log(`   Reference: ${m.reference}`)
      console.log(`   Date: ${m.movementDate}`)
      console.log()
    })
    
    const inCount = movements.filter(m => m.type === 'IN').length
    const outCount = movements.filter(m => m.type === 'OUT').length
    
    console.log(`Summary: ${inCount} IN, ${outCount} OUT`)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStockMovements()
