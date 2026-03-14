"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            {children}
            <Toaster position="bottom-right" />
        </SessionProvider>
    );
};

