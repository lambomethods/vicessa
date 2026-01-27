import { z } from "zod"

// Authentication Schemas
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
})

export const passwordResetSchema = z.object({
    email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
    token: z.string(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number"),
})

// Payment Schemas
export const paymentIntentSchema = z.object({
    amount: z
        .number()
        .min(1, "Amount must be at least $0.01")
        .max(999999, "Amount cannot exceed $9,999.99"),
    currency: z.string().length(3).default("USD"),
    description: z.string().optional(),
})

export const subscriptionSchema = z.object({
    planType: z.enum(["free", "premium", "family"]),
    paymentMethodId: z.string().optional(),
})

// User Profile Schemas
export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    image: z.string().url().optional(),
    email: z.string().email().optional(),
})

// System Admin Schemas
export const systemFlagSchema = z.object({
    key: z.string().min(1).max(100),
    value: z.boolean(),
    description: z.string().optional(),
})

export const toggleSystemFlagSchema = z.object({
    key: z.enum([
        "MAINTENANCE_MODE",
        "DISABLE_AUTH",
        "DISABLE_PAYMENTS",
        "RATE_LIMIT_ENABLED",
    ]),
})

// Search and Filter Schemas
export const paginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
})

export const searchSchema = z.object({
    q: z.string().min(1).max(500),
    page: z.number().int().positive().default(1),
})

// API Response Schema
export const apiResponseSchema = z.object({
    success: z.boolean(),
    data: z.unknown().optional(),
    error: z.string().optional(),
    timestamp: z.date().optional(),
})

// Utility function to safely parse and handle validation
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
    try {
        return schema.parse(data)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors)
        }
        return null
    }
}

// Utility to get first validation error message
export function getValidationError(error: unknown): string {
    if (error instanceof z.ZodError) {
        return error.errors[0]?.message || "Validation failed"
    }
    return "Validation failed"
}

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type PaymentIntentInput = z.infer<typeof paymentIntentSchema>
export type SubscriptionInput = z.infer<typeof subscriptionSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type SystemFlagInput = z.infer<typeof systemFlagSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>
