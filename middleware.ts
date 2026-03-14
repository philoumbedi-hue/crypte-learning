import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { hasRequiredRole, Role } from "./src/lib/rbac-shared";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const pathname = req.nextUrl.pathname;

        // Admin routes protection
        // On exige au moins le rôle TEACHER pour entrer dans /admin
        if (pathname.startsWith("/admin") && !hasRequiredRole(token?.role as Role, "TEACHER")) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const pathname = req.nextUrl.pathname;

                // Public routes that don't require authentication
                if (
                    pathname === "/" ||
                    pathname === "/auth/signin" ||
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/_next") ||
                    pathname.includes(".") // For public assets
                ) {
                    return true;
                }

                // Protect specific routes
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: ["/catalogue/:path*", "/learn/:path*", "/admin/:path*", "/dashboard/:path*"],
};
