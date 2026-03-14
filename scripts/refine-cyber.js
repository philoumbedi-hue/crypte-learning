const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function refineCyber() {
    console.log("🚀 Lancement du raffinement stratégique pour la Cyber...");

    const refinements = [
        {
            oldTitle: "Sécurité Réseau",
            newTitle: "Architecture de Défense & Résilience Réseau",
            newDesc: "Design d'infrastructures résilientes et segmentation Zero Trust pour la protection des actifs critiques."
        },
        {
            oldTitle: "Ethical Hacking",
            newTitle: "Sécurité Offensive & Modélisation de Menaces",
            newDesc: "Utilisation du framework MITRE ATT&CK pour simuler des adversaires réels et identifier les faiblesses structurelles."
        },
        {
            oldTitle: "Audit de Sécurité",
            newTitle: "Gouvernance, Risques & Conformité (GRC)",
            newDesc: "Pilotage de la conformité stratégique basé sur les standards ISO 27001 et le framework NIST CSF."
        },
        {
            oldTitle: "Protection des Données",
            newTitle: "Sécurité des Données & Souveraineté Numérique",
            newDesc: "Protection de l'intégrité informationnelle et maîtrise stratégique de la confidentialité des données."
        },
        {
            oldTitle: "Cyberdéfense",
            newTitle: "Réponse aux Incidents & Stratégie de Résilience",
            newDesc: "Gestion de crise de haut niveau, remédiation tactique et plans de continuité d'activité (PCA)."
        },
        {
            oldTitle: "Fondamentaux de la Sécurité Informatique",
            newTitle: "Ingénierie de la Sécurité & Culture de Défense",
            newDesc: "Fondations robustes basées sur les principes CIA et la psychologie de la défense active."
        },
        {
            oldTitle: "Gouvernance Numérique",
            newTitle: "Leadership en Cybersécurité & Vision Stratégique",
            newDesc: "Pilotage décisionnel de la sécurité numérique à l'échelle d'une organisation d'élite."
        },
        {
            oldTitle: "Cryptographie",
            newTitle: "Science du Chiffrement & Souveraineté Cryptographique",
            newDesc: "Maîtrise des algorithmes avancés et des protocoles de sécurisation des échanges."
        },
        {
            oldTitle: "Cryptographie Appliquée",
            newTitle: "Cryptographie Avancée & Infrastructures PKI",
            newDesc: "Mise en œuvre concrète des systèmes de confiance et gestion des identités numériques."
        }
    ];

    for (const ref of refinements) {
        // On cherche par le titre exact dans la faculté Cyber
        const courses = await prisma.course.findMany({
            where: {
                title: ref.oldTitle,
                discipline: { name: "🛡 Cybersécurité & Défense Numérique" }
            }
        });

        if (courses.length > 0) {
            for (const course of courses) {
                console.log(`   🔄 Raffinement de "${course.title}" -> "${ref.newTitle}"`);
                await prisma.course.update({
                    where: { id: course.id },
                    data: {
                        title: ref.newTitle,
                        description: ref.newDesc,
                        level: "Expert" // On unifie sur Expert pour le premium
                    }
                });
            }
        } else {
            console.log(`   ⚠️ Cours non trouvé : "${ref.oldTitle}"`);
        }
    }

    console.log("\n✨ Raffinement Cyber terminé !");
}

refineCyber()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
