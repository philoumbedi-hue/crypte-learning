const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testQuizActions() {
    console.log("Testing Quiz Server Actions (Mocking local DB calls)...");

    try {
        // Find a module to add a quiz to
        const module = await prisma.module.findFirst();
        if (!module) {
            console.log("No module found to test. Please create a module first.");
            return;
        }

        console.log(`Using module: ${module.title} (${module.id})`);

        // Test Create Quiz (direct DB call since it's a test script)
        const quiz = await prisma.quiz.create({
            data: {
                title: "Test Admin Quiz",
                moduleId: module.id
            }
        });
        console.log("SUCCESS: Quiz created:", quiz.title);

        // Test Create Question
        const question = await prisma.question.create({
            data: {
                text: "What is 2+2?",
                options: ["3", "4", "5"],
                correctAnswer: "4",
                quizId: quiz.id
            }
        });
        console.log("SUCCESS: Question created:", question.text);

        // Cleanup
        await prisma.question.delete({ where: { id: question.id } });
        await prisma.quiz.delete({ where: { id: quiz.id } });
        console.log("SUCCESS: Cleanup complete.");

    } catch (error) {
        console.error("FAILURE:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testQuizActions();
