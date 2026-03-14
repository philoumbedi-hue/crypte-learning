import db from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Default /courses/[id]/learn page: redirect to the first video
export default async function LearnIndexPage({ params }: { params: { id: string } }) {
    const course = await db.course.findUnique({
        where: { id: params.id },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    videos: { orderBy: { createdAt: "asc" }, take: 1 }
                }
            }
        }
    });

    if (!course) notFound();

    // Find the first video of the first module that has videos
    for (const mod of course.modules) {
        if (mod.videos.length > 0) {
            redirect(`/courses/${params.id}/learn/${mod.videos[0].id}`);
        }
    }

    // No videos available
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-5xl mb-6">📚</div>
            <h2 className="text-2xl font-bold mb-3">Aucune vidéo disponible</h2>
            <p className="text-zinc-500 max-w-sm">
                Ce cours ne contient pas encore de vidéos. Revenez bientôt ou consultez les supports de cours.
            </p>
        </div>
    );
}
