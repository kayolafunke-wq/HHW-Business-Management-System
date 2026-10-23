import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import saleRoutes from './routes/saleRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import auditRoutes from './routes/auditRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import userRoutes from './routes/userRoutes.js'
import setupRoutes from './routes/setupRoutes.js'
import prisma from './config/database.js'
import { seedDatabase } from './prisma/seeder.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true)

    // Allow localhost, any Railway app domain, or explicit CORS_ORIGIN
    if (
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.railway.app') ||
      origin.endsWith('.up.railway.app') ||
      process.env.CORS_ORIGIN === '*' ||
      (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN.replace(/\/+$/, ''))
    ) {
      return callback(null, true)
    }

    // Default to allow origin in production to ensure Railway client isn't blocked
    return callback(null, true)
  },
  credentials: true,
}))
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.use('/api/setup', setupRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/audit', auditRoutes)
app.use('/api/users', userRoutes)
app.use('/api/attendance', attendanceRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler (must be last)
app.use(errorHandler)

// Initialize database then start server
async function startServer() {
  // Only run db push in production (Railway). In local dev, the DB is already set up.
  if (process.env.NODE_ENV === 'production') {
    try {
      const { execSync } = await import('child_process')
      console.log('🔄 Checking database schema...')
      execSync('npx prisma db push --accept-data-loss --skip-generate', { 
        stdio: 'inherit',
        cwd: process.cwd()
      })
      console.log('✅ Database schema is ready')
    } catch (error) {
      console.error('⚠️  Database schema check failed:', error)
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 HHW Business Management API running on http://localhost:${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

startServer()

export default app
