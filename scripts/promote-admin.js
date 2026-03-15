
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteAdmin() {
    const email = "starcrypte@gmail.com";
    console.log(`Promoting user to ADMIN: ${email}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            const updated = await prisma.user.update({
                where: { email: email },
                data: {
                    emailVerified: new Date(),
                    role: "ADMIN"
                }
            });
            console.log("✅ User has been PROMOTED to ADMIN and marked as VERIFIED in Prisma.");
            console.log(updated);
        } else {
            console.log("❌ User not found in Prisma.");
        }
    } catch (e) {
        console.error("💥 Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

promoteAdmin();
