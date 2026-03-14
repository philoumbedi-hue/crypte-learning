const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log("Testing connection...");
        const count = await prisma.discipline.count();
        console.log("Connection successful! Discipline count:", count);
    } catch (error) {
        console.error("Connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
