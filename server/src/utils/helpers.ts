export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV-${year}${random}`
}

export const generateEmployeeId = (count: number): string => {
  return `EMP-${(100 + count).toString()}`
}

export const generateSKU = (category: string, count: number): string => {
  return `SKU-${category.slice(0, 3).toUpperCase()}-${(100 + count).toString()}`
}

export const calculateVAT = (amount: number, rate: number = 0.175): number => {
  return Math.round(amount * rate)
}

export const formatCurrency = (amount: number): string => {
  return `MK ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}
