const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const course = await prisma.course.findFirst({
        where: { title: 'Architecture de Défense & Résilience Réseau' },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    videos: { orderBy: { createdAt: 'asc' } },
                    documents: { orderBy: { createdAt: 'asc' } }
                }
            }
        }
    });
    console.log(JSON.stringify(course, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
