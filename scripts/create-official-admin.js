const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'philoumbedi@gmail.com';
    const password = 'admin123'; // Chose a temporary password
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log(`Creating official Super Admin: ${email}...`);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: 'SUPER_ADMIN',
                password: hashedPassword,
                emailVerified: new Date(),
            },
            create: {
                email,
                name: 'Super Admin Official',
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                emailVerified: new Date(),
            },
        });

        console.log('--- SUCCESS ---');
        console.log(`User ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Password: ${password}`);
        console.log('----------------');
        console.log('IMPORTANT: Change this password immediately after logging in.');
    } catch (error) {
        console.error('Error creating super admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
