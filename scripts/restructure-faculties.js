const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function restructurer() {
    console.log("🚀 Début de la restructuration académique...");

    const transformations = [
        {
            newName: "🛡 Cybersécurité & Défense Numérique",
            sources: ["Cybersécurité & Réseaux", "Cybersécurité & Souveraineté Numérique"]
        },
        {
            newName: "🤖 Intelligence Artificielle & Sciences des Données",
            sources: ["Intelligence Artificielle & Data Science"]
        },
        {
            newName: "💰 Finance Numérique & Technologies Blockchain",
            sources: ["Finance, Blockchain & Cryptoéconomie"]
        },
        {
            newName: "🚀 Stratégie, Innovation & Entrepreneuriat",
            sources: ["Business & Innovation Technologique", "Entrepreneuriat & Stratégie de Croissance"]
        },
        {
            newName: "🏛 Gouvernance, Droit & Leadership",
            sources: ["Droit des Affaires & Éthique Numérique", "Leadership Africain & Gouvernance"]
        },
        {
            newName: "🎨 Arts Numériques & Design Créatif",
            sources: ["Arts Visuels & Design Numérique"]
        },
        {
            newName: "🧠 Développement Personnel & Performance Cognitive",
            sources: ["Développement Personnel & Efficacité"]
        },
        {
            newName: "🧬 Santé & Biotechnologies Numériques",
            sources: ["Santé, Biotechnologie & Bien-être"]
        }
    ];

    for (const trans of transformations) {
        console.log(`\n📦 Création/Mise à jour de la faculté : ${trans.newName}`);

        // 1. Trouver ou créer la nouvelle discipline
        let master = await prisma.discipline.findUnique({ where: { name: trans.newName } });
        if (!master) {
            // On essaie de renommer le premier de la liste s'il existe
            const firstSource = await prisma.discipline.findUnique({ where: { name: trans.sources[0] } });
            if (firstSource) {
                master = await prisma.discipline.update({
                    where: { id: firstSource.id },
                    data: { name: trans.newName }
                });
                console.log(`   ✅ Renommé "${trans.sources[0]}" en "${trans.newName}"`);
            } else {
                master = await prisma.discipline.create({
                    data: { name: trans.newName }
                });
                console.log(`   ✅ Créé "${trans.newName}"`);
            }
        }

        // 2. Fusionner les autres sources vers le master
        for (const sourceName of trans.sources) {
            if (sourceName === trans.newName) continue; // Déjà traité par le renommage

            const source = await prisma.discipline.findUnique({ where: { name: sourceName } });
            if (source && source.id !== master.id) {
                console.log(`   🔗 Fusion de "${sourceName}" vers "${trans.newName}"...`);

                // Déplacer les cours
                await prisma.course.updateMany({
                    where: { disciplineId: source.id },
                    data: { disciplineId: master.id }
                });

                // Supprimer l'ancienne discipline
                await prisma.discipline.delete({ where: { id: source.id } });
                console.log(`   🗑 Supprimé "${sourceName}"`);
            }
        }
    }

    // 3. Redistribuer les domaines orphelins
    console.log("\n🧹 Redistribution des domaines transversaux...");

    const redistrib = [
        {
            old: "Transformation Digitale & Cloud Computing",
            moves: [
                { courses: ["DevOps", "Infrastructure as Code", "Big Data", "Architecture des Systèmes Cloud", "Microservices"], target: "🤖 Intelligence Artificielle & Sciences des Données" },
                { courses: ["Stratégie Cloud", "Modernisation des Entreprises"], target: "🚀 Stratégie, Innovation & Entrepreneuriat" },
                { courses: ["Gouvernance IT"], target: "🏛 Gouvernance, Droit & Leadership" }
            ]
        },
        {
            old: "Éducation, EdTech & Pédagogie Alternative",
            targetAll: "🚀 Stratégie, Innovation & Entrepreneuriat"
        }
    ];

    for (const r of redistrib) {
        const oldDisc = await prisma.discipline.findUnique({ where: { name: r.old } });
        if (!oldDisc) continue;

        console.log(`   🔄 Redistribution de "${r.old}"...`);

        if (r.targetAll) {
            const target = await prisma.discipline.findUnique({ where: { name: r.targetAll } });
            if (target) {
                await prisma.course.updateMany({
                    where: { disciplineId: oldDisc.id },
                    data: { disciplineId: target.id }
                });
            }
        } else if (r.moves) {
            for (const m of r.moves) {
                const target = await prisma.discipline.findUnique({ where: { name: m.target } });
                if (target) {
                    await prisma.course.updateMany({
                        where: {
                            disciplineId: oldDisc.id,
                            title: { in: m.courses }
                        },
                        data: { disciplineId: target.id }
                    });
                }
            }
        }

        // Supprimer après redistribution
        await prisma.discipline.delete({ where: { id: oldDisc.id } });
        console.log(`   🗑 Supprimé "${r.old}"`);
    }

    console.log("\n✨ Restructuration terminée avec succès !");
}

restructurer()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
