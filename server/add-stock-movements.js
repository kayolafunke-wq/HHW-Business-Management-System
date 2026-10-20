import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addStockMovements() {
  try {
    console.log('\n=== ADDING STOCK MOVEMENTS FOR PRODUCTS ===\n');
    
    // Get all products
    const products = await prisma.product.findMany();
    
    if (products.length === 0) {
      console.log('No products found in database.');
      return;
    }
    
    // Get admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMINISTRATOR' }
    });
    
    if (!adminUser) {
      console.log('No admin user found.');
      return;
    }
    
    console.log(`Creating stock movements for ${products.length} products by admin: ${adminUser.name}\n`);
    
    for (const product of products) {
      const movement = await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'IN',
          quantity: product.stock,
          reference: `Initial Stock - ${product.sku}`,
          supplier: 'Initial Inventory',
          reason: 'Initial stock added by administrator',
          notes: `Added ${product.stock} units of ${product.name}`,
          movementDate: new Date()
        }
      });
      
      console.log(`✓ Stock In: ${product.name}`);
      console.log(`  Quantity: ${product.stock} units`);
      console.log(`  Reference: ${movement.reference}`);
      console.log(`  Date: ${movement.movementDate.toLocaleString()}\n`);
    }
    
    console.log('=== ALL STOCK MOVEMENTS ADDED SUCCESSFULLY ===\n');
    
    const totalMovements = await prisma.stockMovement.count();
    console.log(`Total stock movements in database: ${totalMovements}\n`);
    
  } catch (error) {
    console.error('Error adding stock movements:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addStockMovements();
