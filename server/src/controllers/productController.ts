import { Response } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import prisma from '../config/database.js'
import { generateSKU } from '../utils/helpers.js'
import { logAudit } from '../utils/logger.js'

export const getAllProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, status, search } = req.query

    const where: any = {}

    if (category) where.category = category
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { sku: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json({ success: true, data: products })
  } catch (error: any) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
}

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stockMovements: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    res.json({ success: true, data: product })
  } catch (error: any) {
    console.error('Get product error:', error)
    res.status(500).json({ message: 'Failed to fetch product' })
  }
}

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sku, name, category, description, cost, price, stock, minStock } = req.body

    // Validate required fields
    if (!name || !category || cost === undefined || price === undefined || stock === undefined || minStock === undefined) {
      res.status(400).json({ message: 'Missing required fields' })
      return
    }

    // Use provided SKU or generate one
    let productSku = sku
    if (!productSku) {
      const productCount = await prisma.product.count()
      productSku = generateSKU(category, productCount + 1)
    }

    // Check if SKU already exists
    const existingProduct = await prisma.product.findUnique({
      where: { sku: productSku },
    })

    if (existingProduct) {
      res.status(400).json({ message: 'SKU already exists' })
      return
    }

    // Determine status based on stock
    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK'
    if (stock === 0) status = 'OUT_OF_STOCK'
    else if (stock <= minStock) status = 'LOW_STOCK'

    const product = await prisma.product.create({
      data: {
        sku: productSku,
        name,
        category,
        description,
        cost: parseFloat(cost),
        price: parseFloat(price),
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        status,
      },
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Product Created',
        `Added product: ${name} (${productSku})`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.status(201).json({ success: true, data: product, message: 'Product created successfully' })
  } catch (error: any) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Failed to create product', error: error.message })
  }
}

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { name, category, description, cost, price, stock, minStock } = req.body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (cost !== undefined) updateData.cost = parseFloat(cost)
    if (price !== undefined) updateData.price = parseFloat(price)
    if (stock !== undefined) updateData.stock = parseInt(stock)
    if (minStock !== undefined) updateData.minStock = parseInt(minStock)

    // Determine status based on stock
    if (stock !== undefined || minStock !== undefined) {
      const finalStock = stock !== undefined ? parseInt(stock) : existingProduct.stock
      const finalMinStock = minStock !== undefined ? parseInt(minStock) : existingProduct.minStock
      
      if (finalStock === 0) updateData.status = 'OUT_OF_STOCK'
      else if (finalStock <= finalMinStock) updateData.status = 'LOW_STOCK'
      else updateData.status = 'IN_STOCK'
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Product Updated',
        `Updated product: ${product.name}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, data: product, message: 'Product updated successfully' })
  } catch (error: any) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Failed to update product', error: error.message })
  }
}

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({ where: { id } })

    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    await prisma.product.delete({ where: { id } })

    // Log audit
    if (req.user) {
      await logAudit(
        req.user.id,
        'Product Deleted',
        `Deleted product: ${product.name}`,
        req.ip,
        req.get('user-agent')
      )
    }

    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Failed to delete product' })
  }
}
