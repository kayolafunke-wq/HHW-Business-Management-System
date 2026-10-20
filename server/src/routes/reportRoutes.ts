import { Router, Response } from 'express'
import { authenticate, AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

// GET /api/reports/overview - High-level system overview report
router.get('/overview', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalProducts,
      products,
      sales,
      totalEmployees,
      activeEmployees,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.findMany({ select: { cost: true, price: true, stock: true, minStock: true, status: true } }),
      prisma.sale.findMany({
        select: {
          total: true,
          subtotal: true,
          vat: true,
          discount: true,
          paymentStatus: true,
          paymentMethod: true,
          saleDate: true,
        },
      }),
      prisma.employee.count(),
      prisma.employee.count({ where: { status: 'ACTIVE' } }),
    ])

    const totalStockValue = products.reduce((sum, p) => sum + (p.cost * p.stock), 0)
    const totalRetailValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    const lowStockCount = products.filter(p => p.stock <= p.minStock && p.stock > 0).length
    const outOfStockCount = products.filter(p => p.stock === 0).length

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0)
    const paidRevenue = sales.filter(s => s.paymentStatus === 'PAID').reduce((sum, s) => sum + s.total, 0)
    const pendingRevenue = sales.filter(s => s.paymentStatus === 'PENDING' || s.paymentStatus === 'PARTIALLY_PAID').reduce((sum, s) => sum + s.total, 0)

    res.json({
      success: true,
      data: {
        financials: {
          totalRevenue,
          paidRevenue,
          pendingRevenue,
          totalSalesCount: sales.length,
        },
        inventory: {
          totalProducts,
          totalStockValue,
          totalRetailValue,
          lowStockCount,
          outOfStockCount,
        },
        hr: {
          totalEmployees,
          activeEmployees,
        },
      },
    })
  } catch (error) {
    console.error('Error generating overview report:', error)
    res.status(500).json({ success: false, message: 'Failed to generate overview report' })
  }
})

// GET /api/reports/sales - Detailed sales report
router.get('/sales', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query

    const where: any = {}
    if (startDate || endDate) {
      where.saleDate = {}
      if (startDate) where.saleDate.gte = new Date(startDate as string)
      if (endDate) where.saleDate.lte = new Date(endDate as string)
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, sku: true, category: true, cost: true },
            },
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    })

    const summary = sales.reduce(
      (acc, s) => {
        acc.totalRevenue += s.total
        acc.totalTax += s.vat
        acc.totalDiscount += s.discount
        acc.methodCounts[s.paymentMethod] = (acc.methodCounts[s.paymentMethod] || 0) + 1
        acc.statusCounts[s.paymentStatus] = (acc.statusCounts[s.paymentStatus] || 0) + 1
        return acc
      },
      {
        totalRevenue: 0,
        totalTax: 0,
        totalDiscount: 0,
        methodCounts: {} as Record<string, number>,
        statusCounts: {} as Record<string, number>,
      }
    )

    res.json({
      success: true,
      data: {
        summary,
        count: sales.length,
        sales,
      },
    })
  } catch (error) {
    console.error('Error generating sales report:', error)
    res.status(500).json({ success: false, message: 'Failed to generate sales report' })
  }
})

// GET /api/reports/inventory - Detailed inventory valuation & turnover report
router.get('/inventory', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        stockMovements: {
          take: 5,
          orderBy: { movementDate: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    const byCategory: Record<string, { count: number; stock: number; costValue: number; retailValue: number }> = {}

    for (const p of products) {
      const cat = p.category
      if (!byCategory[cat]) {
        byCategory[cat] = { count: 0, stock: 0, costValue: 0, retailValue: 0 }
      }
      byCategory[cat].count++
      byCategory[cat].stock += p.stock
      byCategory[cat].costValue += p.cost * p.stock
      byCategory[cat].retailValue += p.price * p.stock
    }

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        byCategory,
        products,
      },
    })
  } catch (error) {
    console.error('Error generating inventory report:', error)
    res.status(500).json({ success: false, message: 'Failed to generate inventory report' })
  }
})

// GET /api/reports/performance - Business performance metrics & trends
router.get('/performance', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: { select: { cost: true } },
          },
        },
      },
      orderBy: { saleDate: 'asc' },
    })

    let totalRevenue = 0
    let totalCostOfGoods = 0

    const monthlyMap: Record<string, { revenue: number; cogs: number; profit: number; transactions: number }> = {}

    sales.forEach(sale => {
      totalRevenue += sale.total
      const saleDate = new Date(sale.saleDate)
      const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`

      let saleCogs = 0
      sale.items.forEach(item => {
        const itemCost = item.product?.cost || 0
        saleCogs += itemCost * item.quantity
      })

      totalCostOfGoods += saleCogs

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { revenue: 0, cogs: 0, profit: 0, transactions: 0 }
      }

      monthlyMap[monthKey].revenue += sale.total
      monthlyMap[monthKey].cogs += saleCogs
      monthlyMap[monthKey].profit += (sale.total - saleCogs)
      monthlyMap[monthKey].transactions++
    })

    const grossProfit = totalRevenue - totalCostOfGoods
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0.0'

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalCostOfGoods,
        grossProfit,
        profitMargin: parseFloat(profitMargin),
        transactions: sales.length,
        monthlyTrends: Object.entries(monthlyMap).map(([month, data]) => ({
          month,
          ...data,
        })),
      },
    })
  } catch (error) {
    console.error('Error generating performance report:', error)
    res.status(500).json({ success: false, message: 'Failed to generate performance report' })
  }
})

export default router
