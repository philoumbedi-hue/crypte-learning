
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    const email = "starcrypte@gmail.com";
    console.log(`Checking user in DB: ${email}`);

    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            console.log("✅ User found in Prisma:");
            console.log(`- ID: ${user.id}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Email Verified: ${user.emailVerified}`);

            if (!user.emailVerified) {
                console.log("⚠️ User is NOT verified. Forcing verification...");
                const updated = await prisma.user.update({
                    where: { email: email },
                    data: { emailVerified: new Date() }
                });
                console.log("🚀 User has been MANUALLY verified in Prisma.");
            }
        } else {
            console.log("❌ User not found in Prisma.");
        }
    } catch (e) {
        console.error("💥 Error checking DB:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
