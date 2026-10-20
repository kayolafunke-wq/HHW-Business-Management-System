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

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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

// Start server
app.listen(PORT, async () => {
  // Auto-create database tables if they don't exist
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
  
  console.log(`🚀 HHW Business Management API running on http://localhost:${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
})

export default app
