const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function auditCourses() {
    console.log("🔍 Audit de conformité Standard Alpha en cours...");

    try {
        const courses = await prisma.course.findMany({
            include: {
                modules: {
                    include: {
                        videos: true
                    },
                    orderBy: { order: 'asc' }
                },
                discipline: true
            }
        });

        let results = [];

        for (const course of courses) {
            const moduleCount = course.modules.length;
            const lessonCount = course.modules.reduce((acc, mod) => acc + mod.videos.length, 0);

            // Vérification sommaire de la structure des leçons (présence de "Résumé Exécutif")
            let lessonsWithSummary = 0;
            for (const mod of course.modules) {
                for (const lesson of mod.videos) {
                    if (lesson.content && (lesson.content.includes("Résumé Exécutif") || lesson.content.includes("Résumé exécutif"))) {
                        lessonsWithSummary++;
                    }
                }
            }

            const hasAllSummaries = lessonCount > 0 && lessonsWithSummary === lessonCount;
            const isConforme = moduleCount >= 5 && lessonCount >= 30 && hasAllSummaries;

            results.push({
                titre: course.title,
                discipline: course.discipline.name,
                modules: moduleCount,
                lecons: lessonCount,
                resumes: `${lessonsWithSummary}/${lessonCount}`,
                statut: isConforme ? "✅ CONFORME" : "❌ NON CONFORME"
            });
        }

        console.log("\n📊 RAPPORT D'AUDIT PRELIMINAIRE :");
        console.table(results);

    } catch (error) {
        console.error("❌ Erreur lors de l'audit :", error);
    } finally {
        await prisma.$disconnect();
    }
}

auditCourses();
