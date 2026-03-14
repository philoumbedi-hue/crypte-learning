import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Testing DB connection...");
    try {
        const disciplines = await prisma.discipline.findMany({ take: 1 });
        console.log("Success! Found:", disciplines.length, "disciplines.");
    } catch (error) {
        console.error("DB Connection failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
