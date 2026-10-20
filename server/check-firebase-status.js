/**
 * Check which users have Firebase UIDs configured
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkStatus() {
  try {
    const users = await prisma.user.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { role: 'asc' }
    })

    console.log('\n📋 User Firebase Status')
    console.log('═'.repeat(80))
    console.log(`${'Email'.padEnd(30)} | ${'Name'.padEnd(20)} | ${'Firebase UID'.padEnd(20)}`)
    console.log('─'.repeat(80))

    users.forEach(user => {
      const status = user.firebaseUid ? '✅ ' + user.firebaseUid.substring(0, 18) + '...' : '❌ NOT SET'
      console.log(`${user.email.padEnd(30)} | ${user.name.padEnd(20)} | ${status}`)
    })

    console.log('═'.repeat(80))

    const withUid = users.filter(u => u.firebaseUid).length
    const withoutUid = users.filter(u => !u.firebaseUid).length

    console.log(`\n✅ ${withUid} users configured | ❌ ${withoutUid} users need Firebase UID\n`)

    if (withoutUid > 0) {
      console.log('To update a user:')
      console.log('node update-firebase-uids.js <email> <firebase-uid>')
      console.log('\nExample:')
      console.log('node update-firebase-uids.js grace.sales@hhw.com ABC123XYZ...\n')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkStatus()
