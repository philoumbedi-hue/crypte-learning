const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function cleanup() {
    console.log("Starting database cleanup...");

    // 1. Cleanup Duplicate Disciplines
    const disciplines = await prisma.discipline.findMany({
        orderBy: { createdAt: 'asc' }
    });

    const disciplineMap = new Map();
    for (const d of disciplines) {
        if (!disciplineMap.has(d.name)) {
            disciplineMap.set(d.name, d.id);
        } else {
            const originalId = disciplineMap.get(d.name);
            console.log(`Duplicate Discipline found: "${d.name}". Merging ${d.id} into ${originalId}`);

            // Move courses to the original discipline
            await prisma.course.updateMany({
                where: { disciplineId: d.id },
                data: { disciplineId: originalId }
            });

            // Delete the duplicate
            await prisma.discipline.delete({
                where: { id: d.id }
            });
        }
    }

    // 2. Cleanup Duplicate Courses within same Discipline
    // Note: Using 'name' here as the schema hasn't been migrated to 'title' yet
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'asc' }
    });

    const courseMap = new Map(); // Key: name_disciplineId
    for (const c of courses) {
        const key = `${c.title}_${c.disciplineId}`;
        if (!courseMap.has(key)) {
            courseMap.set(key, c.id);
        } else {
            const originalId = courseMap.get(key);
            console.log(`Duplicate Course found: "${c.title}" in Discipline ${c.disciplineId}. Merging ${c.id} into ${originalId}`);

            // Move modules to original course
            await prisma.module.updateMany({
                where: { courseId: c.id },
                data: { courseId: originalId }
            });

            // Move enrollments
            await prisma.enrollment.updateMany({
                where: { courseId: c.id },
                data: { courseId: originalId }
            });

            // Move certificates
            await prisma.certificate.updateMany({
                where: { courseId: c.id },
                data: { courseId: originalId }
            });

            // Delete duplicate
            await prisma.course.delete({
                where: { id: c.id }
            });
        }
    }

    console.log("Cleanup complete!");
}

cleanup()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
