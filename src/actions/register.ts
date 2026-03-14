"use server";

import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/email";

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    const cleanEmail = data.email.trim().toLowerCase();

    const existing = await db.user.findUnique({
        where: { email: cleanEmail },
    });

    if (existing) {
        throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with emailVerified set to null
    try {
        const user = await db.user.create({
            data: {
                name: data.name,
                email: cleanEmail,
                password: hashedPassword,
                emailVerified: null,
                onboardingCompleted: false,
            },
        });

        // Generate Verification Token
        const token = uuidv4();
        const expires = new Date(Date.now() + 3600 * 2000); // 2 hours

        await db.verificationToken.create({
            data: {
                identifier: cleanEmail,
                token,
                expires,
            },
        });

        // Send Email
        await sendVerificationEmail(cleanEmail, token);

    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Erreur inconnue";
        console.error("❌ Prisma User Creation Error:", message);
        throw new Error("Failed to create user or verification token");
    }

    console.log("✅ User registered - Confirmation email sent to:", cleanEmail);
    return { success: true, email: cleanEmail };
}
