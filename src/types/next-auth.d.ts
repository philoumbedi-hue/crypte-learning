import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: Role;
            onboardingCompleted?: boolean;
            emailVerified?: Date | null;
        } & DefaultSession["user"];
    }

    interface User {
        role: Role;
        onboardingCompleted?: boolean;
        emailVerified?: Date | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: Role;
    }
}
