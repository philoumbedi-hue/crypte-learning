"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function submitApplication(data: {
    motivationLetter: string;
    academicBackground: string;
    selectedDisciplineId: string;
}) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { error: "Non autorisé. Veuillez vous connecter." };
        }

        // Check if user already has a pending or accepted application
        const existingApp = await db.application.findFirst({
            where: {
                userId: session.user.id,
                status: {
                    in: ["PENDING", "REVIEWING", "INTERVIEW", "ACCEPTED"]
                }
            }
        });

        if (existingApp) {
            return { error: "Vous avez déjà une candidature en cours ou acceptée." };
        }

        const application = await db.application.create({
            data: {
                userId: session.user.id,
                motivationLetter: data.motivationLetter,
                academicBackground: data.academicBackground,
                selectedDisciplineId: data.selectedDisciplineId,
            }
        });

        return { success: true, application };
    } catch (error) {
        console.error("Erreur lors de la soumission de la candidature :", error);
        return { error: "Erreur serveur lors de la soumission." };
    }
}

export async function updateApplicationStatus(
    id: string,
    status: "PENDING" | "REVIEWING" | "INTERVIEW" | "ACCEPTED" | "REJECTED",
    interviewDate?: Date
) {
    try {
        const session = await getServerSession(authOptions);
        // We allow SUPER_ADMIN or equivalent to manage applications
        if (!session?.user?.id || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN_ACADEMIC" && session.user.role !== "ADMIN")) {
            return { error: "Non autorisé" };
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataToUpdate: any = { status };
        if (interviewDate) {
            dataToUpdate.interviewDate = interviewDate;
        }

        const application = await db.application.update({
            where: { id },
            data: dataToUpdate,
            include: { user: true, discipline: true }
        });

        return { success: true, application };
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        return { error: "Erreur serveur." };
    }
}
