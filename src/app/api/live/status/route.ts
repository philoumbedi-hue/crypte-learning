import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const liveSessionCount = await db.liveSession.count({
            where: {
                status: "LIVE"
            }
        });

        return NextResponse.json({ isLive: liveSessionCount > 0 });
    } catch {
        return NextResponse.json({ isLive: false }, { status: 500 });
    }
}
