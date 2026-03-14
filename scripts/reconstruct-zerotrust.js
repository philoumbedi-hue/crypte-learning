const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reconstructZeroTrust() {
    console.log("🚀 Lancement de l'injection structurale : Architecture Zero Trust Nationale...");

    // 1. Trouver la discipline
    const discipline = await prisma.discipline.findFirst({
        where: { name: { contains: "Cybersécurité" } }
    });

    if (!discipline) {
        console.error("❌ Discipline 'Cybersécurité' non trouvée.");
        return;
    }

    // 2. Créer ou mettre à jour le cours
    const courseTitle = "🛡 Architecture Zero Trust Nationale : Doctrine & Implémentation";
    const course = await prisma.course.upsert({
        where: {
            title_disciplineId: {
                title: courseTitle,
                disciplineId: discipline.id
            }
        },
        update: {},
        create: {
            title: courseTitle,
            description: "Le paradigme ultime de la défense moderne : de la rupture doctrinale à la micro-segmentation souveraine et la gouvernance de l'identité.",
            level: "AVANCÉ",
            disciplineId: discipline.id,
            imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
        }
    });

    console.log(`📍 Cours ID : ${course.id}`);

    // 3. Purger les anciens modules/leçons pour ce cours spécifique
    await prisma.video.deleteMany({ where: { module: { courseId: course.id } } });
    await prisma.document.deleteMany({ where: { module: { courseId: course.id } } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });

    console.log("🧹 Structure existante purgée.");

    // 4. Définition des modules
    const modulesData = [
        {
            title: "Module 1 — Fondements de la Doctrine Zero Trust & Souveraineté",
            order: 1,
            learningObjectives: "Maîtriser la rupture doctrinale et les piliers architecturaux du Zero Trust.",
            theoryContent: "🎯 Objectif stratégique : Comprendre le changement de paradigme.\n📌 Positionnement : Doctrine & Souveraineté.\n🔐 Vision souveraine : Maîtrise des points de décision.",
            lessons: [
                "De la défense périmétrique à la confiance nulle : rupture doctrinale",
                "Les piliers du Zero Trust Framework (NIST SP 800-207)",
                "Analyse des vecteurs d'attaque modernes & obsolescence du VPN",
                "Le plan de contrôle vs le plan de données",
                "Enjeux de souveraineté : maîtriser les points de décision",
                "Gouvernance et conformité sans périmètre",
                "Résilience systémique et continuité de service"
            ]
        },
        { title: "Module 2 — Architecture d'Accès & Micro-segmentation", order: 2, lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4", "Lesson 5", "Lesson 6", "Lesson 7"] },
        { title: "Module 3 — Identité Numérique & Gouvernance", order: 3, lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4", "Lesson 5", "Lesson 6", "Lesson 7"] },
        { title: "Module 4 — Observabilité, Analyse & Réponse", order: 4, lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4", "Lesson 5", "Lesson 6", "Lesson 7"] },
        { title: "Module 5 — Stratégie de Déploiement & Résilience", order: 5, lessons: ["Lesson 1", "Lesson 2", "Lesson 3", "Lesson 4", "Lesson 5", "Lesson 6", "Lesson 7"] }
    ];

    // 5. Contenus détaillés (Module 1)
    const lesson1_1 = `🔐 Architecture Zero Trust Nationale
Module 1 : Fondements de la Doctrine Zero Trust & Souveraineté
Leçon 1.1 : De la défense périmétrique à la confiance nulle : rupture doctrinale

🎯 **Objectif Stratégique**
Établir une compréhension rigoureuse du changement de paradigme imposé par le Zero Trust.

1️⃣ **La Limite du Modèle Périmétrique**
Le modèle "Castle-and-Moat" repose sur une distinction binaire entre intérieur et extérieur. Les intrusions récentes ont prouvé qu'une fois le périmètre franchi, la liberté de mouvement latéral de l'attaquant est totale.

2️⃣ **Le Paradigme Zero Trust**
"Never Trust, Always Verify". 
- Vérification explicite : Authentification, autorisation et chiffrement systématique.
- Privilège minimal : Accès juste-à-temps et strictement limité.
- Assomption de compromission : Architecture conçue comme si l'adversaire était déjà présent.

3️⃣ **Architecture Conceptuelle**
Sujet + Contexte -> Policy Decision Point (PDP) -> Policy Enforcement Point (PEP) -> Ressource.

📌 **Résumé Exécutif**
La rupture doctrinale consiste à abandonner la confiance topologique pour une confiance basée sur l'identité vérifiée et le contexte de sécurité.`;

    const lesson1_2 = `🔐 Architecture Zero Trust Nationale
Module 1 : Fondements de la Doctrine Zero Trust & Souveraineté
Leçon 1.2 : Les piliers du Zero Trust Framework (NIST SP 800-207)

🎯 **Objectif Stratégique**
Structurer une architecture ZT en s'appuyant sur les référentiels internationaux et nationaux.

1️⃣ **Les 7 Principes de base du NIST**
- Ressources isolées.
- Communications sécurisées (mTLS).
- Accès par session.
- Politique dynamique.
- Surveillance d'intégrité.
- Authentification stricte.
- Collecte de télémétrie.

2️⃣ **Composants Logiques**
PDP (Policy Decision Point) et PEP (Policy Enforcement Point). Le PDP évalue et le PEP applique.

📌 **Résumé Exécutif**
Le framework NIST SP 800-207 fournit l'ossature neutre pour toute implémentation ZT souveraine.`;

    const lesson1_3 = `🔐 Architecture Zero Trust Nationale
Module 1 : Fondements de la Doctrine Zero Trust & Souveraineté
Leçon 1.3 : Analyse des vecteurs d'attaque modernes & obsolescence du VPN

🎯 **Objectif Stratégique**
Démontrer techniquement l'obsolescence structurelle du VPN classique face aux architectures ZT.

1️⃣ **Risque Tunnel IP**
Le VPN accorde un accès niveau 3 (réseau), permettant le scan interne et le mouvement latéral massif.

2️⃣ **Zéro Visibilité Applicative**
Le VPN ne comprend pas la granularité applicative. Le ZT propose un accès niveau 7 (applicatif) sélectif.

📌 **Résumé Exécutif**
Le VPN crée une confiance périmétrique dangereuse ; le Zero Trust impose une confiance granulaire indispensable.`;

    const lesson1_4 = `🔐 Architecture Zero Trust Nationale
Module 1 : Fondements de la Doctrine Zero Trust & Souveraineté
Leçon 1.4 : Le plan de contrôle vs le plan de données

🎯 **Objectif Stratégique**
Maîtriser la séparation entre l'intelligence décisionnelle et le transport des données.

1️⃣ **Control Plane**
Gestion des identités et des politiques d'accès. Doit être furtif (Black Cloud).

2️⃣ **Data Plane**
Flux applicatif sécurisé. Ne peut jamais initier de connexion vers le Control Plane.

📌 **Résumé Exécutif**
La séparation des plans isole l'intelligence de sécurité du trafic de données, augmentant drastiquement la résilience.`;

    const lesson1_5 = `🔐 Architecture Zero Trust Nationale
Module 1 : Fondements de la Doctrine Zero Trust & Souveraineté
Leçon 1.5 : Enjeux de souveraineté : maîtriser les points de décision

🎯 **Objectif Stratégique**
Identifier les risques d'externalisation du PDP et définir l'autonomie stratégique.

1️⃣ **Le Danger de l'Externalisation PDP**
Un PDP géré par une entité soumise à des lois extra-territoriales équivaut à déléguer le contrôle des accès régaliens.

2️⃣ **Conditions de Souveraineté**
Hébergement local, solutions auditables et maîtrise totale du cycle de vie des décisions.

📌 **Résumé Exécutif**
La souveraineté numérique passe par la maîtrise locale du cerveau decisionnel de l'architecture de confiance.`;

    const lesson1_6 = `🔐 Architecture Zero Trust Nationale
Module 1 : Fondements de la Doctrine Zero Trust & Souveraineté
Leçon 1.6 : Gouvernance et conformité sans périmètre

🎯 **Objectif Stratégique**
Adapter les processus de gouvernance à un modèle de sécurité identité-centrique.

1️⃣ **Audit Comportemental**
Passage de l'audit statique des infrastructures à l'audit dynamique des flux et des décisions d'accès.

2️⃣ **Conformité des terminaux**
L'accès est conditionné par l'état de conformité (patches, antivirus) mesuré en temps réel.

📌 **Résumé Exécutif**
Gouverner sans périmètre signifie automatiser la conformité et auditer les comportements plutôt que les topologies.`;

    const lesson1_7 = `🔐 Architecture Zero Trust Nationale
Module 1 : Fondements de la Doctrine Zero Trust & Souveraineté
Leçon 1.7 : Résilience systémique et continuité de service

🎯 **Objectif Stratégique**
Garantir que l'architecture ZT renforce la résilience globale de l'infrastucture.

1️⃣ **PDP Haute Disponibilité**
Déploiement multisites pour éviter le point de défaillance unique.

2️⃣ **Modes de dégradation (Fail-secure)**
Définition des politiques par défaut en cas de perte de connectivité avec le Control Plane.

📌 **Résumé Exécutif**
Une architecture ZT robuste est une architecture redondante, capable de maintenir la sécurité même en mode dégradé.`;

    const lesson2_1 = `🔐 Architecture Zero Trust Nationale
Module 2 : Architecture d'Accès & Micro-segmentation Souveraine
Leçon 2.1 : Architecture Software-Defined Perimeter (SDP)

🎯 **Objectif Stratégique**
Rendre l'infrastructure invisible aux yeux des attaquants via le concept de périmètre logiciel.

1️⃣ **Single Packet Authorization (SPA)**
Technique de "Stealth mode" ouvrant un port seulement après un paquet chiffré authentifié.

2️⃣ **Isolation du Control Plane**
Aucun flux possible sans approbation explicite du contrôleur.

📌 **Résumé Exécutif**
Le SDP garantit l'invisibilité de l'infrastructure avant toute authentification réussie.`;

    const lesson2_2 = `🔐 Architecture Zero Trust Nationale
Module 2 : Architecture d'Accès & Micro-segmentation Souveraine
Leçon 2.2 : Micro-segmentation granulaire : isolation des flux critiques

🎯 **Objectif Stratégique**
Empêcher tout mouvement latéral en isolant chaque charge de travail individuellement.

1️⃣ **Segmentation Niveau 7**
Isolation applicative indépendante des VLANs ou des IPs.

2️⃣ **Politique d'Identité de Charge de Travail**
Autorisation basée sur l'identité logicielle certifiée.

📌 **Résumé Exécutif**
La micro-segmentation transforme le réseau interne en un archipel de services isolés.`;

    const lesson2_3 = `### Passerelles d'accès sécurisées (SASE / ZTNA)\n\n[Contenu détaillé dans zerotrust_module_2.md]`;
    const lesson2_4 = `### Chiffrement des flux internes et mTLS\n\n[Contenu détaillé dans zerotrust_module_2.md]`;
    const lesson2_5 = `### Sécurisation des communications inter-services (Service Mesh)\n\n[Contenu détaillé dans zerotrust_module_2.md]`;
    const lesson2_6 = `### Protection des infrastructures legacy\n\n[Contenu détaillé dans zerotrust_module_2.md]`;
    const lesson2_7 = `### Audit et validation de la segmentation dynamique\n\n[Contenu détaillé dans zerotrust_module_2.md]`;

    const lesson3_1 = `🔐 Architecture Zero Trust Nationale
Module 3 : Identité Numérique & Gouvernance de la Confiance
Leçon 3.1 : L'identité comme nouveau périmètre de sécurité

🎯 **Objectif Stratégique**
Comprendre pourquoi l'identité remplace le pare-feu traditionnel dans un monde sans frontières.

1️⃣ **Dématérialisation du périmètre**
L'adresse IP n'est plus un identifiant de confiance fiable.

2️⃣ **Identité forte et immuable**
Lien avec des facteurs robustes (certificats, biométrie).

📌 **Résumé Exécutif**
L'identité est l'ancre pivot de toute architecture de confiance moderne.`;

    const lesson3_2 = `### Authentification forte et adaptative\n\n[Contenu détaillé dans zerotrust_module_3.md]`;
    const lesson3_3 = `### IAM à l'échelle étatique\n\n[Contenu détaillé dans zerotrust_module_3.md]`;
    const lesson3_4 = `### PAM et gestion des comptes critiques\n\n[Contenu détaillé dans zerotrust_module_3.md]`;
    const lesson3_5 = `### Gouvernance des identités machines et IoT\n\n[Contenu détaillé dans zerotrust_module_3.md]`;
    const lesson3_6 = `### Fédération d'identité souveraine\n\n[Contenu détaillé dans zerotrust_module_3.md]`;
    const lesson3_7 = `### Cycle de vie de l'identité et révocation\n\n[Contenu détaillé dans zerotrust_module_3.md]`;

    const lesson4_1 = `🔐 Architecture Zero Trust Nationale
Module 4 : Observabilité, Analyse & Réponse Automatisée
Leçon 4.1 : Télémétrie et collecte de signaux

🎯 **Objectif Stratégique**
Établir une visibilité exhaustive pour alimenter le moteur de décision PDP.

1️⃣ **Collecte multidimensionnelle**
Signaux EDR, NDR, IAM logs et applicatifs.

2️⃣ **Normalisation OCSF**
Standardisation pour une corrélation efficace.

📌 **Résumé Exécutif**
La télémétrie est le système nerveux du Zero Trust.`;

    const lesson4_2 = `### Analyse comportementale (UEBA)\n\n[Contenu détaillé dans zerotrust_module_4.md]`;
    const lesson4_3 = `### Le Policy Decision Point (PDP)\n\n[Contenu détaillé dans zerotrust_module_4.md]`;
    const lesson4_4 = `### Intégration SIEM/SOAR\n\n[Contenu détaillé dans zerotrust_module_4.md]`;
    const lesson4_5 = `### Invariabilité des logs et traçabilité\n\n[Contenu détaillé dans zerotrust_module_4.md]`;
    const lesson4_6 = `### Threat Intelligence intégrée\n\n[Contenu détaillé dans zerotrust_module_4.md]`;
    const lesson4_7 = `### Scénarios de réponse aux incidents\n\n[Contenu détaillé dans zerotrust_module_4.md]`;

    const lesson5_1 = `🔐 Architecture Zero Trust Nationale
Module 5 : Stratégie de Déploiement & Résilience des OIV
Leçon 5.1 : Feuille de route pour une migration progressive

🎯 **Objectif Stratégique**
Définir une trajectoire de migration réaliste sans interruption de service.

1️⃣ **Phases de migration**
Identification -> Pilotage -> Extension -> Optimisation.

📌 **Résumé Exécutif**
Le ZT est une amélioration continue de la granularité, pas un basculement instantané.`;

    const lesson5_2 = `### Zero Trust appliqué aux systèmes industriels (SCADA)\n\n[Contenu détaillé dans zerotrust_module_5.md]`;
    const lesson5_3 = `### Résilience des infrastructures critiques\n\n[Contenu détaillé dans zerotrust_module_5.md]`;
    const lesson5_4 = `### Audit de maturité et certifications nationales\n\n[Contenu détaillé dans zerotrust_module_5.md]`;
    const lesson5_5 = `### Étude de cas : Administration centrale\n\n[Contenu détaillé dans zerotrust_module_5.md]`;
    const lesson5_6 = `### Évolution post-quantique du Zero Trust\n\n[Contenu détaillé dans zerotrust_module_5.md]`;
    const lesson5_7 = `### Prospective : IA et 6G\n\n[Contenu détaillé dans zerotrust_module_5.md]`;

    // 6. Injection
    for (const mData of modulesData) {
        const mod = await prisma.module.create({
            data: {
                title: mData.title,
                order: mData.order,
                courseId: course.id,
                learningObjectives: mData.learningObjectives || "Objectifs en cours de définition.",
                theoryContent: mData.theoryContent || "Contenu théorique stratégique."
            }
        });

        console.log(`🏛️ Module ${mData.order} créé : ${mData.title}`);

        for (let j = 0; j < mData.lessons.length; j++) {
            let content = `### ${mData.lessons[j]}\n\n[Contenu pédagogique stratégique en cours de rédaction]`;
            if (mData.order === 1) {
                if (j === 0) content = lesson1_1;
                if (j === 1) content = lesson1_2;
                if (j === 2) content = lesson1_3;
                if (j === 3) content = lesson1_4;
                if (j === 4) content = lesson1_5;
                if (j === 5) content = lesson1_6;
                if (j === 6) content = lesson1_7;
            }
            if (mData.order === 2) {
                if (j === 0) content = lesson2_1;
                if (j === 1) content = lesson2_2;
                if (j === 2) content = lesson2_3;
                if (j === 3) content = lesson2_4;
                if (j === 4) content = lesson2_5;
                if (j === 5) content = lesson2_6;
                if (j === 6) content = lesson2_7;
            }
            if (mData.order === 3) {
                if (j === 0) content = lesson3_1;
                if (j === 1) content = lesson3_2;
                if (j === 2) content = lesson3_3;
                if (j === 3) content = lesson3_4;
                if (j === 4) content = lesson3_5;
                if (j === 5) content = lesson3_6;
                if (j === 6) content = lesson3_7;
            }
            if (mData.order === 4) {
                if (j === 0) content = lesson4_1;
                if (j === 1) content = lesson4_2;
                if (j === 2) content = lesson4_3;
                if (j === 3) content = lesson4_4;
                if (j === 4) content = lesson4_5;
                if (j === 5) content = lesson4_6;
                if (j === 6) content = lesson4_7;
            }
            if (mData.order === 5) {
                if (j === 0) content = lesson5_1;
                if (j === 1) content = lesson5_2;
                if (j === 2) content = lesson5_3;
                if (j === 3) content = lesson5_4;
                if (j === 4) content = lesson5_5;
                if (j === 5) content = lesson5_6;
                if (j === 6) content = lesson5_7;
            }

            await prisma.video.create({
                data: {
                    title: mData.lessons[j],
                    order: j + 1,
                    moduleId: mod.id,
                    content: content,
                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
                    type: "TECHNICAL",
                    description: `Leçon stratégique ${j + 1} du module ${mData.order}.`
                }
            });
        }
        console.log(`   ✅ ${mData.lessons.length} leçons injectées.`);
    }

    console.log("💎 Architecture Zero Trust Nationale injectée avec succès.");
}

reconstructZeroTrust()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
