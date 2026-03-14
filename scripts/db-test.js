
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- Database Diagnostic ---')
    console.log('Environment DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'UNDEFINED')

    try {
        console.log('Attempting to connect and count users...')
        const userCount = await prisma.user.count()
        console.log('SUCCESS: Connection established.')
        console.log('User count:', userCount)
    } catch (error) {
        console.error('FAILURE: Could not connect to database.')
        console.error('Error message:', error.message)
        console.error('Prisma Error Code:', error.code)
    } finally {
        await prisma.$disconnect()
    }
}

main()
