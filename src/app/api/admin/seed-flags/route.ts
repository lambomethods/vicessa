import { NextResponse } from "next/server"
import { SystemControl } from "@/lib/system-control"

export async function GET() {
    await SystemControl.seedDefaults()
    return NextResponse.json({ success: true, message: "System Flags Seeded" })
}
