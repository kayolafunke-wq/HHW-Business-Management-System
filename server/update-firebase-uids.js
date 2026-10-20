/**
 * Helper script to update database with Firebase UIDs
 * 
 * Usage:
 * node update-firebase-uids.js grace.sales@hhw.com ABC123XYZ...
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const email = process.argv[2]
const firebaseUid = process.argv[3]

if (!email || !firebaseUid) {
  console.error('❌ Usage: node update-firebase-uids.js <email> <firebase-uid>')
  console.error('Example: node update-firebase-uids.js grace.sales@hhw.com ABC123XYZ...')
  process.exit(1)
}

async function updateUser() {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { firebaseUid }
    })

    console.log(`✅ Updated ${email}`)
    console.log(`   Firebase UID: ${firebaseUid}`)
    console.log(`   User: ${user.name} (${user.role})`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateUser()
