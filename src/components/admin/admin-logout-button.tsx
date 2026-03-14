"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-700 transition"
        >
            <LogOut className="w-4 h-4" />
            Déconnexion
        </button>
    );
}
