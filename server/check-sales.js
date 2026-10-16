import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function checkSales() {
  const sales = await prisma.sale.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      invoiceNo: true,
      cashier: true,
      userId: true,
      total: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })
  
  console.log('Recent sales:')
  sales.forEach(sale => {
    console.log(`${sale.invoiceNo}: ${sale.cashier} (User: ${sale.user.name}, ID: ${sale.userId})`)
  })
  
  await prisma.$disconnect()
}

checkSales()
