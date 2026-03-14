"use server";

import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updateProfile(data: { name: string; image?: string }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("UNAUTHORIZED");

    const updated = await db.user.update({
        where: { id: session.user.id },
        data: {
            name: data.name.trim(),
            ...(data.image ? { image: data.image } : {}),
        },
    });

    return { success: true, name: updated.name };
}
