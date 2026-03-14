const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function refineGlobal() {
    console.log("🚀 Lancement du raffinement GLOBAL pour CRYPTE...");

    const refinements = [
        // --- CYBER (Déjà fait mais inclus pour cohérence) ---
        { discipline: "🛡 Cybersécurité & Défense Numérique", old: "Sécurité Réseau", new: "Architecture de Défense & Résilience Réseau", desc: "Design d'infrastructures résilientes et segmentation Zero Trust." },

        // --- IA & DATA ---
        { discipline: "🤖 Intelligence Artificielle & Sciences des Données", old: "Fondamentaux de l'Apprentissage Automatique", new: "Ingénierie du Machine Learning & Systèmes Prédictifs", desc: "Développement et déploiement de modèles prédictifs haute fidélité." },
        { discipline: "🤖 Intelligence Artificielle & Sciences des Données", old: "Architecture des Systèmes Cloud", new: "Architectures Haute Disponibilité & Cloud Stratégique", desc: "Conception de systèmes distribués robustes et évolutifs." },
        { discipline: "🤖 Intelligence Artificielle & Sciences des Données", old: "Big Data", new: "Ingénierie des Données Massives & Analytics Avancé", desc: "Exploitation stratégique des flux de données à grande échelle." },
        { discipline: "🤖 Intelligence Artificielle & Sciences des Données", old: "Traitement du Langage Naturel (NLP)", new: "Traitement du Langage & Architectures Transformer", desc: "Maîtrise des LLMs et des interfaces conversationnelles intelligentes." },
        { discipline: "🤖 Intelligence Artificielle & Sciences des Données", old: "Éthique de l'Intelligence Artificielle", new: "Éthique, Biais & Gouvernance de l'IA Algorithmique", desc: "Cadre moral et régulation de l'IA pour un impact responsable." },

        // --- FINANCE & BLOCKCHAIN ---
        { discipline: "💰 Finance Numérique & Technologies Blockchain", old: "Smart Contracts", new: "Ingénierie des Smart Contracts & Sécurité DeFi", desc: "Développement sécurisé sur protocoles décentralisés." },
        { discipline: "💰 Finance Numérique & Technologies Blockchain", old: "Régulation & Conformité", new: "Conformité Réglementaire & Cadre Juridique Crypto", desc: "Navigation stratégique dans l'écosystème légal des actifs numériques." },
        { discipline: "💰 Finance Numérique & Technologies Blockchain", old: "Marchés Financiers Internationaux", new: "Macroéconomie & Marchés Financiers à l'Ère Numérique", desc: "Analyse des flux financiers globaux et des dynamiques de marché." },

        // --- STRATÉGIE & ENTREPRENEURIAT ---
        { discipline: "🚀 Stratégie, Innovation & Entrepreneuriat", old: "Stratégie d'Entreprise Moderne", new: "Design Stratégique & Avantage Compétitif", desc: "Création de valeur durable et différenciation sur les marchés saturés." },
        { discipline: "🚀 Stratégie, Innovation & Entrepreneuriat", old: "Leadership Organisationnel", new: "Leadership Exécutif & Management de l'Innovation", desc: "Pilotage du changement et culture de la performance académique." },
        { discipline: "🚀 Stratégie, Innovation & Entrepreneuriat", old: "Gestion de Projets Agile", new: "Maîtrise de l'Agilité & Livraison de Valeur Continue", desc: "Optimisation des flux de travail et pilotage par la valeur." },
        { discipline: "🚀 Stratégie, Innovation & Entrepreneuriat", old: "Stratégie de Croissance", new: "Stratégies de Growth & Scaling Exponentiel", desc: "Architectures de croissance et passage à l'échelle internationale." }
    ];

    for (const ref of refinements) {
        const result = await prisma.course.updateMany({
            where: {
                title: ref.old,
                discipline: { name: ref.discipline }
            },
            data: {
                title: ref.new,
                description: ref.desc,
                level: "Expert"
            }
        });
        if (result.count > 0) {
            console.log(`   ✅ Mis à jour : "${ref.old}" -> "${ref.new}" dans ${ref.discipline}`);
        }
    }

    console.log("\n✨ Raffinement Global terminé !");
}

refineGlobal()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
