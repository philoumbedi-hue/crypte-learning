import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/signin");

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
        },
    });

    if (!user) redirect("/auth/signin");

    return <ProfileForm user={user} />;
}
