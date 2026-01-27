import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Simple factory to wrap API routes with Zod validation
export function withValidation<T>(
    schema: z.ZodSchema<T>,
    handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
    return async (req: NextRequest) => {
        try {
            const body = await req.json()
            const parsed = schema.parse(body)
            return handler(req, parsed)
        } catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    { error: "Validation Failed", details: error.issues },
                    { status: 400 }
                )
            }
            return NextResponse.json({ error: "Invalid Request" }, { status: 400 })
        }
    }
}
