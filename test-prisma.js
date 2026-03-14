const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting to connect to database...");
        const result = await prisma.$queryRaw`SELECT NOW()`;
        console.log("Connection successful!");
        console.log("Database time:", result);
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
