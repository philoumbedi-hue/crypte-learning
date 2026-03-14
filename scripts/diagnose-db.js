const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function diagnose() {
    console.log("=== DIAGNOSTIC CRYPTE ACADEMIA ===");

    try {
        const disciplineCount = await prisma.discipline.count();
        const courseCount = await prisma.course.count();
        const moduleCount = await prisma.module.count();
        const videoCount = await prisma.video.count();
        const quizCount = await prisma.quiz.count();

        console.log(`Disciplines: ${disciplineCount}`);
        console.log(`Courses: ${courseCount}`);
        console.log(`Modules: ${moduleCount}`);
        console.log(`Videos: ${videoCount}`);
        console.log(`Quizzes: ${quizCount}`);

        const sampleCourse = await prisma.course.findFirst({
            include: { discipline: true, modules: true }
        });

        if (sampleCourse) {
            console.log("\n--- Sample Course ---");
            console.log(`Name: ${sampleCourse.title}`);
            console.log(`Image URL: ${sampleCourse.imageUrl}`);
            console.log(`Modules count: ${sampleCourse.modules.length}`);
        } else {
            console.log("\n❌ No courses found in database.");
        }

    } catch (err) {
        console.error("❌ Error during diagnostic:", err);
    } finally {
        await prisma.$disconnect();
    }
}

diagnose();
