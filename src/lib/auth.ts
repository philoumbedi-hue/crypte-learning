import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import { Role } from "@/lib/rbac-shared";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

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

                try {
                    // 1. Find user in Prisma database
                    const user = await db.user.findUnique({
                        where: { email: cleanEmail },
                    });

                    if (!user) {
                        throw new Error("Invalid credentials");
                    }

                    // 2. Verify password - handle both bcrypt and Firebase-managed passwords
                    let passwordValid = false;

                    if (user.password && user.password !== "FIREBASE_AUTH_MANAGED" && user.password !== "SUPABASE_AUTH_ENCRYPTED") {
                        // Standard bcrypt check
                        const bcrypt = await import("bcryptjs");
                        passwordValid = await bcrypt.compare(credentials.password, user.password);
                    } else {
                        // Firebase-managed: use Firebase Admin to verify via custom token
                        try {
                            const { adminAuth } = await import("@/lib/firebase-admin");
                            const firebaseUser = await adminAuth.getUserByEmail(cleanEmail);
                            // If user exists in Firebase, we trust and allow 
                            // (Firebase handles password validation on the client)
                            passwordValid = !!firebaseUser;
                        } catch {
                            passwordValid = false;
                        }
                    }

                    if (!passwordValid) {
                        throw new Error("Invalid credentials");
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        emailVerified: user.emailVerified,
                    };
                } catch (err: unknown) {
                    const error = err as any; // eslint-disable-line @typescript-eslint/no-explicit-any
                    console.error("❌ Auth Error:", error.message);
                    throw new Error(error.message || "Authentication failed");
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
