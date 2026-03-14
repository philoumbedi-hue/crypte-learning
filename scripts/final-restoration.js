const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Restauration MAJEURE du contenu - CRYPTE ACADEMIA");

    const academicImages = {
        "tech": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
        "science": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800",
        "business": "https://images.unsplash.com/photo-1454165833968-3ac18619bc9a?auto=format&fit=crop&q=80&w=800",
        "general": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
        "legal": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
    };

    const disciplines = await prisma.discipline.findMany();
    console.log(`Traitement de ${disciplines.length} disciplines...`);

    for (const disc of disciplines) {
        let discImage = academicImages.general;
        if (disc.name.toLowerCase().includes("informatique") || disc.name.toLowerCase().includes("intelligence") || disc.name.toLowerCase().includes("cybersécurité")) {
            discImage = academicImages.tech;
        } else if (disc.name.toLowerCase().includes("droit") || disc.name.toLowerCase().includes("politique")) {
            discImage = academicImages.legal;
        } else if (disc.name.toLowerCase().includes("management") || disc.name.toLowerCase().includes("business")) {
            discImage = academicImages.business;
        } else if (disc.name.toLowerCase().includes("santé") || disc.name.toLowerCase().includes("bio")) {
            discImage = academicImages.science;
        }

        // Update Discipline Image
        try {
            await prisma.discipline.update({
                where: { id: disc.id },
                data: { imageUrl: discImage }
            });
            console.log(`✅ Discipline Image: ${disc.name}`);
        } catch (e) {
            console.log(`⚠️ Skip update Image for Discipline (schema not synced yet): ${disc.name}`);
        }

        const courses = await prisma.course.findMany({
            where: { disciplineId: disc.id }
        });

        for (const course of courses) {
            // Update Course Image
            await prisma.course.update({
                where: { id: course.id },
                data: {
                    imageUrl: discImage,
                    description: course.description || `Programme complet sur ${course.name} au sein de la discipline ${disc.name}.`
                }
            });

            // ADD MODULES IF EMPTY
            const existingModules = await prisma.module.count({ where: { courseId: course.id } });
            if (existingModules === 0) {
                const modules = [
                    { title: "Introduction et Fondamentaux", order: 1 },
                    { title: "Approfondissement Théorique", order: 2 },
                    { title: "Applications et Études de Cas", order: 3 }
                ];

                for (const mData of modules) {
                    const mod = await prisma.module.create({
                        data: {
                            title: mData.title,
                            order: mData.order,
                            courseId: course.id,
                            description: `Exploration détaillée de : ${mData.title}`
                        }
                    });

                    // Add a Video to each Module
                    await prisma.video.create({
                        data: {
                            title: `Leçon Magistrale : ${mData.title}`,
                            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                            duration: 900,
                            moduleId: mod.id,
                            order: 1,
                            description: "Vidéo pédagogique associée à ce chapitre."
                        }
                    });
                }
                console.log(`   ✅ Contenu ajouté pour : ${course.name}`);
            } else {
                console.log(`   ℹ️ Contenu déjà présent pour : ${course.name}`);
            }
        }
    }

    console.log("✨ Restauration et Harmonisation terminées !");
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
