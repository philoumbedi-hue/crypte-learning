import db from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    const cleanEmail = data.email.trim().toLowerCase();

    // 1. Supabase Auth Sign Up (Sends email automatically)
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
            data: {
                full_name: data.name,
            },
            emailRedirectTo: `${process.env.NEXTAUTH_URL}/auth/callback`,
        },
    });

    if (authError) {
        console.error("❌ Supabase Auth Error:", authError.message);
        if (authError.message.includes("already registered")) {
            return { error: "EMAIL_ALREADY_EXISTS" };
        }
        return { error: authError.message };
    }

    if (!authData.user) {
        return { error: "FAILED_TO_CREATE_USER" };
    }

    // 2. Synchronize with Prisma User Table
    try {
        const existingUser = await db.user.findUnique({ where: { email: cleanEmail } });

        if (!existingUser) {
            await db.user.create({
                data: {
                    id: authData.user.id, // Using Supabase Auth ID
                    name: data.name,
                    email: cleanEmail,
                    password: "SUPABASE_AUTH_ENCRYPTED", // Dummy password since we'll use Supabase for Auth
                    onboardingCompleted: false,
                },
            });
        }
    } catch (e: unknown) {
        console.error("❌ Prisma Sync Error:", e);
        // We don't return error here because the user is already created in Supabase Auth
    }

    console.log("✅ User registered via Supabase Auth - Confirmation email sent to:", cleanEmail);
    return { success: true, email: cleanEmail };
}
