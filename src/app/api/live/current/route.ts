import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await db.liveSession.findFirst({
            where: {
                status: "LIVE"
            },
            include: {
                course: {
                    select: { title: true }
                }
            },
            orderBy: { startTime: "desc" }
        });

        return NextResponse.json({ session });
    } catch {
        return NextResponse.json({ session: null }, { status: 500 });
    }
}
