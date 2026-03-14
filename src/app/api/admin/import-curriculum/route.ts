import { NextResponse } from "next/server";
import db from "@/lib/db";
import { requireRoleAPI, logActivity, Actions } from "@/lib/rbac";

export async function POST(req: Request) {
    try {
        const auth = await requireRoleAPI("SUPER_ADMIN");
        if (auth instanceof NextResponse) return auth;

        const body = await req.json();
        const { discipline: disciplineName, course: courseData } = body;

        if (!disciplineName || !courseData || !courseData.modules) {
            return new NextResponse("Invalid JSON structure", { status: 400 });
        }

        const generateImageFromTitle = (discipline: string, title: string) => {
            const query = encodeURIComponent(`${discipline} ${title}`);
            return `https://source.unsplash.com/800x600/?${query}`;
        };

        // Use a transaction to ensure atomic insertion
        const result = await db.$transaction(async (tx) => {
            // 1. Upsert Discipline
            const discipline = await tx.discipline.upsert({
                where: { name: disciplineName },
                update: {},
                create: { name: disciplineName },
            });

            // 2. Upsert Course
            const autoImage = courseData.imageUrl || generateImageFromTitle(disciplineName, courseData.title);

            const course = await tx.course.upsert({
                where: {
                    title_disciplineId: {
                        title: courseData.title,
                        disciplineId: discipline.id,
                    },
                },
                update: {
                    description: courseData.description,
                    level: courseData.level || "Licence",
                    imageUrl: autoImage,
                },
                create: {
                    title: courseData.title,
                    description: courseData.description,
                    level: courseData.level || "Licence",
                    imageUrl: autoImage,
                    disciplineId: discipline.id,
                },
            });

            // 3. Create Modules, Videos, and Quizzes
            for (const moduleData of courseData.modules) {
                const mod = await tx.module.create({
                    data: {
                        title: moduleData.title,
                        learningObjectives: moduleData.learningObjectives,
                        theoryContent: moduleData.theoryContent,
                        order: moduleData.order,
                        courseId: course.id,
                    },
                });

                // Create Videos
                if (moduleData.videos && Array.isArray(moduleData.videos)) {
                    for (const videoData of moduleData.videos) {
                        await tx.video.create({
                            data: {
                                title: videoData.title,
                                description: videoData.description,
                                url: videoData.url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
                                duration: videoData.duration,
                                type: videoData.type,
                                isRequired: videoData.isRequired ?? true,
                                order: videoData.order ?? 0,
                                moduleId: mod.id,
                            },
                        });
                    }
                }

                // Create Quizzes
                if (moduleData.quizzes && Array.isArray(moduleData.quizzes)) {
                    for (const quizData of moduleData.quizzes) {
                        const quiz = await tx.quiz.create({
                            data: {
                                title: quizData.title,
                                description: quizData.description,
                                passingScore: quizData.passingScore ?? 70,
                                maxAttempts: quizData.maxAttempts ?? 3,
                                order: quizData.order ?? 0,
                                moduleId: mod.id,
                            },
                        });

                        // Create Questions for the Quiz
                        if (quizData.questions && Array.isArray(quizData.questions)) {
                            for (const qData of quizData.questions) {
                                await tx.question.create({
                                    data: {
                                        text: qData.question,
                                        options: qData.options,
                                        correctAnswer: qData.options[qData.correctAnswer] || qData.options[0], // Map index to string value
                                        quizId: quiz.id,
                                    },
                                });
                            }
                        }
                    }
                }
            }

            return course;
        });

        await logActivity({
            userId: auth.session.user.id,
            action: Actions.CREATE_COURSE,
            entity: "Course",
            entityId: result.id,
            metadata: { importedFrom: "JSON", discipline: disciplineName, courseTitle: courseData.title },
        });

        return NextResponse.json({ success: true, courseId: result.id });
    } catch (error) {
        console.error("[CURRICULUM_IMPORT]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
