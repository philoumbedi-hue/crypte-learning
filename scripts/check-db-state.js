const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
    try {
        const disciplines = await prisma.discipline.findMany();
        const courses = await prisma.course.findMany({
            include: { discipline: true }
        });
        console.log(JSON.stringify({
            disciplines: disciplines.map(d => ({ id: d.id, name: d.name })),
            courses: courses.map(c => ({ id: c.id, title: c.title, discipline: c.discipline.name }))
        }, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDb();
