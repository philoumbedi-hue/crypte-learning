const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Lancement de la population pédagogique - CRYPTE ACADEMIA");

    const modules = await prisma.module.findMany({
        include: {
            course: {
                include: {
                    discipline: true
                }
            }
        }
    });

    console.log(`Traitement de ${modules.length} modules...`);

    let count = 0;
    for (const mod of modules) {
        const title = mod.title;
        const discName = mod.course.discipline.name;
        const courseName = mod.course.name;

        // Generate synthetic but formal theory content
        const theory = `Ce module consacré à "${title}" constitue un pilier essentiel du cours "${courseName}". 

Dans le cadre académique de la discipline ${discName}, nous explorerons les concepts fondamentaux et les méthodologies avancées permettant de maîtriser les enjeux liés à cette thématique. 

Le contenu théorique s'articule autour des axes suivants :
1. Analyse structurelle et contextuelle de ${title}.
2. Étude des paradigmes dominants et des protocoles de mise en œuvre.
3. Évaluation des impacts et des optimisations possibles dans un environnement professionnel.

La maîtrise de ces concepts est indispensable pour valider les compétences requises dans le cursus CRYPTE – ACADEMIA.`;

        const objectives = `À l'issue de ce module, l'étudiant sera capable de :
- Identifier les composants clés de ${title}.
- Appliquer les principes théoriques de ${courseName} à des cas concrets.
- Synthétiser les connaissances acquises pour résoudre des problématiques complexes en ${discName}.`;

        await prisma.module.update({
            where: { id: mod.id },
            data: {
                theoryContent: theory,
                learningObjectives: objectives
            }
        });

        count++;
        if (count % 50 === 0) console.log(`   Processed ${count}/${modules.length} modules...`);
    }

    console.log(`\n✅ Félicitations ! ${count} modules ont été enrichis de contenu théorique.`);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
