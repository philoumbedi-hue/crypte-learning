import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
        const supabase = createRouteHandlerClient({ cookies });
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Synchronize emailVerified in Prisma
            try {
                await db.user.update({
                    where: { email: data.user.email },
                    data: { emailVerified: new Date() },
                });
            } catch (e) {
                console.error("❌ Prisma callback sync error:", e);
            }
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/auth/signin', request.url));
}
