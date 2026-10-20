import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEmployees() {
  try {
    const employees = await prisma.employee.findMany();
    console.log('\n=== EMPLOYEES IN DATABASE ===');
    console.log(`Total count: ${employees.length}\n`);
    
    if (employees.length === 0) {
      console.log('No employees found in database.');
    } else {
      employees.forEach(emp => {
        console.log(`ID: ${emp.id}`);
        console.log(`Employee ID: ${emp.employeeId}`);
        console.log(`Name: ${emp.name}`);
        console.log(`Email: ${emp.email}`);
        console.log(`Position: ${emp.position}`);
        console.log(`Department: ${emp.department}`);
        console.log(`Status: ${emp.status}`);
        console.log(`Created: ${emp.createdAt}`);
        console.log('---');
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmployees();
