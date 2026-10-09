import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return `MK ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export function calculateVAT(amount: number, rate: number = 0.175): number {
  return Math.round(amount * rate)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function generateSKU(category: string, index: number): string {
  return `SKU-${category.slice(0, 3).toUpperCase()}-${100 + index}`
}

export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    'IN_STOCK': 'bg-green-100 text-green-700',
    'LOW_STOCK': 'bg-amber-100 text-amber-700',
    'OUT_OF_STOCK': 'bg-red-100 text-red-700',
    'PAID': 'bg-green-100 text-green-700',
    'PENDING': 'bg-amber-100 text-amber-700',
    'PARTIALLY_PAID': 'bg-blue-100 text-blue-700',
    'ACTIVE': 'bg-green-100 text-green-700',
    'INACTIVE': 'bg-gray-100 text-gray-700',
    'ON_LEAVE': 'bg-violet-100 text-violet-700',
    'PRESENT': 'bg-green-100 text-green-700',
    'ABSENT': 'bg-red-100 text-red-700',
    'LATE': 'bg-amber-100 text-amber-700',
    'LEAVE': 'bg-violet-100 text-violet-700',
  }
  return statusMap[status] || 'bg-gray-100 text-gray-700'
}
