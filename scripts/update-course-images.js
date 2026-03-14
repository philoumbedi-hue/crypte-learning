const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Harmonisation visuelle COMPLETE de la plateforme...");

    // 1. Update Disciplines
    const disciplines = await prisma.discipline.findMany();
    console.log(`Updating ${disciplines.length} disciplines...`);

    for (const discipline of disciplines) {
        const query = encodeURIComponent(discipline.name);
        const imageUrl = `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200`; // Academic default

        // We use featured keyword for better results
        const varietyImage = `https://images.unsplash.com/featured/?${query},university,academic`;

        await prisma.discipline.update({
            where: { id: discipline.id },
            data: { imageUrl: varietyImage }
        });
        console.log(`✅ Discipline: ${discipline.name}`);
    }

    // 2. Update Courses
    const courses = await prisma.course.findMany({
        include: { discipline: true }
    });
    console.log(`Updating ${courses.length} courses...`);

    for (const course of courses) {
        const query = encodeURIComponent(`${course.discipline.name} ${course.name}`);
        const courseImage = `https://images.unsplash.com/featured/?${query},technology,study`;

        await prisma.course.update({
            where: { id: course.id },
            data: { imageUrl: courseImage }
        });
        console.log(`✅ Course: ${course.name}`);
    }

    console.log("✨ Plateforme mise à jour avec succès !");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
