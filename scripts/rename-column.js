const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function renameColumn() {
    console.log("Attempting to rename column 'name' to 'title' in 'Course' table...");
    try {
        // Renaming the column directly in PostgreSQL
        await prisma.$executeRawUnsafe('ALTER TABLE "Course" RENAME COLUMN "name" TO "title";');
        console.log("Column renamed successfully!");

        // Now adding the unique constraint
        console.log("Adding unique constraint on 'title' and 'disciplineId'...");
        await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "Course_title_disciplineId_key" ON "Course"("title", "disciplineId");');
        console.log("Unique constraint added successfully!");

    } catch (error) {
        console.error("Error during SQL execution:", error.message);
        console.log("It might already be renamed or constraint might already exist.");
    } finally {
        await prisma.$disconnect();
    }
}

renameColumn();
