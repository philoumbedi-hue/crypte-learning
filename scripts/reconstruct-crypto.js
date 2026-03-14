const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function reconstructCrypto() {
    console.log("🚀 Lancement de l'injection structurale : Cryptographie Avancée & Infrastructures PKI...");

    // 1. Trouver la discipline
    const discipline = await prisma.discipline.findFirst({
        where: { name: { contains: "Cybersécurité" } }
    });

    if (!discipline) {
        console.error("❌ Discipline 'Cybersécurité' non trouvée.");
        return;
    }

    // 2. Créer ou mettre à jour le cours
    const courseTitle = "🔐 Cryptographie Avancée & Infrastructures PKI";
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
            description: "Le socle de confiance cryptographique des architectures résilientes : de la théorie mathématique à la gouvernance PKI souveraine.",
            level: "AVANCÉ",
            disciplineId: discipline.id,
            imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop"
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
            title: "Module 1 — Fondements de la Cryptographie Moderne",
            order: 1,
            learningObjectives: "Comprendre les bases mathématiques et conceptuelles de la cryptographie contemporaine.",
            theoryContent: "🎯 Objectif stratégique : Maîtriser les briques de base.\n📌 Positionnement : Fondations mathématiques.\n🔐 Vision souveraine : Indépendance algorithmique.",
            lessons: [
                "Histoire & évolution de la cryptographie (de César à l'ère quantique)",
                "Concepts fondamentaux : confidentialité, intégrité, authenticité",
                "Cryptographie symétrique (AES, modes opératoires)",
                "Cryptographie asymétrique (RSA, ECC)",
                "Fonctions de hachage & signatures numériques",
                "Gestion des clés & entropy",
                "Introduction aux menaces post-quantiques"
            ]
        },
        {
            title: "Module 2 — Cryptographie Appliquée aux Réseaux & Systèmes",
            order: 2,
            learningObjectives: "Appliquer la cryptographie aux architectures modernes.",
            theoryContent: "🎯 Objectif stratégique : Sécuriser les flux et les données.\n📌 Positionnement : Application technique.\n🔐 Vision souveraine : Maîtrise des implémentations.",
            lessons: [
                "TLS & sécurisation des communications",
                "IPSec & VPN sécurisés",
                "Chiffrement des données au repos",
                "Secure Boot & Chaîne de confiance",
                "Chiffrement des bases de données",
                "Tokenisation & chiffrement applicatif",
                "Cryptographie dans le Cloud"
            ]
        },
        {
            title: "Module 3 — Infrastructure PKI & Autorités de Certification",
            order: 3,
            learningObjectives: "Construire et gouverner une infrastructure de confiance.",
            theoryContent: "🎯 Objectif stratégique : Établir la confiance systémique.\n📌 Positionnement : Infrastructure de confiance.\n🔐 Vision souveraine : Maîtrise nationale des clés racines.",
            lessons: [
                "Principes d'une Public Key Infrastructure (PKI)",
                "Autorités de Certification (CA) & hiérarchie racine",
                "Certificats X.509 & cycle de vie",
                "Revocation (CRL, OCSP)",
                "HSM (Hardware Security Modules)",
                "Gouvernance & politique de certification (CP/CPS)",
                "PKI souveraine & maîtrise nationale des clés racines"
            ]
        },
        {
            title: "Module 4 — Architecture Cryptographique Souveraine",
            order: 4,
            learningObjectives: "Intégrer la cryptographie dans une stratégie de souveraineté.",
            theoryContent: "🎯 Objectif stratégique : Protéger l'indépendance nationale.\n📌 Positionnement : Vision souveraine.\n🔐 Vision souveraine : Autonomie stratégique cryptographique.",
            lessons: [
                "Souveraineté cryptographique & dépendance fournisseur",
                "Gestion nationale des clés critiques",
                "Protection des infrastructures critiques par la cryptographie",
                "Cryptographie et identité numérique nationale",
                "Stratégie post-quantique",
                "Audit cryptographique & conformité",
                "Résilience des infrastructures de confiance"
            ]
        },
        {
            title: "Module 5 — Cas Pratiques & Implémentation Réelle",
            order: 5,
            learningObjectives: "Transformer la théorie en implémentation opérationnelle.",
            theoryContent: "🎯 Objectif stratégique : Valider les compétences par la pratique.\n📌 Positionnement : Implémentation réelle.\n🔐 Vision souveraine : Opérabilité autonome.",
            lessons: [
                "Déploiement d'une PKI interne",
                "Mise en place d'une Root CA offline",
                "Intégration PKI avec Active Directory",
                "Implémentation TLS interne",
                "Gestion des certificats machine",
                "Simulation de compromission d'une CA",
                "Plan de réponse à incident cryptographique"
            ]
        }
    ];

    // 5. Contenus détaillés (Phase Alpha)
    const lesson1_1Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 1 — Fondements de la Cryptographie Moderne
Leçon 1 : Histoire & Évolution de la Cryptographie (de César à l’Ère Quantique)

🎯 **Objectif Stratégique**
Comprendre l’évolution de la cryptographie pour saisir :
- Son rôle dans la puissance étatique
- Son lien avec la souveraineté
- Son évolution vers les enjeux post-quantiques

À l’issue de cette leçon, l’apprenant devra être capable de :
- Situer les grandes périodes cryptographiques
- Expliquer le passage de la cryptographie artisanale à mathématique
- Comprendre l’impact stratégique du chiffrement moderne

1️⃣ **Les Origines : Cryptographie Antique**

🔹 **Le Chiffrement de César**
Attribué à Jules César, il repose sur un simple décalage alphabétique.
- Substitution monoalphabétique
- Faible résistance
- Usage militaire tactique

🔹 **La Scytale Spartiate**
Dispositif mécanique utilisé à Sparte : bâton cylindrique où le message n'est lisible qu'avec un diamètre identique. Première matérialisation d’un support de clé physique.

2️⃣ **Renaissance & Premiers Chiffrements Complexes**

🔹 **Chiffrement de Vigenère**
Introduction du polyalphabétique : variation de substitution, résistance accrue aux analyses fréquentielles. Utilisé dans les communications diplomatiques : la cryptographie devient un outil d’État.

3️⃣ **Révolution Industrielle & Cryptographie Mécanique**

🔹 **La Machine Enigma**
Utilisée par l’Allemagne nazie. Son décryptage à Bletchley Park par Alan Turing marque la naissance de la cryptanalyse moderne et l’émergence de l’informatique. La cryptographie devient un enjeu stratégique mondial.

4️⃣ **Passage à la Cryptographie Mathématique**
Après 1945 : formalisation mathématique, théorie de l’information. Claude Shannon pose les bases théoriques de la sécurité parfaite. La cryptographie quitte le domaine artisanal.

5️⃣ **Révolution de la Cryptographie Asymétrique**
1976–1978 : Diffie-Hellman, RSA. Innovation majeure : séparation clé publique / clé privée. Conséquence : sécurisation d’Internet, naissance des PKI, commerce électronique. La confiance numérique devient possible à grande échelle.

6️⃣ **Cryptographie & Internet**
La cryptographie moderne soutient TLS, VPN, signature électronique, authentification forte. Sans cryptographie asymétrique, Internet ne serait pas sécurisé.

7️⃣ **L’Ère Post-Quantique**
Menace émergente : les ordinateurs quantiques pourraient casser RSA et ECC. Recherche active sur la cryptographie à base de réseaux euclidiens et algorithmes résistants quantiques.

🔶 **Lecture Stratégique CRYPTE : Cryptographie & Puissance Étatique**
Historiquement, Rome protégeait ses ordres militaires, les monarchies leur diplomatie, les États modernes leurs infrastructures. Aujourd’hui, la cryptographie protège l’identité nationale, les systèmes financiers, l'énergie et la défense. Un État dépendant d’algorithmes étrangers sans maîtrise interne fragilise sa souveraineté.

📌 **Résumé Exécutif**
La cryptographie évolue de technique artisanale à science mathématique. La Seconde Guerre mondiale marque un tournant stratégique. La cryptographie asymétrique rend possible l’Internet sécurisé. L’ère quantique représente un nouveau défi majeur. La cryptographie est un pilier de souveraineté nationale.`;

    const lesson1_2Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 1 — Fondements de la Cryptographie Moderne
Leçon 2 : Concepts Fondamentaux — Confidentialité, Intégrité, Authenticité

🎯 **Objectif Stratégique**
Maîtriser les trois propriétés fondamentales qui structurent toute architecture cryptographique moderne.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Définir précisément confidentialité, intégrité et authenticité
- Comprendre leurs différences et complémentarités
- Identifier les mécanismes cryptographiques associés
- Les relier aux infrastructures critiques et à la souveraineté numérique

1️⃣ **La Triade Fondamentale**

La cryptographie moderne repose sur trois garanties principales :
- **Confidentialité** : Qui peut lire ? -> Empêcher l’accès non autorisé.
- **Intégrité** : Le message a-t-il été modifié ? -> Détecter toute altération.
- **Authenticité** : Qui est l’émetteur ? -> Vérifier l’identité.

Ces trois propriétés sont indépendantes mais complémentaires.

2️⃣ **Confidentialité**
Garantir qu’une information ne soit accessible qu’aux entités autorisées.
🔐 mécanisme principal : **Chiffrement**.
- **Cryptographie Symétrique** : Clé unique, rapide, gros volumes (AES).
- **Cryptographie Asymétrique** : Clé publique / privée, échange sécurisé de clés.

⚠️ *Limite* : Le chiffrement protège le contenu mais ne garantit pas l’identité.

3️⃣ **Intégrité**
Assurer qu’un message n’a subi aucune modification non autorisée.
🔐 Mécanismes principaux :
- **Fonctions de hachage** : Empreinte unique, irréversible (SHA-256).
- **HMAC** : Combine clé secrète + hachage pour intégrité + authentification symétrique.

⚠️ *Limite* : Un hash seul ne prouve pas l’identité.

4️⃣ **Authenticité**
Garantir que l’émetteur est bien celui qu’il prétend être.
🔐 Mécanisme principal : **Signature numérique**.
Processus : Hash du message -> Chiffrement du hash avec clé privée -> Vérification via clé publique -> Non-répudiation.
Résultat : Authentification, Intégrité, Non-répudiation.

5️⃣ **Non-Répudiation**
Un émetteur ne peut nier avoir signé un message. C'est le fondement juridique de la signature électronique qualifiée et des PKI.

6️⃣ **Interaction des Trois Propriétés**
Exemple : **TLS**
- Confidentialité -> Chiffrement AES
- Intégrité -> HMAC
- Authenticité -> Certificat X.509

Une seule propriété isolée est insuffisante pour une sécurité réelle.

7️⃣ **Erreurs Conceptuelles Courantes**
❌ Confondre chiffrement et signature.
❌ Croire qu’un hash garantit l’identité.
❌ Supposer que confidentialité implique intégrité.

🔶 **Lecture Stratégique CRYPTE : La Triade comme Socle de Souveraineté**
Dans une infrastructure critique : la Confidentialité protège les secrets stratégiques, l'Intégrité protège les systèmes industriels, et l'Authenticité protège l’identité nationale. La cryptographie n’est pas un outil technique, c’est un instrument de puissance.

📌 **Résumé Exécutif**
La cryptographie repose sur trois propriétés fondamentales : Confidentialité (chiffrement), Intégrité (hachage), Authenticité (signature numérique). Leur combinaison fonde la sécurité moderne et la souveraineté numérique.`;

    const lesson1_3Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 1 — Fondements de la Cryptographie Moderne
Leçon 3 : Cryptographie Symétrique — AES, Modes Opératoires & Gestion des Clés

🎯 **Objectif Stratégique**
Comprendre en profondeur :
- Le fonctionnement de la cryptographie symétrique moderne
- L’algorithme AES comme standard mondial
- L’importance critique des modes opératoires
- Le rôle central de la gestion des clés

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer le fonctionnement général d’un chiffrement symétrique
- Identifier les différences entre ECB, CBC, GCM
- Comprendre pourquoi le mode est aussi important que l’algorithme
- Relier la gestion des clés à la résilience d’une infrastructure

1️⃣ **Principe de la Cryptographie Symétrique**
Un même secret (clé) est utilisé pour chiffrer et déchiffrer.
**Avantages** : Très rapide, adaptée aux gros volumes.
**Usage** : TLS (session), chiffrement disque (BitLocker), VPN.

2️⃣ **AES — Advanced Encryption Standard**
Standard mondial (NIST FIPS 197). 
- Bloc de 128 bits
- Clés : 128 / 192 / 256 bits
Structure : SubBytes, ShiftRows, MixColumns, AddRoundKey.
**Pourquoi stratégique ?** Audité mondialement, support matériel (AES-NI), standard gouvernemental.

3️⃣ **Les Modes Opératoires (Critiques)**
- **ECB (Electronic Codebook)** : ⚠️ À éviter. Blocs identiques -> sorties identiques. Fuite de structure.
- **CBC (Cipher Block Chaining)** : Chaque bloc dépend du précédent. Utilise un IV (vecteur d’initialisation).
- **GCM (Galois/Counter Mode)** : Standard moderne recommandé. Chiffrement + intégrité intégrée.

4️⃣ **Authenticated Encryption (AEAD)**
Un chiffrement moderne doit garantir Confidentialité + Intégrité (ex: AES-GCM, ChaCha20-Poly1305).

5️⃣ **Gestion des Clés — Le Point Critique**
Un algorithme fort avec une clé mal gérée = sécurité nulle. 
**Bonnes pratiques** : Entropie fiable, rotation périodique, stockage dans HSM, politique formalisée.

6️⃣ **Longueur de Clé & Sécurité**
- 128 bits : Suffisant actuellement.
- 256 bits : Marge stratégique/souveraine pour infrastructures critiques.

7️⃣ **Menaces Modernes**
- Attaques par canal auxiliaire (Timing, Power analysis).
- Mauvaise implémentation (Padding oracle, réutilisation IV).
- Compromission des clés (vecteur principal d'échec).

🔶 **Lecture Stratégique CRYPTE : Le Chiffrement Symétrique comme Pilier d’Infrastructure**
Dans une architecture nationale, AES protège les communications ministérielles et financières. La vraie vulnérabilité n'est pas l'algorithme, mais la gouvernance des clés et la dépendance technologique. La souveraineté dépend du contrôle total des secrets.

📌 **Résumé Exécutif**
La cryptographie symétrique est rapide et essentielle. AES est le standard mondial. Le mode opératoire est aussi critique que l’algorithme. La gestion des clés est le vrai enjeu stratégique.`;

    const lesson1_4Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 1 — Fondements de la Cryptographie Moderne
Leçon 4 : Cryptographie Asymétrique — RSA, ECC & Échange de Clés

🎯 **Objectif Stratégique**
Comprendre le fonctionnement et les enjeux de la cryptographie à clé publique, socle des infrastructures PKI modernes.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer le principe des paires de clés
- Comprendre RSA et ECC à un niveau technique
- Décrire le mécanisme d’échange de clés (Diffie-Hellman)
- Identifier les différences de performance et de sécurité
- Relier ces mécanismes aux infrastructures critiques

1️⃣ **Principe Fondamental : Clé Publique / Clé Privée**
Contrairement au modèle symétrique, on utilise une paire de clés : une publique (distribuée) et une privée (secrète). Ce qui est chiffré avec l'un ne peut être déchiffré qu'avec l'autre.
**Usages** : Chiffrement (confidentialité) et Signature (authenticité).

2️⃣ **RSA — Rivest, Shamir, Adleman**
Standard historique basé sur la difficulté de factoriser de grands nombres entiers. 
**Sécurité** : Dépend de la taille de la clé (2048 bits minimum, 3072+ recommandés).
**Limites** : Clés volumineuses, performances lentes, vulnérable au quantique à long terme.

3️⃣ **Diffie-Hellman — Échange de Clés**
Permet à deux parties de générer un secret commun sans jamais le transmettre. 
**PFS (Perfect Forward Secrecy)** : Avec ECDHE (utilisé dans TLS 1.3), la compromission d'une clé privée n'affecte pas les sessions passées.

4️⃣ **ECC — Elliptic Curve Cryptography**
Basée sur les courbes elliptiques.
**Avantages** : Clés plus petites (ECC 256 ≈ RSA 3072), meilleures performances, idéal pour le mobile/IoT.
**Courbes courantes** : Curve25519, secp256r1.

5️⃣ **Signature Numérique & Asymétrie**
Permet l'authentification forte et la non-répudiation. C'est la base des certificats X.509 et des PKI.

6️⃣ **RSA vs ECC** : RSA est historique et large, ECC est moderne, rapide et économe en ressources.

7️⃣ **Enjeux Post-Quantiques** : L'algorithme de Shor menace RSA et ECC. La transition vers des algorithmes résistants est un enjeu de souveraineté majeure.

🔶 **Lecture Stratégique CRYPTE : La Clé Privée comme Actif Souverain Critique**
Les clés privées protègent les racines PKI et les identités nationales. Si une clé racine est compromise, la confiance s'effondre. L'asymétrie est l'architecture de la confiance institutionnelle.

📌 **Résumé Exécutif**
La cryptographie asymétrique repose sur des paires de clés. RSA est historique, ECC est plus efficace. Diffie-Hellman permet l'échange de clés securisé. C'est le fondement des PKI et de la souveraineté numérique.`;

    const lesson1_5Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 1 — Fondements de la Cryptographie Moderne
Leçon 5 : Fonctions de Hachage & Signatures Numériques (SHA-2, SHA-3, EdDSA)

🎯 **Objectif Stratégique**
Maîtriser :
- Le rôle fondamental des fonctions de hachage
- Leur intégration dans les signatures numériques
- Les standards actuels (SHA-2, SHA-3, EdDSA)
- Les implications stratégiques pour les PKI et la souveraineté

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer les propriétés de sécurité d’une fonction de hachage
- Différencier collision, préimage et seconde préimage
- Décrire le fonctionnement d’une signature numérique moderne
- Identifier les algorithmes recommandés aujourd’hui

1️⃣ **Fonction de Hachage Cryptographique**
Une fonction de hachage transforme une donnée de taille arbitraire en une empreinte de taille fixe.
🔐 **Propriétés de Sécurité** :
- **Résistance à la préimage** : Impossible de retrouver le message à partir du hash.
- **Résistance à la seconde préimage** : Impossible de trouver un second message avec le même hash qu’un message donné.
- **Résistance aux collisions** : Impossible de trouver deux messages distincts produisant le même hash.

2️⃣ **SHA-2 — Standard Actuel Dominant**
Famille définie par le NIST (SHA-256, SHA-384, SHA-512). Utilisé dans TLS, les certificats X.509 et la blockchain. SHA-1 est officiellement abandonné car vulnérable aux collisions.

3️⃣ **SHA-3 — Alternative Structurelle**
Standard NIST basé sur la construction Keccak (sponge construction). Alternative stratégique en cas de faille de SHA-2, offrant une architecture de résilience différente.

4️⃣ **Rôle du Hachage dans la Signature Numérique**
On ne signe pas le message entier mais son hash. Cela garantit rapidité, sécurité et standardisation du processus de signature.

5️⃣ **EdDSA — Signature Moderne Basée sur ECC**
Exemple : Ed25519. Rapide, clés compactes, résistant aux erreurs d’implémentation et aux attaques par canal auxiliaire. Adopté dans SSH moderne et TLS.

6️⃣ **Comparaison des Algorithmes** :
- **RSA** : Héritage large, plus lent.
- **ECDSA** : Très répandu, basé sur ECC.
- **EdDSA** : Adoption croissante, haute performance et sécurité renforcée.

7️⃣ **Vulnérabilités Historiques** : Collisions SHA-1, mauvaise génération d'aléa (clés privées compromises sur ECDSA), erreurs d'implémentation.

8️⃣ **Interaction avec PKI** : La CA signe les certificats. Le hash garantit l’intégrité, et la signature garantit l’authenticité. Si le hash est compromis, toute la chaîne de confiance s’effondre.

🔶 **Lecture Stratégique CRYPTE : L’Intégrité comme Fondement Institutionnel**
L’intégrité protège les registres d’identité et les transactions financières. La signature protège les décrets numériques et l’authentification gouvernementale. Si l’intégrité est compromise, la confiance institutionnelle s’effondre.

📌 **Résumé Exécutif**
Une fonction de hachage garantit l’intégrité. SHA-2 est le standard, SHA-3 l’alternative structurelle. Les signatures numériques (EdDSA) reposent sur le hachage. La robustesse du hash conditionne la confiance nationale.`;

    const lesson1_6Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 1 — Fondements de la Cryptographie Moderne
Leçon 6 : Gestion des Clés & Entropie — Key Management Lifecycle

🎯 **Objectif Stratégique**
Maîtriser la gouvernance opérationnelle des secrets cryptographiques.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Décrire le cycle de vie complet d’une clé cryptographique
- Comprendre le rôle critique de l’entropie
- Identifier les risques liés à une mauvaise gestion
- Structurer une politique de gestion des clés conforme aux standards internationaux
- Relier la gestion des clés à la souveraineté numérique

1️⃣ **Principe Fondamental**
Un algorithme fort avec une clé mal gérée = sécurité nulle. Les incidents cryptographiques proviennent presque toujours d’une génération faible, d’un stockage inadéquat ou d’une rotation inexistante.

2️⃣ **Cycle de Vie d’une Clé (Key Lifecycle)**
La gestion suit un cycle structuré (NIST SP 800-57) : Génération -> Enregistrement -> Distribution -> Stockage -> Utilisation -> Rotation -> Archivage -> Révocation -> Destruction.

3️⃣ **Génération & Entropie**
L'**entropie** est la source de l’imprévisibilité. Si elle est faible, la clé peut être prédite.
🔐 **Sources fiables** : RNG matériel (TRNG), modules HSM certifiés, sources physiques.
⚠️ **Risques** : Clés prédictibles dues à des PRNG défectueux (cas historiques).

4️⃣ **Classification des Clés**
Hiérarchie de criticité : Clé racine PKI > Clé intermédiaire > Clé serveur > Clé utilisateur > Clé de session. Les exigences de protection augmentent avec la hiérarchie.

5️⃣ **Stockage Sécurisé**
- **À éviter** : Clés en clair, dans le code source, partage informel.
- **Standards** : HSM (Hardware Security Module), TPM, coffres-forts de secrets (Vault), FIPS 140-3.

6️⃣ **Rotation & Durée de Vie**
Principe : Limiter l’impact d’une compromission par une rotation périodique et l'usage de clés éphémères (ECDHE).

7️⃣ **Révocation & Réponse à Incident**
Une clé compromise doit être révoquée immédiatement (CRL, OCSP). La révocation est une capacité stratégique de contrôle de la confiance.

8️⃣ **Séparation des Rôles & Gouvernance**
Principes : Moindre privilège, double contrôle pour clés critiques, journalisation et audit régulier. Une gouvernance mature nécessite une politique écrite et des tests de continuité.

🔶 **Lecture Stratégique CRYPTE : La Clé comme Actif Souverain**
Dans une nation numérique, les clés protègent l'identité nationale et les infrastructures stratégiques. Si une clé racine nationale est compromise, toute la chaîne de confiance s’effondre. La souveraineté dépend du contrôle total des secrets. Un pays qui externalise la gestion de ses clés externalise sa souveraineté.

📌 **Résumé Exécutif**
La gestion des clés est le cœur réel de la sécurité cryptographique. L’entropie conditionne l’imprévisibilité. HSM et séparation des rôles sont essentiels. La rotation limite l’impact d’une compromission. Une clé racine compromise équivaut à une perte de souveraineté.`;

    const lesson1_7Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 1 — Fondements de la Cryptographie Moderne
Leçon 7 : Menaces Post-Quantiques & Migration Cryptographique

🎯 **Objectif Stratégique**
Comprendre :
- Pourquoi l’informatique quantique menace la cryptographie actuelle
- Quels algorithmes sont vulnérables
- Les solutions post-quantiques émergentes
- Les stratégies de migration pour les États et organisations

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer l’impact de l’algorithme de Shor
- Identifier les primitives vulnérables
- Comprendre les familles d’algorithmes post-quantiques
- Structurer une stratégie de transition cryptographique

1️⃣ **Le Changement de Paradigme Quantique**
L’informatique quantique exploite la superposition et l’intrication pour des calculs massivement parallèles.
🔹 **Algorithme de Shor** : Menace RSA, Diffie-Hellman et ECC (polynomial).
🔹 **Algorithme de Grover** : Réduction quadratique de la sécurité symétrique (AES-128 devient équivalent à ~64 bits). Solution : utiliser AES-256.

2️⃣ **Primitives Vulnérables**
RSA, ECDSA, ECDH et Diffie-Hellman sont fortement menacées. AES et SHA-2/3 restent viables avec des clés/longueurs accrues.

3️⃣ **Harvest Now, Decrypt Later**
Menace immédiate : Intercepter et stocker des données chiffrées aujourd'hui pour les déchiffrer dans 10-20 ans. Les données sensibles longue durée (secrets d'État, archives) sont déjà en danger.

4️⃣ **Cryptographie Post-Quantique (PQC)**
Standardisation NIST : CRYSTALS-Kyber (échange de clés), CRYSTALS-Dilithium (signature), Falcon, SPHINCS+. 
Familles : Réseaux (lattices), codes correcteurs, fonctions de hachage, isogénies.

5️⃣ **Défis de Migration**
Clés plus grandes, performance, compatibilité. La transition prendra 10 à 20 ans pour les systèmes critiques.

6️⃣ **Stratégie : Crypto-agilité & Hybridation**
La crypto-agilité permet de remplacer les algorithmes rapidement. L'hybridation (combiner PQC + classique comme Kyber + ECDHE) garantit la sécurité même si l'un des mécanismes échoue.

7️⃣ **Implications pour les PKI**
Nécessité de nouveaux certificats, racines et formats X.509. Toute l'infrastructure mondiale de confiance est impactée.

🔶 **Lecture Stratégique CRYPTE : La Souveraineté à l’Ère Quantique**
L’informatique quantique est un multiplicateur de puissance. Un État qui anticipe la transition et maîtrise ses standards conserve sa souveraineté, tandis qu'un État qui la subit fragilise ses infrastructures et dépend de fournisseurs étrangers. Le post-quantique est une transition civilisationnelle.

📌 **Résumé Exécutif**
L’informatique quantique menace RSA et ECC. AES reste viable avec des clés longues. La menace "Harvest Now, Decrypt Later" est réelle. Le NIST standardise la PQC. La crypto-agilité et l'hybridation sont les piliers de la transition souveraine.`;

    const lesson2_1Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 2 — Cryptographie Appliquée aux Réseaux & Systèmes
Leçon 1 : TLS & Sécurisation des Communications

🎯 **Objectif Stratégique**
Comprendre comment Internet est sécurisé par le protocole TLS, de la négociation à l'échange de données.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer le fonctionnement du handshake TLS (1.2 et 1.3)
- Identifier le rôle des certificats X.509
- Comprendre le concept de Perfect Forward Secrecy (PFS)
- Choisir des suites cryptographiques (Cipher Suites) sécurisées
- Anticiper l'évolution vers le TLS hybride post-quantique

1️⃣ **TLS 1.2 vs TLS 1.3 : La Révolution de la Rapidité**
TLS 1.3 a supprimé les algorithmes obsolètes et réduit la latence.
- **TLS 1.2** : Handshake en 2 aller-retours (2-RTT). Beaucoup d'algorithmes optionnels et risqués.
- **TLS 1.3** : Handshake en 1 aller-retour (1-RTT). Sécurité renforcée par défaut (PFS obligatoire).

2️⃣ **Le Handshake TLS 1.3 détaillé (1-RTT)**
1. **Client Hello** : Liste des suites supportées + partage de clé éphémère.
2. **Server Hello** : Choix de la suite + partage de sa clé éphémère + Certificat signé.
3. **Key Exchange** : Les deux calculent le secret commun (ECDHE).
4. **Encrypted Data** : La communication chiffrée commence.

3️⃣ **Perfect Forward Secrecy (PFS)**
Si la clé privée du serveur est volée dans le futur, elle ne permet pas de déchiffrer les sessions passées. C'est possible grâce à l'utilisation de clés de session éphémères jetables après chaque usage.

4️⃣ **Certificats X.509 & Chaîne de Confiance**
Le certificat lie une identité à une clé publique. Il est signé par une Autorité de Certification (CA). Sans CA de confiance, le TLS ne protège que contre l'espionnage, pas contre l'usurpation d'identité (MITM).

5️⃣ **Cipher Suites & Sécurité**
Une suite définit : Key Exchange, Signature, Chiffrement, et Hash (ex: TLS_AES_256_GCM_SHA384). 
⚠️ **À bannir** : RC4, DES, MD5, export suites.

6️⃣ **Attaques Historiques**
- **POODLE/BEAST** : Exploitaient des faiblesses dans SSLv3/TLS 1.0.
- **Heartbleed** : Faille d'implémentation (OpenSSL) permettant de lire la mémoire du serveur.

7️⃣ **Vision Souveraine : TLS Hybride Post-Quantique**
Transition vers des protocoles utilisant PQC (ex: Kyber) combinés aux méthodes classiques pour garantir la confidentialité à long terme contre les futures menaces quantiques.

🔶 **Lecture Stratégique CRYPTE : Le TLS comme rempart de la communication nationale**
TLS n'est pas qu'un "cadenas dans le navigateur". C'est le protocole qui sécurise les flux inter-administratifs, les accès citoyens et la souveraineté des données en transit. Un pays qui ne maîtrise pas ses points de terminaison TLS et la gestion de ses certificats laisse ses communications à la merci d'interceptions extérieures.

📌 **Résumé Exécutif**
TLS sécurise le web. TLS 1.3 est le standard moderne (plus sûr, plus rapide). Le PFS est essentiel pour la protection à long terme. La maîtrise des certificats est le pivot de la confiance souveraine.`;

    const lesson2_2Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 2 — Cryptographie Appliquée aux Réseaux & Systèmes
Leçon 2.2 : IPSec & VPN Sécurisés — AH, ESP, IKEv2 & Architectures Gouvernementales

🎯 **Objectif Stratégique**
Comprendre comment sécuriser des réseaux inter-sites, des infrastructures critiques et des communications inter-ministérielles.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Expliquer l’architecture IPSec
- Différencier AH et ESP
- Comprendre IKEv2
- Concevoir un VPN robuste
- Relier IPSec à la souveraineté réseau

1️⃣ **Positionnement d’IPSec**
IPSec opère au Niveau 3 (IP) du modèle OSI. Contrairement à TLS, il est transparent pour les applications et protège tout le trafic IP, ce qui le rend idéal pour les tunnels site-à-site.

2️⃣ **Les Deux Protocoles IPSec**
🔹 **AH (Authentication Header)** : Assure l'intégrité et l'authentification mais ne chiffre pas le contenu. Usage rare aujourd'hui.
🔹 **ESP (Encapsulating Security Payload)** : Assure la confidentialité (AES), l'intégrité et l'authentification. Standard dominant (RFC 4303).

3️⃣ **Modes IPSec**
🔹 **Mode Transport** : Protège uniquement le payload IP. Communication hôte à hôte.
🔹 **Mode Tunnel** : Encapsule le paquet IP complet dans un nouveau paquet. VPN site-à-site (architecture gouvernementale classique).

4️⃣ **IKEv2 — Internet Key Exchange**
Assure l'échange sécurisé de clés (Diffie-Hellman), l'authentification mutuelle et la création des Security Associations (SA). Supporte ECDHE et les certificats X.509 avec PFS.

5️⃣ **Security Associations (SA)**
Définit les algorithmes de chiffrement, d'intégrité, les clés et leur durée de vie pour chaque tunnel.

6️⃣ **IPSec vs TLS**
IPSec agit au niveau infrastructure (Couche 3), tandis que TLS agit au niveau applicatif (Couche 4-7). Ils sont complémentaires dans une architecture de défense en profondeur.

7️⃣ **VPN Gouvernementaux**
Utilisés pour les liaisons inter-ministérielles et diplomatiques. Exigences : AES-256, SHA-2, ECDHE, HSM pour les clés privées et double authentification.

8️⃣ **Attaques & Risques**
Algorithmes faibles, DH de groupe insuffisant, PFS désactivé, ou compromission de clé privée. Une mauvaise configuration NAT Traversal peut aussi exposer le tunnel.

9️⃣ **IPSec & Post-Quantique**
IKEv2 doit évoluer pour intégrer des échanges hybrides et des algorithmes post-quantiques (nouveaux groupes DH).

🔶 **Lecture Stratégique CRYPTE : Le Tunnel comme Frontière Numérique**
Dans le monde numérique, les tunnels IPSec sont des frontières cryptographiques. Un tunnel compromis expose des données stratégiques et fragilise la souveraineté nationale. La maîtrise des clés, des équipements et des standards est le fondement de la souveraineté réseau.

📌 **Résumé Exécutif**
IPSec protège le trafic IP au niveau infrastructure. ESP est le protocole dominant. IKEv2 assure la négociation sécurisée. Le mode tunnel est le pilier des VPN gouvernementaux et de la souveraineté réseau.`;

    const lesson2_3Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 2 — Cryptographie Appliquée aux Réseaux & Systèmes
Leçon 2.3 : Chiffrement des Données au Repos — Full Disk, Bases de Données & Cloud

🎯 **Objectif Stratégique**
Protéger les données en cas de vol physique, d’accès administrateur malveillant, de compromission serveur ou de fuite cloud.

À l’issue de cette leçon, l’apprenant devra :
- Différencier les types de chiffrement au repos
- Comprendre l’architecture Envelope Encryption
- Concevoir une stratégie de clés robuste
- Intégrer une vision souveraine du stockage

1️⃣ **Full Disk Encryption (FDE)**
Le chiffrement complet du disque (ex: AES-256-XTS) protège contre le vol physique. Une clé maître, déverrouillée via mot de passe ou TPM, assure un déchiffrement transparent. *Limite* : Ne protège pas contre un administrateur malveillant sur un système déjà démarré.

2️⃣ **Chiffrement Base de Données**
- **Transparent Data Encryption (TDE)** : Chiffrement au niveau fichiers DB. Simple mais le DBA peut parfois accéder aux données.
- **Field-Level Encryption** : Chiffrement au niveau applicatif des données sensibles (biométrie, identifiants). Protection même si la DB est compromise.

3️⃣ **Envelope Encryption**
Architecture moderne où la donnée est chiffrée avec une DEK (Data Encryption Key), elle-même chiffrée par une KEK (Key Encryption Key) stockée dans un HSM ou KMS. Cela permet une rotation rapide et réduit l'exposition de la clé maître.

4️⃣ **Chiffrement Cloud**
- **SSE (Server-Side Encryption)** : Le fournisseur gère tout (risque de dépendance).
- **BYOK (Bring Your Own Key)** : L'organisation génère sa clé (contrôle partiel).
- **HYOK (Hold Your Own Key)** : La clé reste hors cloud. Architecture souveraine idéale.

5️⃣ **Gestion des Clés au Repos**
Repose sur des HSM, KMS, une rotation périodique et une séparation stricte des rôles. Sans gouvernance, le chiffrement n'est qu'une illusion.

6️⃣ **Attaques & Risques**
La majorité des fuites provient d'une mauvaise gestion des clés (clefs dans le code, snapshots exposés) plutôt que de faiblesses algorithmiques.

🔶 **Lecture Stratégique CRYPTE : Le Stockage comme Trésor National**
Une nation qui confie ses clés ou ses sauvegardes à une juridiction étrangère renonce à sa souveraineté numérique. Le chiffrement au repos est un rempart stratégique pour protéger les registres citoyens et les secrets d'État.

📌 **Résumé Exécutif**
FDE protège contre le vol physique, tandis que le Field-level encryption protège les données critiques en base. L'Envelope Encryption est le standard moderne. Le cloud nécessite une stratégie HYOK pour garantir la souveraineté.`;

    const lesson2_4Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 2 — Cryptographie Appliquée aux Réseaux & Systèmes
Leçon 2.4 : Secure Boot & Chaîne de Confiance — Root of Trust, TPM & Firmware Signé

🎯 **Objectif Stratégique**
Garantir l’intégrité du système dès le premier cycle d’horloge du processeur et prévenir les attaques de bas niveau.

À l’issue de cette leçon, l’apprenant devra :
- Comprendre le concept de Root of Trust (RoT)
- Expliquer le fonctionnement de l’UEFI Secure Boot
- Identifier le rôle du TPM (Trusted Platform Module)
- Décrire la chaîne de confiance matérielle
- Relier la sécurité firmware à la résilience nationale

1️⃣ **Root of Trust (RoT)**
Le socle inaltérable de la confiance. C'est le premier composant qui s'exécute et il doit être considéré comme fiable par défaut. Sans RoT matériel (ancre de confiance), toute la pile logicielle est vulnérable.

2️⃣ **UEFI Secure Boot**
Mécanisme de vérification de signature. Le firmware UEFI vérifie le bootloader, qui vérifie le noyau, qui vérifie les pilotes.
- **Clés** : PK (Platform Key), KEK (Key Exchange Key), db (Autorisé), dbx (Révoqué).
- **Protection** : Bloque les Bootkits et les chargeurs de démarrage non autorisés.

3️⃣ **TPM (Trusted Platform Module)**
Puce sécurisée dédiée.
- **PCR (Platform Configuration Registers)** : Mesure l'état du système (hachage des composants).
- **Sealing** : Chiffrer des données (comme des clés BitLocker) de telle sorte qu'elles ne soient déverrouillées que si l'état du système est intègre.
- **Attestation** : Preuve cryptographique de l'état du matériel.

4️⃣ **Chaîne de Confiance (Chain of Trust)**
Processus où chaque maillon de la chaîne (Hardware -> UEFI -> OS) valide le suivant avant de lui transférer le contrôle. Une rupture dans la chaîne doit stopper le démarrage ou alerter l'utilisateur.

5️⃣ **Firmware Signé & Microcode**
Assure que le code exécuté au niveau processeur et carte mère n'a pas été altéré. La compromission du firmware permet une persistance totale et invisible pour l'OS.

6️⃣ **Vision Souveraine : Maîtrise des Clés db/KEK**
Pour une souveraineté réelle, un État doit pouvoir gérer ses propres clés UEFI et ne pas dépendre uniquement des certificats des constructeurs de matériel étranger.

📌 **Résumé Exécutif**
Secure Boot garantit l'intégrité du démarrage via des signatures numériques. Le TPM est l'ancre matérielle de confiance. La chaîne de confiance assure l'intégrité du matériel jusqu'à l'application. La maîtrise du firmware est le socle de la défense en profondeur.`;

    const lesson2_5Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 2 — Cryptographie Appliquée aux Réseaux & Systèmes
Leçon 2.5 : Chiffrement des Bases de Données — TDE, Cell-Level & Always Encrypted

🎯 **Objectif Stratégique**
Protéger les registres nationaux et les données critiques même en cas de compromission du serveur, d'administrateur malveillant ou d'exfiltration de dump SQL.

À l’issue de cette leçon, l’apprenant devra :
- Comprendre les spécificités du chiffrement en base de données
- Différencier TDE, Cell-Level et Always Encrypted
- Identifier les compromis performance/sécurité
- Maîtriser la séparation des rôles DBA/Sécurité

1️⃣ **TDE — Transparent Data Encryption**
Chiffrement automatique des fichiers de données, journaux et sauvegardes. Transparent pour l'application. *Limite* : Protège le stockage physique mais n'empêche pas un DBA de lire les données via des requêtes directes.

2️⃣ **Chiffrement Cell-Level (Column-Level)**
Chiffrement appliqué à des colonnes spécifiques (IBAN, biométrie). Les données restent chiffrées même si la base est dumpée. *Contrainte* : Complexité applicative et indexation plus difficile.

3️⃣ **Always Encrypted**
Concept où les données sont chiffrées côté client et ne sont jamais visibles en clair côté serveur. Le DBA ne voit que du ciphertext. *Avantage* : Protection ultime contre les administrateurs malveillants.

4️⃣ **Gestion des Clés DB**
Nécessité de séparer les clés DEK/KEK, d'utiliser des HSM souverains et d'activer une journalisation d'accès stricte. Sans gouvernance, le chiffrement n'est qu'une illusion.

5️⃣ **Attaques & Risques**
Injections SQL, exfiltration de dumps non chiffrés ou clés stockées dans des scripts. Le chiffrement DB complète mais ne remplace pas la sécurité applicative.

🔶 **Lecture Stratégique CRYPTE : La Base de Données comme Cœur Souverain**
La souveraineté d'une nation moderne dépend de l'intégrité de ses bases de données (registres, fiscalité). La protection doit être granulaire et indépendante des fournisseurs d'infrastructure pour garantir la pérennité du patrimoine informationnel national.

📌 **Résumé Exécutif**
TDE protège les fichiers physiques, le Column-Level protège les champs sensibles et l'Always Encrypted protège contre le DBA. La gestion souveraine des clés est le pivot de la confiance dans les systèmes d'information critiques.`;

    const lesson2_6Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 2 — Cryptographie Appliquée aux Réseaux & Systèmes
Leçon 2.6 : PKI Avancée & Autorités de Certification — Hiérarchies, OCSP, CRL & Root Sovereign CA

🎯 **Objectif Stratégique**
Bâtir et gouverner une infrastructure de confiance nationale capable de garantir l'identité numérique et la sécurité des flux à l'échelle de l'État.

À l’issue de cette leçon, l’apprenant devra être capable de :
- Concevoir une hiérarchie de certification (Root, Intermédiaire, Entité finale)
- Maîtriser les mécanismes de révocation (CRL vs OCSP)
- Comprendre les politiques de certification (CP/CPS)
- Appréhender les enjeux d'une Root CA Souveraine
- Relier la PKI à la confiance systémique globale

1️⃣ **Principes d'une PKI (Public Key Infrastructure)**
Une PKI est l'ensemble des composants (matériels, logiciels, humains, procédures) permettant de gérer le cycle de vie des certificats numériques. Elle transforme la cryptographie asymétrique en un système de confiance distribuable.

2️⃣ **Hiérarchie de Certification**
- **Root CA (Autorité Racine)** : L'ancre de confiance. Souvent maintenue hors-ligne (Offline) pour une sécurité maximale. Elle signe les CA intermédiaires.
- **Intermediate CA (Autorité Intermédiaire)** : Délègue le pouvoir de signature. Protège la racine en cas de compromission.
- **Issuing CA (Autorité d’Émission)** : Délivre les certificats aux entités finales (utilisateurs, serveurs, machines).

3️⃣ **Le Certificat X.509**
Standard international définissant le format du certificat : Clé publique, Identité (Subject), Émetteur (Issuer), Validité, et Usage de clé.

4️⃣ **Mécanismes de Révocation**
Un certificat doit pouvoir être invalidé avant sa fin de validité théorique.
- **CRL (Certificate Revocation List)** : Liste signée des certificats révoqués. Problème : taille croissante et latence de mise à jour.
- **OCSP (Online Certificate Status Protocol)** : Requête en temps réel pour vérifier le statut d'un certificat. Plus rapide mais pose des questions de confidentialité.

5️⃣ **Gouvernance : CP & CPS**
- **CP (Certificate Policy)** : Ce que la PKI promet de faire (niveau de confiance).
- **CPS (Certification Practice Statement)** : Comment la PKI le fait concrètement (procédures techniques et physiques).

6️⃣ **Root CA Souveraine & Indépendance**
Un État doit posséder sa propre autorité racine pour garantir son autonomie. Dépendre d'autorités racines étrangères expose à des risques de révocation massive ou d'espionnage structurel. La PKI est le levier de la souveraineté numérique régalienne.

📌 **Résumé Exécutif**
La PKI est l'architecture de la confiance. Une hiérarchie robuste protège la racine. La révocation (CRL/OCSP) garantit l'agilité sécuritaire. La souveraineté numérique repose sur la maîtrise nationale de l'Autorité Racine et des politiques de certification associées.`;

    const lesson2_7Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 2 — Cryptographie Appliquée aux Réseaux & Systèmes
Leçon 2.7 : Tokenisation & Chiffrement Applicatif — FPE, Vaults & Zero-Knowledge

🎯 **Objectif Stratégique**
Sécuriser la donnée au plus près de l'usage applicatif pour réduire la surface d'exposition dans les microservices, les API et les environnements partagés.

À l’issue de cette leçon, l’apprenant devra :
- Différencier tokenisation et chiffrement
- Comprendre le Format-Preserving Encryption (FPE)
- Expliquer l’architecture de gestion des secrets (Vault)
- Appréhender les principes Zero-Knowledge
- Concevoir une architecture à exposition minimale

1️⃣ **Pourquoi la sécurité applicative est le nouveau périmètre ?**
La donnée en clair apparaît souvent dans la mémoire, les logs ou les API, même si le stockage est chiffré. La surface d'attaque moderne est applicative.

2️⃣ **Tokenisation**
Remplace une donnée sensible par un identifiant aléatoire (token) sans valeur intrinsèque. L'application ne manipule que le token, tandis que la donnée réelle est isolée dans un coffre-fort (Vault) protégé.

3️⃣ **Format-Preserving Encryption (FPE)**
Chiffrement conservant la longueur et la structure de la donnée (ex: un numéro de carte bancaire reste 16 chiffres). Idéal pour les systèmes legacy ou les bases de données avec contraintes de format strictes. Standards : FF1, FF3.

4️⃣ **Vaults Cryptographiques (Coffres-forts)**
Services dédiés à la gestion des secrets, à la tokenisation et à la distribution dynamique de clés. L'application ne possède jamais la clé maître, elle interroge le Vault via mTLS.

5️⃣ **Architecture Zero-Knowledge**
Principe où le serveur de stockage ne possède jamais la donnée en clair ni la clé de déchiffrement. Le déchiffrement se fait exclusivement côté client (Client-side encryption).

6️⃣ **Exposition Minimale : La Doctrine CRYPTE**
La défense moderne consiste à réduire la surface exposée : moins de données réelles, moins de clés accessibles au code, et segmentation stricte des responsabilités entre le traitement et le secret.

📌 **Résumé Exécutif**
La tokenisation remplace la donnée, le FPE conserve son format et le Vault centralise les secrets. L'architecture Zero-Knowledge élimine la confiance aveugle dans le serveur. La sécurité moderne est granulaire et applicative.`;

    const lesson3_1Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 3 — Infrastructure PKI & Autorités de Certification
Leçon 3.1 : Principes Fondamentaux d’une Public Key Infrastructure (PKI)

🎯 **Objectif Stratégique**
Comprendre comment la PKI structure la confiance numérique nationale en dépassant la simple émission de certificats pour devenir un système de gouvernance institutionnel.

À l’issue de cette leçon, l’apprenant devra :
- Expliquer les briques constitutives d’une PKI (CA, RA, VA, HSM)
- Décrire son modèle de confiance hiérarchique et réglementaire
- Identifier les risques systémiques liés à une PKI fragile
- Relier la PKI aux enjeux de souveraineté numérique nationale

1️⃣ **Définition Stratégique d’une PKI**
Une PKI est un système organisationnel, cryptographique et juridique permettant d’établir, distribuer et révoquer la confiance. Elle combine cryptographie asymétrique, procédures d’identité et gouvernance réglementaire.

2️⃣ **Composants d’une PKI**
- **Autorité de Certification (CA)** : Signe les certificats et garantit la liaison identité/clé.
- **Autorité d’Enregistrement (RA)** : Vérifie l’identité des demandeurs (KYC).
- **Autorité de Validation (VA)** : OCSP responder pour la vérification en temps réel.
- **HSM** : Matériel sécurisé protégeant les clés privées des CA.

3️⃣ **Modèle de Confiance**
- **Hiérarchique** : Root CA -> Intermédiaires -> Entités finales.
- **Réglementaire (CP/CPS)** : Documents définissant les conditions d’émission et les niveaux d’assurance.

4️⃣ **Cas d’Usage Nationaux**
La PKI est une infrastructure critique : identité numérique citoyenne, passeports biométriques, signature électronique qualifiée et sécurisation des communications étatiques.

5️⃣ **Risques Systémiques**
La compromission d'une clé Root ou une politique d'émission laxiste peut effondrer toute la confiance systémique. Une PKI sérieuse doit être auditée (eIDAS, NIST) et résiliente (Root hors-ligne).

🔶 **Lecture Stratégique CRYPTE : La PKI comme Banque Centrale de la Confiance**
Une PKI nationale émet la "monnaie de la confiance". Si la monnaie structure l’économie, la PKI structure le cyberespace national. Sans une gouvernance étatique forte, la confiance numérique devient vulnérable aux influences extérieures.

📌 **Résumé Exécutif**
Une PKI combine infrastructure technique et gouvernance juridique. Elle structure la confiance à l'échelle nationale et exige une protection extrême de ses racines pour garantir la souveraineté numérique.`;

    const lesson3_2Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 3 — Infrastructure PKI & Autorités de Certification
Leçon 3.2 : Architecture d’une Root CA Sécurisée (Offline Root, HSM, M-of-N & Cérémonies de Clés)

🎯 **Objectif Stratégique**
Concevoir une Root CA cryptographiquement inviolable et organisationnellement contrôlée, ancre absolue de la confiance numérique nationale.

À l’issue de cette leçon, l’apprenant devra :
- Maîtriser le concept d’Offline Root (Air-gapped)
- Comprendre l’intégration et le rôle critique du HSM
- Expliquer le principe du partage de secret M-of-N
- Structurer une cérémonie de génération de clé (Key Ceremony)

1️⃣ **Pourquoi la Root CA est-elle un actif stratégique ?**
La Root CA ancre toute la chaîne de confiance. Sa compromission entraîne l'effondrement de tous les certificats dépendants. Ce n'est pas un serveur, c'est une banque centrale de la confiance.

2️⃣ **Architecture Offline Root**
La Root CA n'est jamais connectée au réseau. Elle fonctionne dans un environnement "air-gapped" (salle sécurisée, coffre ignifugé). Elle n'est activée que pour des opérations critiques : signature de CA intermédiaires ou publication de CRL Root.

3️⃣ **HSM (Hardware Security Module)**
La clé privée Root doit être générée et stockée dans un HSM certifié (FIPS 140-2 Level 3). La clé est non-exportable et protégée contre toute extraction physique ou logique.

4️⃣ **Principe M-of-N (Dual Control)**
L'activation de la Root nécessite la présence simultanée de M officiers de sécurité parmi N détenteurs de clés physiques (smart cards). Aucun individu seul ne peut compromettre la racine.

5️⃣ **La Cérémonie de Clés (Key Ceremony)**
Procédure formelle, filmée et auditée, regroupant officiers, auditeurs et témoins. Elle garantit que la génération de la clé s'est déroulée selon les politiques de certification (CP/CPS) sans compromission.

6️⃣ **Perspective Post-Quantique**
L'agilité cryptographique de la Root doit permettre une future migration vers des algorithmes post-quantiques (signatures hybrides) pour maintenir la confiance sur le long terme (15-25 ans).

📌 **Résumé Exécutif**
La Root CA est l'ancre absolue de la confiance. Elle doit être Offline, protégée par HSM et soumise au contrôle M-of-N. La cérémonie de clés transforme un acte technique en un acte souverain et auditable.`;

    const lesson3_3Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 3 — Infrastructure PKI & Autorités de Certification
Leçon 3.3 : Autorités Intermédiaires & Segmentation de Confiance (SubCA, Cross-Certification & PKI Sectorielle)

🎯 **Objectif Stratégique**
Structurer une PKI nationale résiliente et segmentée pour limiter l'impact systémique d'une compromission et adapter la confiance aux besoins spécifiques des secteurs critiques.

À l’issue de cette leçon, l’apprenant devra :
- Expliquer le rôle protecteur des SubCA (Intermediate CA)
- Concevoir une architecture segmentée par domaines (Défense, Santé, Finance)
- Comprendre les principes de la cross-certification et de la Bridge CA
- Appliquer la segmentation comme doctrine de résilience

1️⃣ **Pourquoi segmenter la confiance ?**
Une Root CA ne doit jamais être exposée aux opérations quotidiennes. La segmentation par SubCA protège la racine, limite l'impact en cas d'incident et permet une séparation claire des responsabilités métier.

2️⃣ **Architecture Hiérarchique Sectorielle**
Chaque secteur critique (Défense, Industrie, Identité Citoyenne) dispose de sa propre autorité intermédiaire. Si une SubCA est compromise, le secteur peut être révoqué et reconstruit sans impacter le reste de la nation numérique.

3️⃣ **Cross-Certification & Bridge CA**
Mécanismes permettant l'interopérabilité entre PKI distinctes (ex: inter-États). La Bridge CA agit comme un pivot de confiance, facilitant la reconnaissance mutuelle tout en maintenant l'isolation hiérarchique nécessaire à la souveraineté.

4️⃣ **Gouvernance par Secteur**
La segmentation permet d'appliquer des politiques de certification (CP/CPS) différenciées : algorithmes plus robustes pour la Défense, cycles de vie plus courts pour la Finance, ou exigences matérielles (HSM) spécifiques.

5️⃣ **Résilience & Migration Post-Quantique**
Une architecture segmentée facilite la migration progressive vers la cryptographie post-quantique en isolant des secteurs pilotes sans perturber l'ensemble des infrastructures critiques nationales.

📌 **Résumé Exécutif**
La segmentation est la doctrine de résilience de la PKI. Les SubCA protègent la Root, la segmentation sectorielle limite le risque systémique, et les mécanismes de bridge permettent une coopération souveraine contrôlée.`;

    const lesson3_4Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 3 — Infrastructure PKI & Autorités de Certification
Leçon 3.4 : Politiques de Certification & Gouvernance (CP, CPS, Audits & Conformité)

🎯 **Objectif Stratégique**
Transformer l'architecture PKI en un système de confiance institutionnel légalement opposable, auditable et conforme aux standards internationaux.

À l'issue de cette leçon, l'apprenant devra :
- Distinguer Certificate Policy (CP) et Certification Practice Statement (CPS)
- Comprendre les niveaux d'assurance (LoA)
- Identifier les standards d'audit (WebTrust, ETSI)
- Relier la gouvernance PKI à la conformité eIDAS et NIST

1️⃣ **Certificate Policy (CP)**
Document stratégique définissant les niveaux de confiance accordés aux certificats et les conditions d'usage. La CP est publiée pour les relying parties (entités qui font confiance aux certificats émis).

2️⃣ **Certification Practice Statement (CPS)**
Document opérationnel décrivant précisément comment la CA met en œuvre ses politiques. C'est le "manuel de procédures" opposable, couvrant la sécurité physique, HSM, contrôle d'accès et contrôle M-of-N.

3️⃣ **Niveaux d'Assurance (LoA)**
Grille de confiance définissant la rigueur de vérification d'identité : LoA 1 (auto-déclaratif) → LoA 4 (présence physique, vérification biométrique). Plus le LoA est élevé, plus les usages critiques sont autorisés.

4️⃣ **Standards d'Audit & Conformité**
- **WebTrust for CA** : Référentiel d'audit mondialement reconnu pour les CA publiques.
- **ETSI EN 319 401** : Standard européen pour les prestataires de services de confiance.
- **eIDAS** : Règlement UE établissant un cadre juridique pour la signature électronique qualifiée.
- **NIST SP 800-32** : Guide américain de gouvernance PKI.

5️⃣ **Politique de Révocation & Incidents**
Toute PKI gouvernée doit documenter les délais de révocation, les procédures d'urgence et les obligations de notification. La PKI doit publier un état de conformité permanent (CRL valide, OCSP disponible).

📌 **Résumé Exécutif**
La gouvernance PKI est l'alliance de la technique et du droit. Sans CP/CPS formalisés et des audits réguliers, la PKI n'est qu'un outil cryptographique sans portée institutionnelle. La conformité eIDAS/NIST transforme la confiance technique en confiance juridique opposable.`;

    const lesson3_5Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 3 — Infrastructure PKI & Autorités de Certification
Leçon 3.5 : Révocation de Certificats — CRL, OCSP & OCSP Stapling

🎯 **Objectif Stratégique**
Garantir que la confiance peut être retirée rapidement et à l'échelle lorsqu'un certificat est compromis, expiré ou n'est plus valide.

À l'issue de cette leçon, l'apprenant devra :
- Comprendre pourquoi la révocation est une capacité stratégique
- Différencier CRL, OCSP et OCSP Stapling
- Identifier les problèmes de scalabilité
- Concevoir une infrastructure de révocation résiliente

1️⃣ **Pourquoi Révoquer ?**
Un certificat peut être invalide avant sa date d'expiration : compromission de clé privée, changement d'identité, violation de politique. Sans révocation opérationnelle, la confiance ne peut pas être retirée efficacement.

2️⃣ **CRL (Certificate Revocation List)**
Liste signée par la CA des numéros de série révoqués. Distribuée par LDAP ou HTTP. *Problème* : taille croissante, latence de mise à jour (jusqu'à 24h), et coût de téléchargement pour les clients.

3️⃣ **OCSP (Online Certificate Status Protocol)**
Requête en temps réel pour vérifier le statut d'un certificat individuel. Plus rapide que la CRL. *Limite* : problème de confidentialité (la CA sait quels sites un utilisateur visite) et disponibilité (single point of failure).

4️⃣ **OCSP Stapling**
Solution moderne : le serveur TLS lui-même récupère périodiquement la réponse OCSP signée et la "staple" (attache) au handshake TLS. Avantages : privé, performant, pas de dépendance client à la CA.

5️⃣ **Révocation d'Urgence à l'Échelle Nationale**
En cas de compromission massive, la capacité de révoquer des milliers de certificats en quelques heures est stratégique. Il faut pré-planifier : automatisation CRL, OCSP haute disponibilité et procédures de notification.

📌 **Résumé Exécutif**
La révocation est le contrepoids de la confiance. CRL fournit une liste complète, OCSP offre une vérification en temps réel et l'OCSP Stapling optimise la performance tout en préservant la vie privée. Une PKI sans révocation robuste ne peut pas gérer les incidents.`;

    const lesson3_6Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 3 — Infrastructure PKI & Autorités de Certification
Leçon 3.6 : HSM — Hardware Security Modules (Architecture, Certifications & Intégration PKI)

🎯 **Objectif Stratégique**
Comprendre l'architecture des HSM comme composant de sécurité critique et incontournable dans toute infrastructure de confiance nationale.

À l'issue de cette leçon, l'apprenant devra :
- Expliquer la différence entre stockage logiciel et HSM
- Comprendre les certifications FIPS et Common Criteria
- Décrire l'intégration HSM dans une PKI
- Identifier les cas d'usage souverains critiques

1️⃣ **Qu'est-ce qu'un HSM ?**
Module matériel dédié à la génération, au stockage et à l'utilisation de clés cryptographiques. La clé réside dans un environnement tamper-proof et n'en sort jamais. C'est le "coffre-fort de la cryptographie".

2️⃣ **HSM vs Stockage Logiciel**
Une clé dans un fichier est copiable, exfiltrable et non auditée. Un HSM génère la clé en interne et la rend inextractable. Toute opération cryptographique est effectuée à l'intérieur du module.

3️⃣ **Certifications Critiques**
- **FIPS 140-2 Level 3** : Standard US minimum pour une PKI sérieuse. Anti-tampering physique, détection d'intrusion.
- **FIPS 140-2 Level 4** : Enveloppe cryptographique protégeant contre les attaques environnementales.
- **Common Criteria** : Standard international pour évaluation de sécurité des produits.

4️⃣ **Intégration dans la PKI**
Le HSM protège les clés Root et Intermédiaires. Il assure les signatures de certificats et de CRL. Il journalise chaque usage de clé pour l'audit. Le HSM est contrôlé par le principe M-of-N pour toute opération administrative.

5️⃣ **Vision Souveraine**
Une nation doit éviter les HSM à trappe dérobée ou source fermée. Favoriser les HSM certifiés par des organismes indépendants, et si possible, des solutions dont le firmware peut être audité.

📌 **Résumé Exécutif**
Le HSM est l'ancre matérielle de toute PKI sérieuse. Il garantit que les clés ne quittent jamais un périmètre physique contrôlé, rendant la compromission cryptographique extrêmement difficile. Son intégration est obligatoire pour une infrastructure de confiance nationale.`;

    const lesson3_7Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 3 — Infrastructure PKI & Autorités de Certification
Leçon 3.7 : PKI Souveraine & Maîtrise Nationale des Clés Racines

🎯 **Objectif Stratégique**
Comprendre les enjeux géopolitiques et techniques liés à la maîtrise nationale d'une PKI et à l'indépendance cryptographique de l'État.

À l'issue de cette leçon, l'apprenant devra :
- Identifier les dépendances étrangères dans les PKI actuelles
- Comprendre les risques d'une PKI non souveraine
- Concevoir les piliers d'une PKI nationale indépendante
- Relier la PKI à la stratégie de puissance numérique

1️⃣ **Dépendances Actuelles & Risques**
La plupart des États utilisent des navigateurs dont les trust stores sont contrôlés par des entreprises étrangères (Google, Mozilla, Apple). Une décision unilatérale de ces acteurs peut priver un pays de la reconnaissance internationale de sa PKI nationale.

2️⃣ **Piliers d'une PKI Souveraine**
- **Root CA nationale hors-ligne** : Sous contrôle étatique exclusif.
- **HSM souverains auditables** : Sans firmware propriétaire opaque.
- **Personnel formé localement** : Officiers de confiance certifiés.
- **Standards ouverts** : Utilisation des RFC et standards NIST/ETSI.
- **Plan de continuité** : Procédure de reprise en cas de catastrophe.

3️⃣ **Le Trust Store : Le Vrai Enjeu**
Figurer dans les trust stores des navigateurs est une condition sine qua non de l'interopérabilité. La négociation pour l'inclusion est un acte politique autant que technique. Certains pays ont opté pour des root stores gérés au niveau national.

4️⃣ **PKI Souveraine & Identité Numérique Nationale**
Une PKI nationale bien gouvernée est le socle de : l'identité citoyenne numérique, la signature électronique légale, les passeports biométriques et les communications inter-administrations sécurisées.

5️⃣ **Stratégie Post-Quantique Souveraine**
La transition post-quantique est une opportunité de réinventer une PKI souveraine avec des algorithmes maîtrisés dès la conception, sans dépendances historiques.

📌 **Résumé Exécutif**
La sovereignty d'une PKI n'est pas un niveau technique, c'est un choix politique. Contrôler ses racines, ses HSM, son personnel et ses politiques, c'est contrôler l'architecture de la confiance numérique nationale. La PKI souveraine est l'expression cryptographique de l'indépendance de l'État.`;

    // 6. Injection de la structure
    for (const mData of modulesData) {
        const mod = await prisma.module.create({
            data: {
                title: mData.title,
                order: mData.order,
                courseId: course.id,
                learningObjectives: mData.learningObjectives,
                theoryContent: mData.theoryContent
            }
        });

        console.log(`🏛️ Module ${mData.order} créé : ${mData.title}`);

        for (let j = 0; j < mData.lessons.length; j++) {
            let content = `### ${mData.lessons[j]}\n\n[Injection pédagogique en attente : Phase Alpha]`;

            // Appliquer le contenu réel si disponible
            if (mData.order === 1 && j === 0) content = lesson1_1Content;
            if (mData.order === 1 && j === 1) content = lesson1_2Content;
            if (mData.order === 1 && j === 2) content = lesson1_3Content;
            if (mData.order === 1 && j === 3) content = lesson1_4Content;
            if (mData.order === 1 && j === 4) content = lesson1_5Content;
            if (mData.order === 1 && j === 5) content = lesson1_6Content;
            if (mData.order === 1 && j === 6) content = lesson1_7Content;

            // Module 2
            if (mData.order === 2 && j === 0) content = lesson2_1Content;
            if (mData.order === 2 && j === 1) content = lesson2_2Content;
            if (mData.order === 2 && j === 2) content = lesson2_3Content;
            if (mData.order === 2 && j === 3) content = lesson2_4Content;
            if (mData.order === 2 && j === 4) content = lesson2_5Content;
            if (mData.order === 2 && j === 5) content = lesson2_6Content;
            if (mData.order === 2 && j === 6) content = lesson2_7Content;

            // Module 3
            if (mData.order === 3 && j === 0) content = lesson3_1Content;
            if (mData.order === 3 && j === 1) content = lesson3_2Content;
            if (mData.order === 3 && j === 2) content = lesson3_3Content;
            if (mData.order === 3 && j === 3) content = lesson3_4Content;
            if (mData.order === 3 && j === 4) content = lesson3_5Content;
            if (mData.order === 3 && j === 5) content = lesson3_6Content;
            if (mData.order === 3 && j === 6) content = lesson3_7Content;

            // Module 4
            if (mData.order === 4 && j === 0) content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 4 — Architecture Cryptographique Souveraine
Leçon 4.1 : Souveraineté Cryptographique & Dépendance Fournisseur

🎯 **Objectif Stratégique**
Comprendre les implications géopolitiques de la dépendance à des algorithmes, des implémentations et des fournisseurs étrangers.

À l'issue de cette leçon, l'apprenant devra : identifier les vecteurs de dépendance cryptographique, évaluer les risques liés aux algorithmes étrangers, et concevoir une politique d'indépendance.

1️⃣ **Les Vecteurs de Dépendance**
- Algorithmes dont seul le fournisseur maîtrise l'implémentation.
- HSM à firmware propriétaire non auditable.
- Bibliothèques cryptographiques (OpenSSL) maintenues par des tiers.
- Cloud KMS gérés par des acteurs étrangers.

2️⃣ **Risques Stratégiques**
- Back-doors dans les implémentations (cas Juniper Networks).
- Export control laws limitant l'usage d'algorithmes.
- Abandon unilatéral du support par le prestataire.
- Interdépendance créant des vulnérabilités systémiques cachées.

3️⃣ **L'Exemple des Random Number Generators**
En 2013, le scandale Dual_EC_DRBG a révélé qu'un générateur de nombres aléatoires standardisé par le NIST contenait une trappe dérobée potentielle. Ce cas illustre que la confiance aveugle dans les standards étrangers est un vecteur de risque souverain.

4️⃣ **Chemin vers l'Autonomie**
Audit des dépendances cryptographiques, utilisation de bibliothèques open-source auditables, formation d'experts nationaux et participation aux processus de standardisation internationaux.

📌 **Résumé Exécutif**
La dépendance cryptographique est un risque stratégique souvent invisible. Un État souverain doit maîtriser sa chaîne cryptographique de bout en bout : des algorithmes aux implémentations, en passant par les générateurs de nombres aléatoires et les HSM.`;

            if (mData.order === 4 && j === 1) content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 4 — Architecture Cryptographique Souveraine
Leçon 4.2 : Gestion Nationale des Clés Critiques

🎯 **Objectif Stratégique**
Concevoir la gouvernance des clés cryptographiques à l'échelle nationale, couvrant les infrastructures critiques.

1️⃣ **Hiérarchie Nationale des Clés**
Clés constitutionnelles (Root PKI nationales) → Clés d'infrastructure (énergie, transport) → Clés sectorielles → Clés opérationnelles. Chaque niveau requiert des politiques et des protections distinctes.

2️⃣ **KMS National (Key Management System)**
Infrastructure centralisée (mais distribuée géographiquement) pour gérer le cycle de vie des clés critiques nationales. Doit être sous souveraineté exclusive de l'État.

3️⃣ **Escrow & Backup Souverain**
Les clés critiques doivent faire l'objet d'un escrow sécurisé sous contrôle multi-parties (M-of-N) dans des locaux sécurisés géographiquement distribués sur le territoire national.

4️⃣ **Continuité Opérationnelle**
Les procédures de reprise après sinistre doivent garantir que les clés critiques sont récupérables même après une catastrophe majeure, sans jamais compromettre leur confidentialité.

📌 **Résumé Exécutif**
La gestion nationale des clés critique est une discipline à part entière : organisationnelle, technique et juridique. Elle conditionne la résilience de l'ensemble des systèmes nationaux de confiance.`;

            if (mData.order === 4 && j === 2) content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 4 — Architecture Cryptographique Souveraine
Leçon 4.3 : Protection des Infrastructures Critiques par la Cryptographie

🎯 **Objectif Stratégique**
Appliquer les principes cryptographiques à la protection des secteurs vitaux : énergie, eau, transport, communications, finance.

1️⃣ **OIV & Cryptographie (Opérateurs d'Importance Vitale)**
Les OIV sont soumis à des exigences de sécurité renforcées incluant chiffrement des flux SCADA/ICS, authentification forte des opérateurs, et intégrité des commandes industrielles.

2️⃣ **Protocoles SCADA & Cryptographie**
Les protocoles industriels historiques (Modbus, DNP3) sont non chiffrés. La modernisation impose l'usage de TLS, IPSec et de mécanismes d'authentification adaptés aux contraintes temps-réel des systèmes industriels.

3️⃣ **Chiffrement des Communications Opérationnelles**
Les communications entre centres de contrôle et infrastructure doivent être chiffrées de bout en bout. Les clés doivent être gérées indépendamment des fournisseurs de systèmes.

4️⃣ **Résilience & Isolation Cryptographique**
Segmentation cryptographique des réseaux de contrôle. Authentification mutuelle TLS. Journalisation inaltérable (append-only with HMAC). Plan de réponse à incident avec révocation d'urgence.

📌 **Résumé Exécutif**
La cryptographie est le bouclier des infrastructures critiques. Sans chiffrement des flux industriels, authentification forte et gestion souveraine des clés, les systèmes vitaux restent exposés à des attaques capables de paralyser un État.`;

            if (mData.order === 4 && j === 3) content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 4 — Architecture Cryptographique Souveraine
Leçon 4.4 : Cryptographie & Identité Numérique Nationale

🎯 **Objectif Stratégique**
Concevoir l'architecture cryptographique d'une identité numérique nationale robuste, interopérable et souveraine.

1️⃣ **Composants d'une Identité Numérique**
Certificat X.509 liant identité physique à clé publique, stocké dans un support sécurisé (carte à puce, TPM). Émis par la PKI nationale sous gouvernance étatique.

2️⃣ **Cas d'Usages Nationaux**
e-ID citoyenne, signature électronique qualifiée (valeur légale), accès aux services numériques d'État, vote électronique, passeports biométriques et identité pour les agents publics.

3️⃣ **Niveaux d'Assurance eIDAS**
- **LoA Faible** : Déclaratif, identité non vérifiée.
- **LoA Substantiel** : Vérification distante de l'identité.
- **LoA Élevé** : Présence physique, biométrie + support cryptographique physique. Requis pour les actes régaliens.

4️⃣ **Défis de Souveraineté**
Interopérabilité internationale sans dépendance : l'identité nationale doit être reconnue sans que les données des citoyens transitent par des serveurs étrangers.

📌 **Résumé Exécutif**
L'identité numérique nationale est le prolongement cryptographique de la citoyenneté. Elle repose sur une PKI souveraine, des supports sécurisés certifiés et une gouvernance des niveaux d'assurance alignée sur les standards internationaux.`;

            if (mData.order === 4 && j === 4) content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 4 — Architecture Cryptographique Souveraine
Leçon 4.5 : Stratégie Post-Quantique Souveraine

🎯 **Objectif Stratégique**
Concevoir une feuille de route nationale pour migrer vers la cryptographie post-quantique sans perturber les infrastructures critiques existantes.

1️⃣ **L'Urgence Stratégique**
La menace "Harvest Now, Decrypt Later" est active dès aujourd'hui. Des données classifiées interceptées maintenant seront déchiffrées dans 10-20 ans avec un ordinateur quantique. La migration doit commencer immédiatement sur les données à longue durée de sensibilité.

2️⃣ **Feuille de Route Nationale (4 phases)**
- **Phase 1** : Inventaire des algorithmes vulnérables (RSA, ECDSA) dans tous les systèmes critiques.
- **Phase 2** : Déploiement hybride (PQC + classique) pour les systèmes les plus exposés.
- **Phase 3** : Migration complète des PKI et infrastructures de gestion de clés.
- **Phase 4** : Décommission des primitives obsolètes et audit de conformité.

3️⃣ **Crypto-agilité Nationale**
Architecturer tous les nouveaux systèmes pour permettre le remplacement d'algorithme sans refonte complète. Le choix de l'abstraction est aussi important que le choix de l'algorithme.

4️⃣ **Standards NIST PQC**
CRYSTALS-Kyber (FIPS 203), CRYSTALS-Dilithium (FIPS 204), SPHINCS+ (FIPS 205). Ces standards doivent être adoptés dans toutes les nouvelles PKI nationales.

📌 **Résumé Exécutif**
La migration post-quantique est une opération de souveraineté nationale planifiée sur 10-15 ans. Elle exige une inventaire systématique, un déploiement hybride progressif et une crypto-agilité architecturale dans tous les systèmes d'État.`;

            if (mData.order === 4 && j === 5) content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 4 — Architecture Cryptographique Souveraine
Leçon 4.6 : Audit Cryptographique & Conformité

🎯 **Objectif Stratégique**
Mettre en place un programme d'audit cryptographique systématique garantissant la conformité et la santé des infrastructures de confiance.

1️⃣ **Pourquoi Auditer ?**
La cryptographie se dégrade silencieusement : algorithmes dépréciés, clés non renouvelées, configurations erronées, bibliothèques vulnérables. Un audit révèle ces failles avant qu'elles ne soient exploitées.

2️⃣ **Types d'Audits Cryptographiques**
- **Audit de configuration** : TLS, suites cryptographiques, certificats expirés.
- **Audit de gestion des clés** : Rotation, stockage, accès.
- **Audit de code** : Revue des implémentations cryptographiques custom.
- **Audit de conformité** : Alignement sur NIST, ANSSI, eIDAS, PCI-DSS.

3️⃣ **Outils de Référence**
Testssl.sh, ssllabs.com, OpenSCAP, Lynis pour les audits techniques. Les audits organisationnels suivent la méthodologie EBIOS RM et ISO 27001.

4️⃣ **Plan de Remédiation**
Tout audit doit produire un plan de remédiation priorisé. Les failles critiques (clés exposées, algorithmes cassés) nécessitent une correction immédiate. Les failles moyennes s'intègrent dans la roadmap sécurité.

📌 **Résumé Exécutif**
L'audit cryptographique est le garant de la pérennité de la confiance. Sans programme d'audit régulier et de remédiation, les PKI et infrastructures cryptographiques se dégradent lentement vers une posture de sécurité illusoire.`;

            if (mData.order === 4 && j === 6) content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 4 — Architecture Cryptographique Souveraine
Leçon 4.7 : Résilience des Infrastructures de Confiance

🎯 **Objectif Stratégique**
Garantir la continuité de la confiance numérique nationale face à des incidents majeurs : compromission, catastrophe physique, cyberattaque d'État.

1️⃣ **Scénarios de Défaillance Couvrir**
- Compromission d'une clé Root ou Intermédiaire.
- Destruction physique du datacenter principal.
- Cyberattaque de grande envergure sur la PKI.
- Indisponibilité prolongée de l'OCSP/CRL.

2️⃣ **Architecture Résiliente**
- Root CA hors-ligne dans des sites géographiquement séparés et physiquement sécurisés.
- Infrastructure OCSP redondante (N+2) avec load balancing géographique.
- CRL secours hébergées sur infrastructure indépendante.
- Sauvegardes cryptées des CA intermédiaires dans des conditionements anti-tampering.

3️⃣ **Plan de Réponse à Incident PKI**
Procédures de révocation d'urgence, communication publique, recréation de hiérarchie intermédiaire et notification des Relying Parties. Le plan doit être testé annuellement (exercices de crise PKI).

4️⃣ **Recovery Time Objective (RTO)**
Pour une PKI nationale critique, le RTO doit être défini et testé : combien de temps pour émettre un nouveau certificat Root après compromission ? La réponse conditionne la politique de sauvegarde.

📌 **Résumé Exécutif**
La résilience d'une PKI nationale se conçoit avant la crise. Redondance géographique, plans de révocation d'urgence testés, et procédures de reconstruction garantissent que la confiance numérique nationale peut être restaurée même après un incident majeur.`;

            const lesson5_1Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 5 — Cas Pratiques & Implémentation Réelle
Leçon 5.1 : Déploiement d’une PKI Interne — Architecture & Build

🎯 **Objectif Stratégique**
Concevoir et déployer une architecture de confiance interne robuste et évolutive.

1️⃣ **Choix de l'Architecture**
- **Hiérarchie à 2 niveaux** (Root Offline + Issuing Online) : Le standard recommandé.
- **Hiérarchie à 3 niveaux** : Pour les grandes organisations avec segmentation sectorielle.

2️⃣ **Pré-requis & Installation**
- Serveurs durcis (Hardened OS).
- Installation des services de certificats (ADCS ou solution Open Source type EJBCA).
- Configuration du module de sécurité (HSM).

3️⃣ **Configuration de l'Autorité d'Émission**
- Paramétrage de la période de validité.
- Configuration des points de distribution des listes de révocation (CDP).
- Mise en place de l'accès à l'information de l'autorité (AIA).

📌 **Résumé Exécutif**
Le build d'une PKI interne commence par une architecture à deux niveaux. La sécurité repose sur le durcissement des serveurs et la configuration correcte des extensions X.509 pour la distribution de la confiance.`;

            const lesson5_2Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 5 — Cas Pratiques & Implémentation Réelle
Leçon 5.2 : Mise en Place d’une Root CA Offline

🎯 **Objectif Stratégique**
Maîtriser la création d'une racine de confiance déconnectée, pilier de la sécurité à long terme.

1️⃣ **Installation en Environnement Isolé (Air-Gapped)**
- Matériel dédié sans carte réseau.
- Installation après vérification de l'intégrité des supports.

2️⃣ **Génération de la Clé Root & Certificat Auto-signé**
- Utilisation d'algorithmes robustes (RSA 4096 ou ECC P-384).
- Durée de vie longue (10-20 ans).

3️⃣ **Exportation & Scellage**
- Exportation du certificat public.
- Sauvegarde de la clé privée sur supports cryptés.
- Arrêt physique et scellage du serveur.

📌 **Résumé Exécutif**
Une Root CA offline ne doit jamais toucher un réseau. Sa création est un acte fondateur documenté. Son stockage physique sécurisé est aussi important que sa protection cryptographique.`;

            const lesson5_3Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 5 — Cas Pratiques & Implémentation Réelle
Leçon 5.3 : Intégration PKI avec Active Directory

🎯 **Objectif Stratégique**
Automatiser la distribution et l'usage des certificats dans un environnement Windows Enterprise.

1️⃣ **Auto-enrollment (Auto-inscription)**
Configuration des GPO pour distribuer automatiquement les certificats aux utilisateurs et aux machines sans intervention humaine.

2️⃣ **Modèles de Certificats (Certificate Templates)**
Personnalisation des modèles pour les différents usages : Signature de code, Chiffrement de fichiers (EFS), Authentification Smart Card.

3️⃣ **Publication dans l'Annuaire**
Publication des certificats et des CRL dans les partitions de configuration d'Active Directory pour une visibilité globale.

📌 **Résumé Exécutif**
L'intégration AD permet de passer d'une PKI isolée à un système de confiance opérationnel global. L'auto-enrollment est la clé de la scalabilité en entreprise.`;

            const lesson5_4Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 5 — Cas Pratiques & Implémentation Réelle
Leçon 5.4 : Implémentation TLS Interne

🎯 **Objectif Stratégique**
Sécuriser l'ensemble des flux au sein du réseau d'entreprise.

1️⃣ **Certificats pour les Serveurs Web**
Génération de demandes de signature de certificat (CSR) et émission par la PKI interne.

2️⃣ **Configuration des Suites Cryptographiques**
Sélection des algorithmes de chiffrement et d'échange de clés recommandés (TLS 1.2 minimum, TLS 1.3 conseillé).

3️⃣ **Gestion de la Confiance Client**
Déploiement du certificat de la Root CA dans les magasins de confiance des navigateurs et des systèmes d'exploitation clients.

📌 **Résumé Exécutif**
Le TLS interne élimine les alertes de sécurité et protège contre les écoutes illégitimes sur le réseau local. Il repose sur la distribution préalable de la Root CA comme autorité de confiance.`;

            const lesson5_5Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 5 — Cas Pratiques & Implémentation Réelle
Leçon 5.5 : Gestion des Certificats Machine

🎯 **Objectif Stratégique**
Authentifier chaque équipement physique sur le réseau (NAC, Wi-Fi 802.1X).

1️⃣ **Identité Machine**
Attribution d'un certificat unique par poste de travail et par serveur pour une authentification mutuelle forte.

2️⃣ **Déploiement via SCEP / NDES**
Utilisation de protocoles standards pour l'enrôlement automatique des périphériques réseau et mobiles.

3️⃣ **Cycle de vie & Renouvellement**
Automatisation du renouvellement avant expiration pour éviter toute rupture de service ou déconnexion réseau.

📌 **Résumé Exécutif**
Les certificats machine transforment le réseau en un environnement fermé où seuls les équipements connus et authentifiés peuvent communiquer. C'est le fondement du Zero Trust réseau.`;

            const lesson5_6Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 5 — Cas Pratiques & Implémentation Réelle
Leçon 5.6 : Simulation de Compromission d’une CA

🎯 **Objectif Stratégique**
Se préparer au pire scénario pour garantir la résilience de l'organisation.

1️⃣ **Détection & Analyse**
Comment identifier qu'une clé privée d'autorité a été exfiltrée ou utilisée de manière illégitime.

2️⃣ **Procédure de Révocation de l'Autorité**
Révocation du certificat de la CA compromise par l'autorité supérieure. Publication immédiate de la CRL.

3️⃣ **Impact sur les Certificats Émis**
Pourquoi tous les certificats signés par la CA compromise doivent être considérés comme invalides et remplacés.

📌 **Résumé Exécutif**
La gestion d'une compromission est un exercice de vitesse. La capacité à révoquer et à reconstruire une branche de la PKI est le test ultime de la maturité cryptographique d'une organisation.`;

            const lesson5_7Content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 5 — Cas Pratiques & Implémentation Réelle
Leçon 5.7 : Plan de Réponse à Incident Cryptographique

🎯 **Objectif Stratégique**
Formaliser la réaction face aux crises majeures (algorithme cassé, perte de HSM, vol de secrets).

1️⃣ **Le Manuel de Crise Cryptographique**
Documentation des contacts, des procédures techniques et des plans de communication.

2️⃣ **Rotation d'Urgence des Clés**
Mécanisme pour remplacer massivement et rapidement les clés critiques dans l'ensemble de l'infrastructure.

3️⃣ **Restauration à partir de Sauvegardes**
Procédure de restauration des bases de données de la PKI et ré-initialisation des HSM à partir des partages de secrets.

📌 **Résumé Exécutif**
Un plan de réponse à incident transforme la panique en une suite d'actions ordonnées. La résilience n'est pas l'absence d'incident, mais la qualité de la réponse apportée.`;

            if (mData.order === 4 && j === 6) content = `🔐 Cryptographie Avancée & Infrastructures PKI
Module 4 — Architecture Cryptographique Souveraine
Leçon 4.7 : Résilience des Infrastructures de Confiance

🎯 **Objectif Stratégique**
Garantir la continuité de la confiance numérique nationale face à des incidents majeurs : compromission, catastrophe physique, cyberattaque d'État.

1️⃣ **Scénarios de Défaillance Couvrir**
- Compromission d'une clé Root ou Intermédiaire.
- Destruction physique du datacenter principal.
- Cyberattaque de grande envergure sur la PKI.
- Indisponibilité prolongée de l'OCSP/CRL.

2️⃣ **Architecture Résiliente**
- Root CA hors-ligne dans des sites géographiquement séparés et physiquement sécurisés.
- Infrastructure OCSP redondante (N+2) avec load balancing géographique.
- CRL secours hébergées sur infrastructure indépendante.
- Sauvegardes cryptées des CA intermédiaires dans des conditionements anti-tampering.

3️⃣ **Plan de Réponse à Incident PKI**
Procédures de révocation d'urgence, communication publique, recréation de hiérarchie intermédiaire et notification des Relying Parties. Le plan doit être testé annuellement (exercices de crise PKI).

4️⃣ **Recovery Time Objective (RTO)**
Pour une PKI nationale critique, le RTO doit être défini et testé : combien de temps pour émettre un nouveau certificat Root après compromission ? La réponse conditionne la politique de sauvegarde.

📌 **Résumé Exécutif**
La résilience d'une PKI nationale se conçoit avant la crise. Redondance géographique, plans de révocation d'urgence testés, et procédures de reconstruction garantissent que la confiance numérique nationale peut être restaurée même après un incident majeur.`;

            // Module 5
            if (mData.order === 5 && j === 0) content = lesson5_1Content;
            if (mData.order === 5 && j === 1) content = lesson5_2Content;
            if (mData.order === 5 && j === 2) content = lesson5_3Content;
            if (mData.order === 5 && j === 3) content = lesson5_4Content;
            if (mData.order === 5 && j === 4) content = lesson5_5Content;
            if (mData.order === 5 && j === 5) content = lesson5_6Content;
            if (mData.order === 5 && j === 6) content = lesson5_7Content;

            await prisma.video.create({
                data: {
                    title: mData.lessons[j],
                    order: j + 1,
                    moduleId: mod.id,
                    content: content,
                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
                    type: "TECHNICAL",
                    description: `Leçon ${j + 1} du ${mData.title}.`
                }
            });
        }
        console.log(`   ✅ ${mData.lessons.length} leçons injectées.`);
    }

    console.log("💎 Architecture du cours injectée avec succès.");
}

reconstructCrypto()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
