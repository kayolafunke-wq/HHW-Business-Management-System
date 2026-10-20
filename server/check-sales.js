import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSales() {
  try {
    console.log('\n=== CHECKING SALES IN DATABASE ===\n');
    
    const sales = await prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Total sales: ${sales.length}\n`);
    
    if (sales.length === 0) {
      console.log('No sales found in database.');
    } else {
      sales.forEach((sale, index) => {
        console.log(`Sale ${index + 1}:`);
        console.log(`  Invoice: ${sale.invoiceNo}`);
        console.log(`  Customer: ${sale.customer}`);
        console.log(`  Total: MK ${sale.total.toLocaleString()}`);
        console.log(`  Date: ${sale.saleDate}`);
        console.log(`  Payment: ${sale.paymentMethod} - ${sale.paymentStatus}`);
        console.log(`  Items: ${sale.items.length}`);
        sale.items.forEach(item => {
          console.log(`    - ${item.product.name}: ${item.quantity} x MK ${item.price.toLocaleString()} = MK ${item.total.toLocaleString()}`);
        });
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSales();
