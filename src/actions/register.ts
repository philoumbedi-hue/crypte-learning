import db from "@/lib/db";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export async function registerUser(data: {
    name: string;
    email: string;
    password: string;
}) {
    const cleanEmail = data.email.trim().toLowerCase();

    try {
        // 1. Firebase Auth Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
        const firebaseUser = userCredential.user;

        if (data.name) {
            await updateProfile(firebaseUser, { displayName: data.name });
        }

        // 2. Synchronize with Prisma User Table
        const existingUser = await db.user.findUnique({ where: { email: cleanEmail } });

        if (!existingUser) {
            await db.user.create({
                data: {
                    id: firebaseUser.uid, // Using Firebase Auth UID
                    name: data.name,
                    email: cleanEmail,
                    password: "FIREBASE_AUTH_MANAGED",
                    onboardingCompleted: false,
                },
            });
        }

        console.log("✅ User registered via Firebase Auth:", cleanEmail);
        return { success: true, email: cleanEmail };

    } catch (err: unknown) {
        const error = err as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("❌ Firebase Auth Error:", error.message);
        if (error.code === "auth/email-already-in-use") {
            return { error: "EMAIL_ALREADY_EXISTS" };
        }
        return { error: error.message };
    }
}
