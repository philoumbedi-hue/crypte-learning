const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
    const filePath = path.join(__dirname, "..", "academic_structure.txt");
    const content = fs.readFileSync(filePath, "utf-8");

    const sections = content.split("Discipline:").filter(Boolean);

    console.log(`Starting bulk import of ${sections.length} disciplines...`);

    for (const section of sections) {
        const lines = section.split("\n");
        const disName = lines.find(l => l.startsWith("Nom:"))?.replace("Nom:", "").trim();
        const disDesc = lines.find(l => l.startsWith("Description:"))?.replace("Description:", "").trim();

        if (!disName) continue;

        const discipline = await prisma.discipline.upsert({
            where: { name: disName },
            update: { description: disDesc },
            create: { name: disName, description: disDesc }
        });

        console.log(`- Discipline: ${disName}`);

        const courseSections = section.split("Cours:").slice(1);
        for (const courseSection of courseSections) {
            const cLines = courseSection.split("\n");
            const cTitle = cLines.find(l => l.startsWith("Titre:"))?.replace("Titre:", "").trim();
            const cDesc = cLines.find(l => l.startsWith("Description:"))?.replace("Description:", "").trim();
            const cLevel = cLines.find(l => l.startsWith("Niveau:"))?.replace("Niveau:", "").trim();

            if (!cTitle) continue;

            // Simple check to avoid duplicates by name in the same discipline
            const existingCourse = await prisma.course.findFirst({
                where: { name: cTitle, disciplineId: discipline.id }
            });

            if (!existingCourse) {
                await prisma.course.create({
                    data: {
                        name: cTitle,
                        description: cDesc, // Note: You might want to store Level in a new column if you add it to Prisma later
                        disciplineId: discipline.id
                    }
                });
                console.log(`  + Cours: ${cTitle}`);
            }
        }
    }

    console.log("Bulk import complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
