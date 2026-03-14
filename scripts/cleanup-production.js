const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupProduction(dryRun = true) {
    console.log(`🚀 [${dryRun ? 'DRY-RUN' : 'EXECUTE'}] Lancement du nettoyage de la base de données...`);

    // 1. Audit des Disciplines en doublon
    const allDisciplines = await prisma.discipline.findMany({
        include: { courses: true }
    });

    const disciplineGroups = {};
    allDisciplines.forEach(d => {
        if (!disciplineGroups[d.name.toLowerCase()]) {
            disciplineGroups[d.name.toLowerCase()] = [];
        }
        disciplineGroups[d.name.toLowerCase()].push(d);
    });

    for (const name in disciplineGroups) {
        const group = disciplineGroups[name];
        if (group.length > 1) {
            const [original, ...duplicates] = group.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            console.log(`🏛 Discipline [${name}] : Doublons détectés (${duplicates.length})`);
            console.log(`   └─ ORIGINAL (À GARDER) : ${original.id} (${original.createdAt.toISOString()})`);

            for (const dup of duplicates) {
                console.log(`   └─ DOUBLON (À SUPPRIMER) : ${dup.id} (${dup.createdAt.toISOString()})`);

                if (!dryRun) {
                    // Migrer les cours vers l'original
                    for (const course of dup.courses) {
                        console.log(`      🚩 Migration du cours [${course.title}] vers [${original.id}]...`);
                        await prisma.course.update({
                            where: { id: course.id },
                            data: { disciplineId: original.id }
                        });
                    }
                    // Supprimer le doublon
                    await prisma.discipline.delete({ where: { id: dup.id } });
                    console.log(`      ✅ Doublon [${dup.id}] supprimé.`);
                }
            }
        }
    }

    // 2. Audit des Cours en doublon au sein d'une même discipline
    const allCourses = await prisma.course.findMany();
    const courseGroups = {};

    allCourses.forEach(c => {
        const key = `${c.title.toLowerCase()}_${c.disciplineId}`;
        if (!courseGroups[key]) {
            courseGroups[key] = [];
        }
        courseGroups[key].push(c);
    });

    for (const key in courseGroups) {
        const group = courseGroups[key];
        if (group.length > 1) {
            const [original, ...duplicates] = group.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            console.log(`📚 Cours [${original.title}] : Doublons détectés dans la même discipline.`);

            for (const dup of duplicates) {
                console.log(`   └─ DOUBLON : ${dup.id} (${dup.createdAt.toISOString()})`);
                if (!dryRun) {
                    // Ici on pourrait migrer les modules, etc. 
                    // Mais selon le plan, on est en Phase Alpha, on va purger proprement.
                    await prisma.course.delete({ where: { id: dup.id } });
                    console.log(`      ✅ Doublon supprimé.`);
                }
            }
        }
    }

    if (dryRun) {
        console.log("\n⚠️ MODE DRY-RUN TERMINE : Aucune donnée n'a été modifiée.");
        console.log("Relancez avec 'CLEANUP_EXECUTE=true' pour appliquer les changements.");
    } else {
        console.log("\n✨ NETTOYAGE TERMINE AVEC SUCCES.");
    }
}

const isExecute = process.env.CLEANUP_EXECUTE === 'true';
cleanupProduction(!isExecute)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
