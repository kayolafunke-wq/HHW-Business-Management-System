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

export const generateBarcode = (): string => {
  // GS1 in-store internal distribution prefix '200' + 9 random digits
  const prefix = '200'
  const randomPart = Math.floor(100000000 + Math.random() * 900000000).toString()
  const raw12 = `${prefix}${randomPart}`

  // Standard EAN-13 modulo 10 checksum calculation
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(raw12[i], 10)
    sum += i % 2 === 0 ? digit : digit * 3
  }
  const checkDigit = (10 - (sum % 10)) % 10
  return `${raw12}${checkDigit}`
}

export const calculateVAT = (amount: number, rate: number = 0.175): number => {
  return Math.round(amount * rate)
}

export const formatCurrency = (amount: number): string => {
  return `MK ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}
