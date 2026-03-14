// @ts-expect-error: Package is installed but types are missing due to peer dependency issues
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createRouteHandlerClient({ cookies });
        try {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (error) throw error;

            if (data?.user?.email) {
                console.log("✅ Supabase confirmed email for:", data.user.email);
                // Sync with our Prisma DB
                await db.user.update({
                    where: { email: data.user.email },
                    data: { emailVerified: new Date() }
                });
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erreur inconnue";
            console.error("❌ Callback Exchange Error:", message);
            // Even on error, redirect to signin so the user doesn't stay on a blank page
            return NextResponse.redirect(`${requestUrl.origin}/auth/signin?error=verification_failed`);
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(`${requestUrl.origin}/auth/signin?verified=true`);
}
