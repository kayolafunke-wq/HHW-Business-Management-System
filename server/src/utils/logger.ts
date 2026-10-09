import prisma from '../config/database.js'

export const logAudit = async (
  userId: string,
  action: string,
  details?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}
