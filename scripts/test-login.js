const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testLogin(email, password) {
    console.log(`\nTesting login for: ${email}`);
    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: cleanEmail }
    });

    if (!user) {
        console.log(`FAIL: User ${cleanEmail} not found.`);
        const all = await prisma.user.findMany({ select: { email: true } });
        console.log('Available emails:', all.map(u => u.email).join(', '));
        return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
        console.log(`SUCCESS: Password match for ${email}. Role: ${user.role}`);
    } else {
        console.log(`FAIL: Password mismatch for ${email}.`);
    }
}

async function main() {
    try {
        await testLogin('admin@crypte.com', 'admin123');
        await testLogin('student@crypte.com', 'student123');
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
