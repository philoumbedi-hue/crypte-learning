const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runFullTest() {
    console.log("Running Full DB Integration Test...");

    try {
        // 1. Get or Create Discipline
        let discipline = await prisma.discipline.findFirst();
        if (!discipline) {
            discipline = await prisma.discipline.create({
                data: { name: "Test Discipline", description: "For testing purposes" }
            });
            console.log("Created test discipline");
        }

        // 2. Create Test Course
        const course = await prisma.course.create({
            data: {
                title: "Test Course",
                description: "Testing expansion",
                disciplineId: discipline.id
            }
        });
        console.log("Created test course");

        // 3. Create Test Module
        const module = await prisma.module.create({
            data: {
                title: "Test Module",
                order: 1,
                courseId: course.id
            }
        });
        console.log("Created test module");

        // 4. Test Quiz Creation
        const quiz = await prisma.quiz.create({
            data: {
                title: "Integration Test Quiz",
                moduleId: module.id
            }
        });
        console.log("SUCCESS: Quiz created:", quiz.title);

        // 5. Test Question Creation
        const question = await prisma.question.create({
            data: {
                text: "Does this work?",
                options: ["Yes", "No"],
                correctAnswer: "Yes",
                quizId: quiz.id
            }
        });
        console.log("SUCCESS: Question created:", question.text);

        // 6. Final Cleanup (Delete in reverse order)
        await prisma.question.delete({ where: { id: question.id } });
        await prisma.quiz.delete({ where: { id: quiz.id } });
        await prisma.module.delete({ where: { id: module.id } });
        await prisma.course.delete({ where: { id: course.id } });
        console.log("SUCCESS: All test data cleaned up.");

    } catch (error) {
        console.error("TEST FAILED:", error);
    } finally {
        await prisma.$disconnect();
    }
}

runFullTest();
