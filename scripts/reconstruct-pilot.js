const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reconstructPilot() {
    console.log("🚀 Reconstruction du cours pilote : Architecture de Défense & Résilience Réseau...");

    // 1. Trouver le cours pilote
    const course = await prisma.course.findFirst({
        where: { title: { contains: "Architecture de Défense" } }
    });

    if (!course) {
        console.error("❌ Cours pilote non trouvé.");
        return;
    }

    console.log(`📍 ID du cours : ${course.id}`);

    // 2. Supprimer les anciens modules/vidéos pour repartir sur une base propre Alpha
    await prisma.video.deleteMany({ where: { module: { courseId: course.id } } });
    await prisma.document.deleteMany({ where: { module: { courseId: course.id } } });
    await prisma.module.deleteMany({ where: { courseId: course.id } });

    console.log("🧹 Anciens contenus purgés.");

    // 3. Créer les 5 modules officiels
    const moduleTitles = [
        "Module 1 — Positionnement Stratégique & Résilience Étatique",
        "Module 2 — Fondamentaux Techniques : Zero Trust & Segmentation",
        "Module 3 — Détection, Réponse & Résilience Opérationnelle",
        "Module 4 — Étude de Cas Réelle : Attaque d'Infrastructure",
        "Module 5 — Projet Final : Design d'Infrastructure Critique"
    ];

    const modules = [];
    for (let i = 0; i < moduleTitles.length; i++) {
        const mod = await prisma.module.create({
            data: {
                title: moduleTitles[i],
                order: i + 1,
                courseId: course.id,
                learningObjectives: i === 0 ? "Comprendre la géopolitique du cyberespace, la souveraineté numérique et la logique des menaces hybrides." :
                    i === 1 ? "Maîtriser les principes du Zero Trust, la micro-segmentation, le SDN et la sécurité centrée sur l'identité." :
                        i === 2 ? "Construire une capacité de détection et de réponse souveraine via un SOC moderne et des mécanismes de containment." : null
            }
        });
        modules.push(mod);
    }
    console.log("🏛️ 5 Modules créés.");

    // MODULE 1
    const lesson1Content = `🛡 Architecture de Défense & Résilience Réseau
Module 1 — Positionnement Stratégique
Leçon 1 : Géopolitique du Cyberespace & Menaces Hybrides

🎯 **Objectif Stratégique**
Comprendre pourquoi le cyberespace est devenu un théâtre de confrontation géopolitique majeur, et comment les menaces hybrides redéfinissent la sécurité des États, des infrastructures critiques et des grandes organisations.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer la notion de souveraineté numérique
- Identifier les acteurs étatiques et para-étatiques du cyberespace
- Comprendre la logique des opérations hybrides
- Cartographier une menace à l’aide des référentiels modernes

1️⃣ **Le Cyberespace : Cinquième Domaine de Conflit**
Le cyberespace constitue désormais le cinquième domaine opérationnel reconnu par de nombreuses puissances militaires (avec Terre, Mer, Air, Espace). 
Contrairement aux domaines physiques, le cyberespace est transnational par nature, efface la frontière entre civil et militaire, et permet l’attribution floue des attaques.

2️⃣ **Menaces Hybrides : La Nouvelle Doctrine de Conflit**
Une menace hybride combine plusieurs vecteurs : Cyberattaques, Désinformation, Pression économique, Sabotage indirect. L’objectif est souvent de déstabiliser, éroder la confiance ou perturber la gouvernance.

3️⃣ **Acteurs Géopolitiques du Cyberespace**
- États (Cyber-commandements)
- Groupes para-étatiques
- Hacktivistes instrumentalisés
- Cybercriminels géopolitiques

4️⃣ **Mapping Framework — Logique MITRE & NIST**
- **MITRE ATT&CK** : Classifier les techniques d’attaque et standardiser l’analyse.
- **NIST CSF** : 5 fonctions (Identify, Protect, Detect, Respond, Recover) comme outil de souveraineté.

🔶 **Lecture Stratégique CRYPTE : L’Angle Souverain des États Émergents**
La résilience réseau n’est pas technique, elle est civilisationnelle. La cyberdéfense doit être intégrée à la stratégie nationale de développement : formation d'élites souveraines et indépendance infrastructurelle.

5️⃣ **Cas Réel Intégré — Attaque contre une Infrastructure Critique**
L’attaque technique est un vecteur, l’objectif réel est stratégique. Exemple : perturbation d'un réseau énergétique pour créer une pression politique.

📌 **Résumé Exécutif**
La résilience réseau est une question de souveraineté. Une architecture moderne doit intégrer l’hypothèse d’attaque permanente.`;

    await prisma.video.create({
        data: {
            title: "Leçon 1 : Géopolitique du Cyberespace & Menaces Hybrides",
            order: 1,
            moduleId: modules[0].id,
            content: lesson1Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "STRATEGIC",
            description: "Analyse des enjeux géopolitiques et de la doctrine des menaces hybrides."
        }
    });

    const lesson2Content = `🛡 Architecture de Défense & Résilience Réseau
Module 1 — Positionnement Stratégique
Leçon 2 : Infrastructures Critiques & Souveraineté Numérique

🎯 **Objectif Stratégique**
Comprendre pourquoi les infrastructures critiques constituent le cœur de la puissance étatique moderne et comment leur sécurisation réseau conditionne la souveraineté numérique d’un pays.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Définir une infrastructure critique (OIV/OSE)
- Identifier les dépendances numériques systémiques
- Comprendre les vulnérabilités spécifiques des réseaux industriels
- Relier résilience technique et stabilité nationale

1️⃣ **Définition : Infrastructure Critique**
Une infrastructure critique est un système dont l’indisponibilité ou la compromission aurait un impact majeur sur la sécurité nationale, l’économie, la santé publique ou l’ordre social. (Ex: Énergie, Banque, Transports).

2️⃣ **Numérisation & Interconnexion : Le Nouveau Risque Systémique**
Les infrastructures modernes (SCADA, ICS) sont désormais connectées aux réseaux IP. Cette interconnexion crée des dépendances systémiques où une panne énergétique peut paralyser les télécoms ou les hôpitaux.

3️⃣ **Mapping Framework — NIST & Protection des Actifs Critiques**
Le NIST CSF fournit une base méthodologique via ses 5 fonctions pour cartographier, protéger et assurer la résilience des actifs essentiels.

4️⃣ **Vulnérabilités Spécifiques des Environnements OT**
Les environnements industriels (OT) utilisent souvent des protocoles anciens et ont une faible tolérance aux interruptions, créant un dilemme permanent entre Sécurité et Continuité d'exploitation.

🔶 **Lecture Stratégique CRYPTE : Souveraineté Numérique comme Impératif Structurel**
La souveraineté numérique implique la maîtrise des architectures critiques et une capacité d’audit indépendante. Une nation sans maîtrise de ses réseaux critiques est structurellement vulnérable.

5️⃣ **Cas Réel — Perturbation d’Infrastructure Énergétique**
L’attaque technique (phishing, pivot OT) n’est qu'un vecteur pour un impact stratégique massif : paralysie économique et pression politique.

📌 **Résumé Exécutif**
La souveraineté numérique est un impératif stratégique. La résilience doit être pensée dès la phase de design (Security by Design).`;

    await prisma.video.create({
        data: {
            title: "Leçon 2 : Infrastructures Critiques & Souveraineté Numérique",
            order: 2,
            moduleId: modules[0].id,
            content: lesson2Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "STRATEGIC",
            description: "Analyse de la protection des infrastructures critiques et des enjeux de souveraineté."
        }
    });

    const lesson3Content = `🛡 Architecture de Défense & Résilience Réseau
Module 1 — Positionnement Stratégique
Leçon 3 : Logique du NIST CSF — Identify & Protect en profondeur

🎯 **Objectif Stratégique**
Maîtriser la logique structurelle des fonctions Identify et Protect du Cybersecurity Framework afin de comprendre comment un État ou une organisation construit une posture défensive cohérente.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer l’architecture conceptuelle du NIST CSF
- Comprendre pourquoi Identify précède toute défense
- Traduire Protect en décisions architecturales concrètes
- Appliquer ces fonctions à une infrastructure critique

1️⃣ **Comprendre la Philosophie du NIST CSF**
Le Cybersecurity Framework n’est pas une checklist technique, c’est un modèle stratégique de gestion du risque reposant sur 5 fonctions : Identify, Protect, Detect, Respond, Recover.

2️⃣ **Identify : Connaître pour Défendre**
On ne peut protéger que ce qu’on connaît. Identify vise à cartographier les actifs, les dépendances (Asset Management) et les risques pour définir une stratégie de gestion cohérente.

3️⃣ **Identify dans un Contexte Étatique**
Au niveau national, Identify est un enjeu souverain : recensement des opérateurs stratégiques, dépendances trans-sectorielles et sécurité de la supply chain numérique.

4️⃣ **Protect : Construire la Barrière Intelligente**
Protect ne signifie pas empiler des outils, mais concevoir une architecture (Access Control, Data Security) capable de limiter la probabilité et l'impact d'une intrusion.

5️⃣ **Traduction Architecturale de Protect**
Dans un environnement critique, Protect se traduit par la segmentation, le durcissement et surtout le modèle **Zero Trust** (NIST SP 800-207) : Ne jamais faire confiance, toujours vérifier.

🔶 **Lecture Stratégique CRYPTE : Pourquoi Identify & Protect Sont des Actes Politiques**
Un État qui ignore ses dépendances technologiques ne peut pas être résilient. Identify est un acte de lucidité stratégique ; Protect est un acte de souveraineté indispensable à la stabilité politique.

6️⃣ **Cas Réel — Défaillance d’Identify**
L’absence de visibilité est plus dangereuse que l’absence d’outils. De nombreuses intrusions majeures réussissent car les actifs exposés n’étaient pas inventoriés ou cartographiés.

📌 **Résumé Exécutif**
Le NIST CSF est un cadre stratégique. Identify est la fondation de toute posture défensive, tandis que Protect traduit la stratégie en architecture concrète.`;

    await prisma.video.create({
        data: {
            title: "Leçon 3 : Logique du NIST CSF — Identify & Protect en profondeur",
            order: 3,
            moduleId: modules[0].id,
            content: lesson3Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "STRATEGIC",
            description: "Approfondissement des fonctions Identify et Protect du framework NIST."
        }
    });

    const lesson4Content = `🛡 Architecture de Défense & Résilience Réseau
Module 1 — Positionnement Stratégique
Leçon 4 : 🔶 Lecture Stratégique CRYPTE — Adapter la Cyber-Résilience aux États Émergents

🎯 **Objectif Stratégique**
Comprendre pourquoi l’application brute des frameworks internationaux est insuffisante pour les États émergents, et comment adaptation ces référentiels pour construire une résilience réellement souveraine.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Identifier les limites d’une adoption standardisée des frameworks
- Analyser les vulnérabilités structurelles spécifiques aux économies émergentes
- Proposer une adaptation stratégique du NIST CSF
- Intégrer la cyber-résilience dans une vision nationale de développement

1️⃣ **L’Illusion de la Transposition Directe**
Les frameworks (NIST CSF, etc.) conçus pour des économies matures ne tiennent pas compte de la dépendance technologique extérieure ou de la gouvernance fragmentée des États émergents. La conformité n'est pas la résilience.

2️⃣ **Vulnérabilités Structurelles des États Émergents**
- Dépendance Fournisseur (technologies importées sans audit possible)
- Externalisation Massive (services cloud hors territoire)
- Faible Cartographie des Actifs
- Culture de Réaction (absence de stratégie proactive)

3️⃣ **Adapter Identify : Vision Nationale Centralisée**
Identify doit devenir un acte de souveraineté : Registre national des infrastructures critiques et cartographie consolidée des dépendances technologiques globales.

4️⃣ **Adapter Protect : Priorisation Stratégique**
Ressources limitées = Priorisation drastique. Approche CRYPTE : identifier les 20% d’actifs produisant 80% d’impact national et concentrer la segmentation et le Zéro Trust sur ce périmètre.

🔶 **Doctrine CRYPTE : Résilience Progressive & Contextuelle**
Trois principes : Réalisme capacitaire (construire selon ses moyens), Progressivité (couches successives) et Autonomisation (formation d'élites locales souveraines).

5️⃣ **Cas Réel — Effondrement par Dépendance**
Une dépendance excessive à un fournisseur unique peut provoquer une paralysie nationale en cas de crise géopolitique. La résilience doit être politique, économique et éducative.

📌 **Résumé Exécutif**
Les frameworks internationaux doivent être contextualisés. La doctrine CRYPTE propose une résilience progressive, réaliste et souveraine, pilier du développement national.`;

    await prisma.video.create({
        data: {
            title: "Leçon 4 : 🔶 Lecture Stratégique CRYPTE — Adapter la Cyber-Résilience",
            order: 4,
            moduleId: modules[0].id,
            content: lesson4Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "STRATEGIC",
            description: "La doctrine CRYPTE appliquée aux enjeux de résilience des nations émergentes."
        }
    });

    console.log("✅ Leçon 4 injectée avec succès. Module 1 complet.");

    // MODULE 2
    const lesson5Content = `🛡 Architecture de Défense & Résilience Réseau
Module 2 — Fondamentaux Techniques : Zero Trust & Segmentation
Leçon 1 : Dépasser le Modèle Périmétrique — La Naissance du Zero Trust

🎯 **Objectif Stratégique**
Comprendre pourquoi le modèle de sécurité périmétrique traditionnel est devenu obsolète et comment le paradigme Zero Trust redéfinit l’architecture de défense réseau moderne.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer les limites du modèle “château fort”
- Définir les principes fondamentaux du Zero Trust
- Comprendre la logique du NIST SP 800-207
- Traduire Zero Trust en implications architecturales concrètes

1️⃣ **Le Modèle Périmétrique : Héritage d’une Époque Révolue**
Le modèle “château fort” (Firewall, DMZ, VPN) reposait sur la confiance implicite interne. Ce monde n’existe plus car le réseau n'est plus un lieu, mais un ensemble dynamique.

2️⃣ **L’Érosion du Périmètre**
Le cloud, le SaaS et le télétravail ont dissous le périmètre. Le réseau est devenu un ensemble d’identités et de flux distribués.

3️⃣ **Le Problème Fondamental : Mouvement Latéral**
Dans un réseau interne plat, franchir la frontière externe permet souvent de se déplacer librement (Mouvement Latéral). Le problème est la propagation interne, pas l'intrusion initiale.

4️⃣ **Zero Trust : Changement de Paradigme**
**Never trust, always verify.** Aucune confiance implicite n'est accordée. Chaque requête doit être authentifiée, autorisée et vérifiée contextuellement.

5️⃣ **Formalisation : NIST SP 800-207**
Le standard définit le Policy Engine et les Access Control basés sur l'identité, le contexte et la posture de sécurité, et non sur l'adresse IP.

6️⃣ **Principes Fondamentaux du Zero Trust**
- Vérification continue
- Moindre privilège (accès minimal nécessaire)
- Segmentation fine
- Inspection constante

🔶 **Lecture Stratégique CRYPTE : Zero Trust comme Instrument de Résilience Nationale**
Pour un État émergent, Zero Trust limite l’impact d’une compromission et réduit le risque d’effondrement systémique en transformant une attaque en incident localisé.

📌 **Résumé Exécutif**
Le modèle périmétrique est obsolète. Zero Trust, formalisé par le NIST SP 800-207, repose sur la vérification continue et le moindre privilège pour transformer la résilience systémique.`;

    await prisma.video.create({
        data: {
            title: "Leçon 1 : Dépasser le Modèle Périmétrique — La Naissance du Zero Trust",
            order: 1,
            moduleId: modules[1].id,
            content: lesson5Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "TECHNICAL",
            description: "Introduction au paradigme Zero Trust et obsolescence du modèle périmétrique."
        }
    });

    const lesson6Content = `🛡 Architecture de Défense & Résilience Réseau
Module 2 — Fondamentaux Techniques : Zero Trust & Segmentation
Leçon 2 : Micro-segmentation & Architecture Réseau Résiliente

🎯 **Objectif Stratégique**
Comprendre comment la micro-segmentation transforme un réseau traditionnel en architecture résiliente capable de contenir les mouvements latéraux et de limiter l’impact d’une compromission.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer la différence entre segmentation classique et micro-segmentation
- Concevoir une logique de zones de sécurité hiérarchisées
- Comprendre le lien entre Zero Trust et segmentation fine
- Intégrer la micro-segmentation dans une stratégie nationale de résilience

1️⃣ **Segmentation Classique : Première Ligne, Mais Insuffisante**
La segmentation traditionnelle (VLAN, Sous-réseaux, Firewall inter-zones) isole les grandes catégories d’actifs mais laisse une confiance implicite au sein d'une même zone. Elle ne bloque pas la propagation interne fine.

2️⃣ **Micro-segmentation : Isolation Granulaire**
La micro-segmentation consiste à isoler les charges de travail individuellement (par application, service ou identité). Chaque ressource devient une enclave protégée, même au sein du même sous-réseau.

3️⃣ **Objectif Central : Contenir le Mouvement Latéral**
La micro-segmentation compartimente le réseau de manière étanche pour empêcher un attaquant d'escalader les privilèges ou d'atteindre des systèmes critiques via des mouvements latéraux (MITRE ATT&CK).

4️⃣ **Relation avec Zero Trust**
La micro-segmentation est le bras opérationnel du Zero Trust (NIST SP 800-207). Elle permet d'appliquer des décisions d'accès contextualisées au niveau le plus granulaire.

5️⃣ **Architectures de Micro-segmentation**
- Approche Software-Defined (SDN) : contrôle centralisé et adaptation dynamique.
- Approche basée sur l’identité : accès accordé selon le rôle et la posture.

🔶 **Lecture Stratégique CRYPTE : Micro-segmentation comme Bouclier Anti-Effondrement**
Pour un État émergent, la micro-segmentation est une assurance structurelle contre l’effondrement en cascade. Elle empêche la contamination trans-sectorielle et transforme un choc national potentiel en incident contenu.

📌 **Résumé Exécutif**
La micro-segmentation constitue le mécanisme opérationnel du Zero Trust. Elle réduit drastiquement le mouvement latéral et prévient les effondrements systémiques grâce à une compartimentation stricte et évolutive.`;

    await prisma.video.create({
        data: {
            title: "Leçon 2 : Micro-segmentation & Architecture Réseau Résiliente",
            order: 2,
            moduleId: modules[1].id,
            content: lesson6Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "TECHNICAL",
            description: "Analyse technique de la micro-segmentation comme bouclier contre les mouvements latéraux."
        }
    });

    const lesson7Content = `🛡 Architecture de Défense & Résilience Réseau
Module 2 — Fondamentaux Techniques : Zero Trust & Segmentation
Leçon 3 : Software-Defined Networking (SDN) & Contrôle Centralisé

🎯 **Objectif Stratégique**
Comprendre comment le Software-Defined Networking transforme le réseau en infrastructure programmable, adaptable et stratégiquement contrôlable.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer la séparation plan de contrôle / plan de données
- Comprendre le rôle du contrôleur SDN
- Relier SDN à Zero Trust et à la micro-segmentation
- Identifier les enjeux souverains liés au contrôle centralisé

1️⃣ **Le Réseau Traditionnel : Intelligence Distribuée**
Dans un modèle classique, chaque équipement décide de son propre routage, entraînant complexité et difficulté d'audit global. La gouvernance y est fragmentée.

2️⃣ **Le Principe Fondamental du SDN**
Le SDN sépare le **Plan de données** (transport) du **Plan de contrôle** (décision). Le contrôle est centralisé dans un contrôleur logiciel, rendant les équipements purement exécutants.

3️⃣ **SDN & Zero Trust**
Le Zero Trust exige des décisions dynamiques and contextuelles. Le SDN fournit l'orchestration unifiée nécessaire pour appliquer ces politiques cohérentes à grande échelle.

4️⃣ **Avantages Stratégiques du SDN**
- Cohérence globale des politiques.
- Automatisation et réduction des erreurs humaines.
- Réactivité quasi instantanée en cas d'incident (isolement automatique).

🔶 **Lecture Stratégique CRYPTE : Le Contrôleur SDN comme Actif Souverain Critique**
Le SDN concentre le pouvoir décisionnel. Dans une perspective souveraine, le contrôleur devient un actif critique qui doit être hautement sécurisé, redondant, audité et hébergé sous juridiction maîtrisée.

📌 **Résumé Exécutif**
Le SDN sépare le contrôle des données pour centraliser l'intelligence réseau. Il permet l'automatisation du Zero Trust et accélère la réponse aux incidents, mais impose une protection renforcée du contrôleur central.`;

    await prisma.video.create({
        data: {
            title: "Leçon 3 : Software-Defined Networking (SDN) & Contrôle Centralisé",
            order: 3,
            moduleId: modules[1].id,
            content: lesson7Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "TECHNICAL",
            description: "Technologie SDN et centralisation de l'intelligence réseau pour la défense."
        }
    });

    const lesson8Content = `🛡 Architecture de Défense & Résilience Réseau
Module 2 — Fondamentaux Techniques : Zero Trust & Segmentation
Leçon 4 : Identity-Centric Security & Contrôle d’Accès Adaptatif

🎯 **Objectif Stratégique**
Comprendre pourquoi l’identité devient le nouveau périmètre de sécurité et comment le contrôle d’accès adaptatif constitue le pilier opérationnel du Zero Trust.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer le passage d’une sécurité basée sur l’IP à une sécurité basée sur l’identité
- Comprendre les mécanismes IAM modernes (RBAC, ABAC)
- Intégrer l’authentification forte (MFA) et la vérification continue
- Concevoir une architecture d’accès adaptative souveraine

1️⃣ **La Fin du Périmètre Réseau Traditionnel**
Le modèle "château fort" est obsolète. Télétravail, Cloud et mobilité ont fait disparaître le périmètre physique.

2️⃣ **L’Identité Devient le Nouveau Périmètre**
Ce n’est plus l’adresse IP qui détermine la confiance, mais l’identité vérifiée (utilisateur, service, machine). Chaque entité doit prouver son identité à chaque demande.

3️⃣ **IAM & Authentification Forte**
Les systèmes d'Identity & Access Management (IAM) et le Multi-Factor Authentication (MFA) sont les fondations. Le standard NIST SP 800-63 définit les niveaux d'assurance d'identité requis selon la criticité.

4️⃣ **Contrôle d’Accès Adaptatif (ABAC)**
Au-delà du rôle (RBAC), le contrôle basé sur les attributs (ABAC) évalue le contexte : localisation, heure, posture de sécurité de l’appareil et sensibilité de la donnée.

5️⃣ **Vérification Continue : Beyond Login**
La confiance est dynamique. L'authentification devient un processus continu qui surveille les déviations comportementales et ajuste les accès en temps réel.

🔶 **Lecture Stratégique CRYPTE : L’Identité comme Actif Souverain**
Le système d'identité nationale et l'infrastructure de certificats (PKI) sont des actifs stratégiques critiques. La souveraineté impose la maîtrise des autorités de certification et un hébergement local des annuaires.

📌 **Résumé Exécutif**
L'identité est le nouveau centre de confiance. Une architecture Zero Trust est avant tout identity-centric, reposant sur l'IAM, le MFA et le contrôle adaptatif pour transformer une défense rigide en résilience dynamique.`;

    await prisma.video.create({
        data: {
            title: "Leçon 4 : Identity-Centric Security & Contrôle d’Accès Adaptatif",
            order: 4,
            moduleId: modules[1].id,
            content: lesson8Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "TECHNICAL",
            description: "Analyse de l'identité comme nouveau périmètre de sécurité dans le modèle Zero Trust."
        }
    });

    console.log("✅ Module 2 complet.");

    // MODULE 3
    const lesson9Content = `🛰️ Architecture de Défense & Résilience
Module 3 — Détection, Réponse & Résilience Opérationnelle
Leçon 1 : Détection Avancée & Logique du SOC Moderne

🎯 **Objectif Stratégique**
Transformer une architecture défensive statique en système nerveux opérationnel capable de détecter, analyser et qualifier une menace en temps réel.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Comprendre le rôle stratégique d’un Security Operations Center (SOC)
- Expliquer la logique de détection moderne
- Différencier surveillance passive et détection proactive
- Intégrer la détection dans une vision souveraine

1️⃣ **De la Protection à la Surveillance Active**
Postulat fondamental : l'intrusion est possible. La détection rapide est vitale. La question n'est plus "Peut-on empêcher toute attaque ?", mais "À quelle vitesse peut-on détecter et contenir ?".

2️⃣ **Le SOC : Centre Nerveux de la Défense**
Le SOC est une structure organisationnelle et technique assurant la surveillance continue, l'analyse des alertes et la coordination de la réponse 24/7.

3️⃣ **Les Composants Clés de la Détection Moderne**
- **SIEM** : Corrélation d'événements à grande échelle (Logs, Réseau).
- **EDR** : Surveillance des terminaux (Processus, Mémoire).
- **NDR** : Analyse des flux réseau et des mouvements latéraux.

4️⃣ **La Logique des TTP (MITRE ATT&CK)**
La détection ne vise pas uniquement les signatures connues, mais les comportements (Tactics, Techniques & Procedures). Identifier les déviations par rapport au profil normal est la clé.

🔶 **Lecture Stratégique CRYPTE : La Détection comme Capacité de Défense Nationale**
Dans un État émergent, un SOC isolé protège une organisation, mais un réseau de SOC coordonnés protège une nation. La mutualisation sectorielle et le partage d'indicateurs sont des impératifs souverains.

5️⃣ **SOC Moderne : Vers l'Automatisation**
L'évolution vers le **SOAR** (Orchestration & Automation) permet des playbooks automatisés pour réduire le MTTR (Mean Time To Respond).

📌 **Résumé Exécutif**
Le SOC est le centre nerveux dynamique de la résilience. Basée sur l'analyse comportementale (TTP), la détection moderne vise à réduire drastiquement le temps de réaction pour transformer l'intrusion en incident contenu.`;

    await prisma.video.create({
        data: {
            title: "Leçon 1 : Détection Avancée & Logique du SOC Moderne",
            order: 1,
            moduleId: modules[2].id,
            content: lesson9Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "TECHNICAL",
            description: "Analyse de la détection comme système nerveux de l'architecture résiliente."
        }
    });

    console.log("✅ Module 3, Leçon 1 injectée avec succès.");

    const lesson10Content = `🛰️ Architecture de Défense & Résilience
Module 3 — Détection, Réponse & Résilience Opérationnelle
Leçon 2 : Incident Response & Logique de Containment Stratégique

🎯 **Objectif Stratégique**
Transformer une alerte qualifiée en action coordonnée, rapide et maîtrisée.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Comprendre les phases d’une réponse à incident
- Concevoir une logique de containment graduée
- Distinguer réaction tactique et coordination stratégique
- Intégrer la réponse à incident dans une vision souveraine

1️⃣ **Postulat Opérationnel**
Une intrusion détectée est soit en cours, soit déjà établie. Le facteur déterminant n’est plus la prévention, mais la vitesse de confinement. Le temps devient une variable stratégique : chaque minute sans action favorise le mouvement latéral et l’exfiltration.

2️⃣ **Cycle Classique de Réponse à Incident (NIST SP 800-61)**
1. **Préparation** : Plans, playbooks, rôles définis avant la crise.
2. **Détection & Analyse** : Qualification et validation de l’incident.
3. **Containment, Éradication & Récupération** : Isolation, suppression de la menace et restauration des services.
4. **Retour d’expérience** : Amélioration continue post-crise.

3️⃣ **La Logique du Containment**
Le containment est l’acte central visant à stopper la propagation.
- **Court Terme** : Isolement immédiat (déconnexion machine, blocage de compte).
- **Long Terme** : Stabilisation contrôlée (surveillance renforcée, migration progressive).

4️⃣ **L’Art de la Décision : Couper ou Observer ?**
Isoler immédiatement peut alerter l’attaquant ou interrompre un service vital. Une réponse stratégique peut impliquer une observation contrôlée pour cartographier le périmètre compromis et identifier les TTP (MITRE ATT&CK) avant de frapper.

5️⃣ **Leviers de l’Architecture Zero Trust**
- **Micro-segmentation** -> Isolation chirurgicale.
- **SDN** -> Reconfiguration réseau instantanée.
- **Identity-Centric** -> Révocation immédiate des privilèges.

🔶 **Lecture Stratégique CRYPTE : La Réponse comme Capacité Nationale**
Sur une infrastructure critique (Énergie, Télécom), l'incident devient systémique. La doctrine CRYPTE impose une escalade vers l’autorité nationale et une coordination inter-sectorielle pour éviter l’effet domino.

📌 **Résumé Exécutif**
Le containment est le cœur de la réponse à incident. Grâce au Zero Trust, il devient chirurgical plutôt que traumatique. À l’échelle nationale, la capacité de réponse coordonnée est un pilier fondamental de la souveraineté numérique.`;

    await prisma.video.create({
        data: {
            title: "Leçon 2 : Incident Response & Logique de Containment Stratégique",
            order: 2,
            moduleId: modules[2].id,
            content: lesson10Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "TECHNICAL",
            description: "Stratégies de confinement et cycle de réponse à incident dans une architecture résiliente."
        }
    });

    console.log("✅ Module 3, Leçon 2 injectée avec succès.");

    const lesson11Content = `🛰️ Architecture de Défense & Résilience
Module 3 — Détection, Réponse & Résilience Opérationnelle
Leçon 3 : Threat Intelligence & Chasse aux Menaces (Threat Hunting)

🎯 **Objectif Stratégique**
Passer d’une posture réactive à une posture proactive fondée sur l’anticipation des adversaires.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Comprendre la logique de la Threat Intelligence
- Distinguer renseignement stratégique, tactique et opérationnel
- Structurer une démarche de Threat Hunting
- Intégrer la chasse aux menaces dans une doctrine souveraine

1️⃣ **La Limite du Modèle Réactif**
Un SOC classique attend l’alerte pour réagir. Problème : un adversaire sophistiqué peut rester discret, utiliser des outils natifs ou des identifiants légitimes. Le Threat Hunting part d’un principe : l’attaquant est peut-être déjà présent.

2️⃣ **Threat Intelligence (CTI) : Comprendre l’Adversaire**
La CTI consiste à analyser les groupes d’attaquants, leurs motivations et leurs **TTP (Tactics, Techniques & Procedures)**. Le référentiel **MITRE ATT&CK** est la base pour cartographier ces comportements et prioriser les détections.

3️⃣ **Les Niveaux de Threat Intelligence**
- **Stratégique** : Tendances géopolitiques et menaces sectorielles (pour les décideurs).
- **Tactique** : Indicateurs techniques comme les hashs ou IP malveillantes (pour le SOC).
- **Opérationnelle** : Détails sur les campagnes actives et modes opératoires (pour l'IR et le hunting).

4️⃣ **Threat Hunting : Logique et Méthodologie**
C'est une démarche hypothético-déductive :
1. **Formuler une hypothèse** (ex: "Un acteur APT exploite les comptes de service pour mouvement latéral").
2. **Identifier les données** (Logs AD, authentifications).
3. **Rechercher des anomalies** comportementales.
4. **Confirmer ou infirmer**.

5️⃣ **Leviers de l’Architecture Souveraine**
Le hunting exige des logs de haute qualité. Les briques Zero Trust (Micro-segmentation, Identity-centric) facilitent la traçabilité et limitent la surface d’observation, rendant la chasse plus efficace.

🔶 **Lecture Stratégique CRYPTE : Le Renseignement comme Outil de Souveraineté**
La doctrine CRYPTE impose de ne pas dépendre uniquement des flux d'intelligence étrangers. Un État mature doit développer sa propre capacité nationale de corrélation sectorielle et de partage sécurisé des signaux faibles.

📌 **Résumé Exécutif**
Le Threat Hunting transforme le SOC en unité proactive. En s'appuyant sur la Threat Intelligence et le cadre MITRE ATT&CK, l'organisation traque l'adversaire avant qu'il ne frappe. La souveraineté passe par la maîtrise et la production nationale de ce renseignement cyber.`;

    await prisma.video.create({
        data: {
            title: "Leçon 3 : Threat Intelligence & Chasse aux Menaces (Threat Hunting)",
            order: 3,
            moduleId: modules[2].id,
            content: lesson11Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "TECHNICAL",
            description: "Techniques de chasse proactive et utilisation du renseignement sur les menaces (CTI)."
        }
    });

    console.log("✅ Module 3, Leçon 3 injectée avec succès.");

    const lesson12Content = `🛰️ Architecture de Défense & Résilience
Module 3 — Détection, Réponse & Résilience Opérationnelle
Leçon 4 : Cyber Crisis Management & Continuité d’Activité

🎯 **Objectif Stratégique**
Élever la réponse à incident au niveau de la gestion de crise organisationnelle et nationale.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Distinguer incident technique et crise cyber
- Structurer une cellule de gestion de crise
- Intégrer PCA/PRA dans une stratégie cyber
- Concevoir une résilience adaptée aux infrastructures critiques

1️⃣ **Incident vs Crise : Changement de Nature**
Un incident affecte un système et reste géré techniquement. Une crise cyber impacte l’activité métier, menace la réputation et peut avoir des implications politiques majeures. À ce stade, la gouvernance prend le relais du SOC.

2️⃣ **Architecture d’une Cellule de Crise**
Une réponse efficace exige une coordination structurée entre :
- **Direction Générale** (Décision stratégique).
- **CISO/RSSI** (Expertise technique consolidated).
- **Communication & Juridique** (Réputation et conformité).
- **Continuité d’Activité** (Maintien des fonctions vitales).

3️⃣ **Continuité (PCA) & Reprise (PRA)**
- **PCA (Plan de Continuité d’Activité)** : Maintenir les fonctions essentielles malgré l’attaque (procédures manuelles, sites secondaires).
- **PRA (Plan de Reprise d’Activité)** : Restaurer les systèmes (sauvegardes sécurisées, validation d’intégrité).
La résilience se prépare avant la crise via des normes comme l’ISO 22301.

4️⃣ **Gestion de la Communication**
Le silence ou les messages contradictoires sont fatals. Une stratégie efficace impose une transparence maîtrisée, un message centralisé et une coordination étroite avec les autorités nationales.

🔶 **Lecture Stratégique CRYPTE : La Crise comme Enjeu de Souveraineté**
Pour un État, une crise systémique touche l'énergie, la monnaie ou la santé. La doctrine CRYPTE préconise des centres nationaux de crise, des exercices intersectoriels réguliers et une fusion entre défense civile et numérique.

📌 **Résumé Exécutif**
La gestion de crise cyber dépasse le cadre de l’IT pour devenir un enjeu de gouvernance et de souveraineté. PCA et PRA sont les piliers de la résilience, tandis que la préparation (simulations, exercices) est le seul gage d'une réponse efficace face à l'imprévu.`;

    await prisma.video.create({
        data: {
            title: "Leçon 4 : Cyber Crisis Management & Continuité d’Activité",
            order: 4,
            moduleId: modules[2].id,
            content: lesson12Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "STRATEGIC",
            description: "Gestion de crise organisationnelle, plans de continuité (PCA) et de reprise (PRA)."
        }
    });

    console.log("✅ Module 3, Leçon 4 injectée avec succès.");

    const lesson13Content = `🛰️ Architecture de Défense & Résilience
Module 3 — Détection, Réponse & Résilience Opérationnelle
Leçon 5 : 🔶 Lecture Stratégique CRYPTE — Souveraineté de la Réponse & Coopération Nationale

🎯 **Objectif Stratégique**
Placer la réponse à incident dans un cadre de souveraineté étatique et comprendre les mécanismes de défense collective face aux crises systémiques.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer pourquoi la réponse à incident est un acte de souveraineté
- Identifier les piliers de la coopération nationale (SOC/CERT)
- Comprendre la logique des playbooks nationaux
- Intégrer la défense collective dans une stratégie de résilience

1️⃣ **La Réponse comme Acte Régalien**
Face à une attaque sur une infrastructure vitale (énergie, santé), la réponse dépasse l’entreprise. C’est une question de sécurité nationale. La souveraineté de la réponse implique de ne pas dépendre exclusivement d’outils ou d’expertises étrangères en situation de crise.

2️⃣ **Défense Collective : Le Modèle SOC-à-SOC**
Un SOC isolé est vulnérable. La doctrine CRYPTE préconise une interconnexion des centres d'opérations :
- **Partage automatisé des IoC** (Indicateurs de Compromission).
- **Corrélation sectorielle** (détecter une attaque qui se propage de banque en banque).
- **Entraide opérationnelle** entre organisations critiques.

3️⃣ **Gouvernance & Rôle du National CERT**
Le CERT national agit comme le chef d'orchestre. Il centralise les signaux faibles, émet les alertes stratégiques et coordonne les interventions de haut niveau. La coopération public-privé est le multiplicateur de force de la résilience numérique.

4️⃣ **Souveraineté des Outils de Réponse**
Maîtriser sa réponse, c'est maîtriser ses outils (EDR, Forensic). L'usage de solutions ouvertes, auditables ou nationales réduit le risque d'espionnage collatéral ou de "kill switch" externe lors d'un conflit géopolitique.

🔶 **Doctrine CRYPTE : Vers l'Autonomie Stratégique**
La résilience d'un État ne se mesure pas au nombre de pare-feux, mais à sa capacité à diagnostiquer et expulser un intrus de manière autonome. Cela exige une force d'intervention rapide nationale et une base industrielle de sécurité locale.

📌 **Résumé Exécutif**
La réponse à incident est le test ultime de la souveraineté numérique. Elle exige une vision qui dépasse la technique pour embrasser la coopération nationale, le partage de renseignement et l'indépendance technologique. Un État résilient est un État capable de manœuvrer collectivement dans le brouillard de la guerre cyber.`;

    await prisma.video.create({
        data: {
            title: "Leçon 5 : 🔶 Lecture Stratégique CRYPTE — Souveraineté de la Réponse",
            order: 5,
            moduleId: modules[2].id,
            content: lesson13Content,
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
            type: "STRATEGIC",
            description: "Analyse de la souveraineté nationale et de la coopération inter-sectorielle en cas de crise."
        }
    });

    console.log("✅ Module 3 complet. 5 leçons injectées.");
}

reconstructPilot()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
