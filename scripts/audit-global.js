const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function auditGlobal() {
    console.log("🔍 Lancement de l'Audit Global du Contenu...");

    const courses = await prisma.course.findMany({
        include: {
            discipline: { select: { name: true } },
            modules: {
                include: {
                    videos: true,
                    documents: true
                }
            }
        }
    });

    const report = courses.map(course => {
        let totalLessons = 0;
        let totalWordCount = 0;
        let isPlaceholder = false;

        course.modules.forEach(module => {
            totalLessons += module.videos.length;
            // Check theoryContent for placeholders or common boilerplate
            if (module.theoryContent && (module.theoryContent.includes("pédagogique associée à ce chapitre") || module.theoryContent.includes("constitue un pilier essentiel"))) {
                isPlaceholder = true;
            }

            // Simple word count estimate
            if (module.theoryContent) {
                totalWordCount += module.theoryContent.split(/\s+/).length;
            }

            module.videos.forEach(video => {
                if (video.description) {
                    totalWordCount += video.description.split(/\s+/).length;
                }
                if (video.description && video.description.includes("Vidéo pédagogique associée")) {
                    isPlaceholder = true;
                }
            });
        });

        return {
            Faculty: course.discipline.name,
            Title: course.title,
            Modules: course.modules.length,
            Lessons: totalLessons,
            TotalWords: totalWordCount,
            Status: isPlaceholder ? "PLACEHOLDER" : "REAL"
        };
    });

    console.table(report);
    console.log(JSON.stringify(report, null, 2));
}

auditGlobal()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
