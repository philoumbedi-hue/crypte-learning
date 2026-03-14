import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await db.liveSession.findUnique({
            where: { id: params.id },
            select: { status: true }
        });

        if (!session) {
            return NextResponse.json({ status: "NOT_FOUND" }, { status: 404 });
        }

        return NextResponse.json({ status: session.status });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
