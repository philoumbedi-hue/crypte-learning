import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { Role } from "@/lib/rbac-shared";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        EmailProvider({
            async sendVerificationRequest({ identifier, url }) {
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: "CRYPTE <onboarding@resend.dev>",
                    to: identifier,
                    subject: "Votre lien de connexion CRYPTE",
                    html: `<p>Cliquez sur le lien ci-dessous pour vous connecter :</p><p><a href="${url}">${url}</a></p>`,
                });
            },
        }),
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
                    const user = await db.user.findUnique({
                        where: {
                            email: cleanEmail,
                        },
                    });

                    if (!user || !user.password) {
                        throw new Error("Invalid credentials");
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isCorrectPassword) {
                        throw new Error("Invalid credentials");
                    }

                    // Strict Email Verification Check
                    if (!user.emailVerified) {
                        throw new Error("EMAIL_NOT_VERIFIED");
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        emailVerified: (user as { emailVerified?: Date }).emailVerified || new Date(),
                    };
                } catch {
                    throw new Error("Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Normalisation : On traite le rôle legacy "ADMIN" comme "SUPER_ADMIN"
                const normalizedRole = user.role === ("ADMIN" as string) ? ("SUPER_ADMIN" as string) : user.role;
                token.role = normalizedRole as Role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                // Récupération en temps réel du rôle depuis la DB pour éviter le "Session Lag"
                try {
                    const dbUser = await db.user.findUnique({
                        where: { id: token.sub },
                        select: { role: true, onboardingCompleted: true }
                    });

                    if (dbUser) {
                        // Normalisation : On traite le rôle legacy "ADMIN" comme "SUPER_ADMIN"
                        const role = dbUser.role === ("ADMIN" as string) ? "SUPER_ADMIN" : dbUser.role;
                        session.user.role = role as Role;
                        session.user.id = token.sub;
                        session.user.onboardingCompleted = dbUser.onboardingCompleted;
                    }
                } catch {
                    // Silently fail
                }
            }
            return session;
        },



        async redirect({ url, baseUrl }) {
            // If the user just signed in, check their role (using a separate logic or just allowing standard redirect)
            // Note: role is not directly available in standard redirect callback without session
            // But we can usually rely on the dashboard/page.tsx redirection we added earlier.
            // For a more immediate effect, we can use the signIn callback or a custom redirect.
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
