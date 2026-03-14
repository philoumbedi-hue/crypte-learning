const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    console.log("Seeding test users (CommonJS)...");

    await prisma.user.upsert({
        where: { email: "admin@crypte.com" },
        update: { password: adminPassword, role: "SUPER_ADMIN" },
        create: {
            email: "admin@crypte.com",
            name: "Admin Philo",
            password: adminPassword,
            role: "SUPER_ADMIN",
        },
    });




    await prisma.user.upsert({
        where: { email: "student@crypte.com" },
        update: { password: studentPassword, role: "STUDENT" },
        create: {
            email: "student@crypte.com",
            name: "Student Philo",
            password: studentPassword,
            role: "STUDENT",
        },
    });

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
