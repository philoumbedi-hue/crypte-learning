import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Token manquant" }, { status: 400 });
        }

        const existingToken = await db.verificationToken.findUnique({
            where: { token }
        });

        if (!existingToken) {
            return NextResponse.json({ error: "Lien de vérification invalide" }, { status: 400 });
        }

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return NextResponse.json({ error: "Le lien a expiré" }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email: existingToken.identifier }
        });

        if (!existingUser) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 400 });
        }

        // Update user and delete token in a transaction
        await db.$transaction([
            db.user.update({
                where: { id: existingUser.id },
                data: { emailVerified: new Date() }
            }),
            db.verificationToken.delete({
                where: { id: existingToken.id }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Erreur serveur lors de la vérification" }, { status: 500 });
    }
}
