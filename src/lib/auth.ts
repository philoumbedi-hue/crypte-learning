import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import { Role } from "@/lib/rbac-shared";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const cleanEmail = credentials?.email?.trim().toLowerCase();

                if (!cleanEmail || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                // 1. Authenticate with Firebase
                const { signInWithEmailAndPassword } = await import("firebase/auth");
                const { auth } = await import("@/lib/firebase");

                try {
                    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, credentials.password);
                    const firebaseUser = userCredential.user;

                    if (!firebaseUser) {
                        throw new Error("Authentication failed");
                    }

                    // 2. Fetch User metadata from Prisma
                    const user = await db.user.findUnique({
                        where: { email: cleanEmail },
                    });

                    if (!user) {
                        throw new Error("User record not found");
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        emailVerified: user.emailVerified || (firebaseUser.emailVerified ? new Date() : null),
                    };
                } catch (err: any) {
                    console.error("❌ Firebase Auth Error:", err.message);
                    if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                        throw new Error("Invalid credentials");
                    }
                    throw new Error(err.message || "Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const normalizedRole = user.role === ("ADMIN" as string) ? ("SUPER_ADMIN" as string) : user.role;
                token.role = normalizedRole as Role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                try {
                    const dbUser = await db.user.findUnique({
                        where: { id: token.id as string },
                        select: { role: true, onboardingCompleted: true }
                    });

                    if (dbUser) {
                        const role = dbUser.role === ("ADMIN" as string) ? "SUPER_ADMIN" : dbUser.role;
                        session.user.role = role as Role;
                        session.user.id = token.id as string;
                        session.user.onboardingCompleted = dbUser.onboardingCompleted;
                    }
                } catch {
                    // Silently fail
                }
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
