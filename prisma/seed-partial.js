const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("Starting partial import for validation...");

    const disciplineName = "Intelligence Artificielle & Data Science";
    const disciplineDescription = "Exploration approfondie des algorithmes d'apprentissage automatique, de la vision par ordinateur et du traitement du langage naturel pour résoudre des problèmes complexes.";

    const discipline = await prisma.discipline.upsert({
        where: { name: disciplineName },
        update: { description: disciplineDescription },
        create: { name: disciplineName, description: disciplineDescription }
    });

    console.log(`- Discipline created/verified: ${discipline.name}`);

    const courses = [
        {
            name: "Fondamentaux de l'Apprentissage Automatique",
            description: "Introduction aux concepts de base du Machine Learning, de la régression linéaire aux forêts aléatoires."
        },
        {
            name: "Deep Learning et Réseaux de Neurones",
            description: "Conception et entraînement de modèles complexes à l'aide de frameworks comme PyTorch et TensorFlow."
        },
        {
            name: "Traitement du Langage Naturel (NLP)",
            description: "Analyse de texte, traduction automatique et création de chatbots intelligents."
        },
        {
            name: "Vision par Ordinateur",
            description: "Reconnaissance d'objets, segmentation d'images et analyse vidéo par IA."
        }
    ];

    for (const courseData of courses) {
        const existingCourse = await prisma.course.findFirst({
            where: { name: courseData.name, disciplineId: discipline.id }
        });

        if (!existingCourse) {
            await prisma.course.create({
                data: {
                    name: courseData.name,
                    description: courseData.description,
                    disciplineId: discipline.id
                }
            });
            console.log(`  + Cours ajouté: ${courseData.name}`);
        } else {
            console.log(`  ~ Cours déjà existant: ${courseData.name}`);
        }
    }

    console.log("Partial import complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
