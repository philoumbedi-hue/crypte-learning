const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Restauration des données CRYPTE ACADEMIA...");

    // 1. Nettoyage partiel (Optionnel: pour repartir sur de bonnes bases pour les cours tests)
    // await prisma.video.deleteMany({});
    // await prisma.module.deleteMany({});

    const categories = [
        {
            name: "Intelligence Artificielle & Data Science",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
            courses: [
                { name: "Deep Learning et Réseaux de Neurones", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800" },
                { name: "Python pour l'Analyse de Données", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800" }
            ]
        },
        {
            name: "Cybersécurité & Réseaux",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
            courses: [
                { name: "Fondamentaux de la Sécurité Informatique", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800" },
                { name: "Cryptographie Appliquée", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800" }
            ]
        }
    ];

    for (const cat of categories) {
        const discipline = await prisma.discipline.upsert({
            where: { name: cat.name },
            update: { imageUrl: cat.image },
            create: { name: cat.name, imageUrl: cat.image }
        });
        console.log(`✅ Discipline: ${cat.name}`);

        for (const courseData of cat.courses) {
            const course = await prisma.course.upsert({
                where: { id: (await prisma.course.findFirst({ where: { name: courseData.name } }))?.id || "temp-id" },
                update: { imageUrl: courseData.image },
                create: {
                    name: courseData.name,
                    imageUrl: courseData.image,
                    disciplineId: discipline.id,
                    level: "Licence"
                }
            });
            console.log(`   ✅ Course: ${course.name}`);

            // RESTORE MODULES
            const moduleTitles = ["Introduction et Fondamentaux", "Concepts Avancés", "Projet Pratique"];
            for (let i = 0; i < moduleTitles.length; i++) {
                const mod = await prisma.module.create({
                    data: {
                        title: moduleTitles[i],
                        order: i + 1,
                        courseId: course.id,
                        description: "Apprentissage structuré du module."
                    }
                });

                await prisma.video.create({
                    data: {
                        title: `Cours Vidéo - ${moduleTitles[i]}`,
                        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Rick Roll template but functional
                        duration: 600,
                        moduleId: mod.id,
                        order: 1
                    }
                });
            }
        }
    }

    console.log("✨ Restauration terminée avec succès !");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
