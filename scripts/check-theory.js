const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const modules = await prisma.module.findMany({
        select: {
            id: true,
            title: true,
            theoryContent: true,
            learningObjectives: true
        }
    });

    console.log(`Checking ${modules.length} modules...`);

    const missingTheory = modules.filter(m => !m.theoryContent);
    const missingObjectives = modules.filter(m => !m.learningObjectives);

    console.log(`Modules without theory: ${missingTheory.length}`);
    console.log(`Modules without objectives: ${missingObjectives.length}`);

    if (missingTheory.length > 0) {
        console.log("\nExamples of modules missing theory:");
        missingTheory.slice(0, 5).forEach(m => console.log(`- ${m.title} (${m.id})`));
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
