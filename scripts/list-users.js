const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { email: true, role: true, emailVerified: true }
    });
    console.log('Utilisateurs en base :', users);
    await prisma.$disconnect();
}

main();
