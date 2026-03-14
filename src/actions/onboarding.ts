"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(data: {
    name: string;
    phone?: string;
    nationality?: string;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    await db.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name,
            phone: data.phone,
            nationality: data.nationality,
            onboardingCompleted: true,
        },
    });

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
