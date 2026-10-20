import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkCategories() {
  try {
    const products = await prisma.product.findMany()
    const categories = [...new Set(products.map(p => p.category))]
    console.log('Unique categories in database:',categories)
    console.log('\nProducts by category:')
    categories.forEach(cat => {
      const count = products.filter(p => p.category === cat).length
      console.log(`  ${cat}: ${count} products`)
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCategories()
