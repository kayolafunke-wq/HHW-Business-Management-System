/**
 * Script to create Firebase users for all database users
 * Run this once to sync database users with Firebase Authentication
 */

import admin from 'firebase-admin'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Initialize Firebase Admin with project ID
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'business-management-syst-80c96'
  })
}

const auth = admin.auth()

async function setupFirebaseUsers() {
  try {
    console.log('🔥 Setting up Firebase users...\n')

    // Get all active users from database
    const users = await prisma.user.findMany({
      where: { status: 'ACTIVE' }
    })

    console.log(`Found ${users.length} users in database\n`)

    for (const user of users) {
      try {
        // Check if Firebase user already exists
        let firebaseUser
        try {
          if (user.firebaseUid) {
            firebaseUser = await auth.getUser(user.firebaseUid)
            console.log(`✅ Firebase user already exists: ${user.email}`)
          } else {
            throw new Error('No Firebase UID')
          }
        } catch (error) {
          // Create Firebase user
          firebaseUser = await auth.createUser({
            email: user.email,
            password: 'password123', // Default password
            displayName: user.name,
            emailVerified: true
          })

          console.log(`✨ Created Firebase user: ${user.email}`)

          // Update database with Firebase UID
          await prisma.user.update({
            where: { id: user.id },
            data: { firebaseUid: firebaseUser.uid }
          })

          console.log(`📝 Updated database with Firebase UID for ${user.email}`)
        }

      } catch (error) {
        console.error(`❌ Error processing ${user.email}:`, error.message)
      }
    }

    console.log('\n✅ Firebase user setup complete!')
    console.log('\n📋 Login credentials (all passwords: password123):')
    console.log('─'.repeat(60))
    
    const updatedUsers = await prisma.user.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { role: 'asc' }
    })

    updatedUsers.forEach(user => {
      console.log(`${user.role.padEnd(20)} | ${user.email.padEnd(30)} | ${user.name}`)
    })
    console.log('─'.repeat(60))

  } catch (error) {
    console.error('❌ Setup failed:', error)
  } finally {
    await prisma.$disconnect()
    process.exit(0)
  }
}

setupFirebaseUsers()
