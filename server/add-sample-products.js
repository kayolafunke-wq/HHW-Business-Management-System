import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to generate a random barcode (13 digits - EAN-13 format)
function generateBarcode() {
  let barcode = '';
  for (let i = 0; i < 13; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  return barcode;
}

// Function to generate SKU
function generateSKU(category, index) {
  const prefix = category === 'ELECTRONICS' ? 'ELEC' : category === 'HARDWARE' ? 'HARD' : 'BUILD';
  return `${prefix}-${String(index).padStart(4, '0')}`;
}

const products = [
  // Electronics
  {
    name: 'Samsung 32" LED TV',
    category: 'ELECTRONICS',
    description: '32-inch LED Smart TV with HD display',
    cost: 180000,
    price: 265000,
    stock: 12,
    minStock: 3,
    barcode: generateBarcode(),
    status: 'IN_STOCK'
  },
  {
    name: 'Wireless Bluetooth Speaker',
    category: 'ELECTRONICS',
    description: 'Portable Bluetooth speaker with 10-hour battery life',
    cost: 15000,
    price: 25000,
    stock: 25,
    minStock: 5,
    barcode: generateBarcode(),
    status: 'IN_STOCK'
  },
  
  // Hardware
  {
    name: 'Hammer 500g',
    category: 'HARDWARE',
    description: 'Professional claw hammer with rubber grip',
    cost: 3500,
    price: 6500,
    stock: 50,
    minStock: 10,
    barcode: generateBarcode(),
    status: 'IN_STOCK'
  },
  {
    name: 'Power Drill Set',
    category: 'HARDWARE',
    description: '18V cordless drill with 20-piece accessory kit',
    cost: 45000,
    price: 75000,
    stock: 8,
    minStock: 2,
    barcode: generateBarcode(),
    status: 'IN_STOCK'
  },
  
  // Building Materials
  {
    name: 'Cement 50kg Bag',
    category: 'BUILDING_MATERIALS',
    description: 'High-quality Portland cement, 50kg bag',
    cost: 18000,
    price: 28000,
    stock: 100,
    minStock: 20,
    barcode: generateBarcode(),
    status: 'IN_STOCK'
  }
];

async function addProducts() {
  try {
    console.log('\n=== ADDING SAMPLE PRODUCTS ===\n');
    
    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      const sku = generateSKU(productData.category, i + 1);
      
      const product = await prisma.product.create({
        data: {
          sku: sku,
          name: productData.name,
          category: productData.category,
          description: productData.description,
          cost: productData.cost,
          price: productData.price,
          stock: productData.stock,
          minStock: productData.minStock,
          barcode: productData.barcode,
          status: productData.status
        }
      });
      
      console.log(`✓ Added: ${product.name}`);
      console.log(`  SKU: ${product.sku}`);
      console.log(`  Barcode: ${product.barcode}`);
      console.log(`  Category: ${product.category}`);
      console.log(`  Price: MK ${product.price.toLocaleString()}`);
      console.log(`  Stock: ${product.stock} units\n`);
    }
    
    console.log('=== ALL PRODUCTS ADDED SUCCESSFULLY ===\n');
    
    // Show summary
    const totalProducts = await prisma.product.count();
    console.log(`Total products in database: ${totalProducts}\n`);
    
  } catch (error) {
    console.error('Error adding products:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addProducts();
