# 🔐 Security Implementation Guide - Vicessa

## Overview
This document outlines the comprehensive security measures implemented in the vicessa application to protect against hacking, malware, and unauthorized access.

## Implemented Security Layers

### 1. **Rate Limiting** (`src/lib/rate-limit.ts`)
Distributed rate limiting using Upstash Redis prevents brute force and DDoS attacks.

**Configuration:**
- **Auth endpoints**: 5 attempts per 15 minutes
- **API endpoints**: 100 requests per hour
- **Payment endpoints**: 10 attempts per hour
- **General requests**: 1000 per hour

**Environment Variables:**
```
UPSTASH_REDIS_REST_URL=https://your-upstash-url.com
UPSTASH_REDIS_REST_TOKEN=your-token
```

**Graceful Degradation:** If Redis is unavailable, requests are allowed but logged as errors.

### 2. **Security Headers** (`next.config.ts`)
Comprehensive HTTP security headers prevent common web vulnerabilities.

**Headers Configured:**
- `X-Content-Type-Options: nosniff` - Prevents MIME-type sniffing
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Content-Security-Policy` - Controls resource loading
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer info
- `Permissions-Policy` - Disables cameras, mics, geolocation
- `Strict-Transport-Security` - Enforces HTTPS (1 year)

### 3. **Input Validation** (`src/lib/validation.ts`)
All user inputs validated with Zod schemas before processing.

**Included Schemas:**
- Authentication (login, register, password reset)
- Payments & subscriptions
- User profiles
- System administration
- Search & filtering
- API responses

**Usage in API Routes:**
```typescript
import { loginSchema, getValidationError } from "@/lib/validation"

const validated = loginSchema.safeParse(data)
if (!validated.success) {
  return new NextResponse(
    JSON.stringify({ error: getValidationError(validated.error) }),
    { status: 400 }
  )
}

const { email, password } = validated.data
// Process...
```

### 4. **Security Logging** (`src/lib/security-log.ts`)
Centralized security event logging for monitoring and incident response.

**Logged Events:**
- `FAILED_LOGIN` - Failed authentication attempts
- `UNAUTHORIZED_ACCESS` - Access without valid session
- `RATE_LIMIT_EXCEEDED` - Rate limit violations
- `PERMISSION_DENIED` - Insufficient role/permissions
- `SUSPICIOUS_ACTIVITY` - Unusual behavior patterns
- `API_ERROR` - API request errors

**Database Model:** `SecurityLog` in Prisma schema

**Access Audit Logs:**
```typescript
import { getCriticalSecurityEvents, getRecentSecurityEvents } from "@/lib/security-log"

// Get last 50 events
const recent = await getRecentSecurityEvents(50)

// Get critical events from last 24 hours
const critical = await getCriticalSecurityEvents()

// Resolve a security event
await resolveSecurityEvent(eventId, "Admin investigation notes")
```

### 5. **API Route Protection** (`src/lib/api-protection.ts`)
Middleware for protecting API routes with authentication, rate limiting, and role checks.

**Usage Example:**
```typescript
import { protectAPI, createProtectedResponse, createErrorResponse } from "@/lib/api-protection"

export async function POST(req: NextRequest) {
  // Protect endpoint: require auth + admin role + rate limit
  const protected = await protectAPI(req, {
    requireAuth: true,
    requireRole: "admin",
    rateLimit: "api",
    checkSystemStatus: true,
  })

  if (!protected.ok) return protected.response

  const { session, headers } = protected
  
  // Your logic here...
  
  return createProtectedResponse({ success: true }, headers)
}
```

**Options:**
- `requireAuth` (boolean) - Require valid session
- `requireRole` (string | string[]) - Require specific role(s)
- `rateLimit` (string) - Rate limit type ("auth", "api", "payment", "general")
- `checkSystemStatus` (boolean) - Check maintenance mode

### 6. **Authentication Killswitch** (`src/auth.ts`)
Emergency system to disable authentication and prevent account takeovers.

**Killswitch Flags:**
- `DISABLE_AUTH` - Disable login completely
- `MAINTENANCE_MODE` - Put system in maintenance (all endpoints return 503)
- `DISABLE_PAYMENTS` - Disable payment processing

**Activate Killswitch:**
```typescript
import { prisma } from "@/lib/db"

// Emergency disable auth
await prisma.systemFlag.upsert({
  where: { key: "DISABLE_AUTH" },
  create: { key: "DISABLE_AUTH", value: true },
  update: { value: true },
})

// Enable maintenance mode
await prisma.systemFlag.upsert({
  where: { key: "MAINTENANCE_MODE" },
  create: { key: "MAINTENANCE_MODE", value: true },
  update: { value: true },
})
```

## Emergency Response Procedure

### If Hacked 🚨

**Immediate Actions (0-5 minutes):**
1. **Activate Maintenance Mode**
   - This takes the app offline for all users
   ```bash
   # Via admin dashboard or direct DB update
   UPDATE "SystemFlag" SET value = true WHERE key = 'MAINTENANCE_MODE'
   ```

2. **Regenerate NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   - Update in Vercel Dashboard → Settings → Environment Variables
   - Redeploy immediately

3. **Revoke API Keys**
   - Stripe Secret Key → create new one
   - Resend API Key → create new one
   - Any third-party integrations

**Short-term Actions (5-30 minutes):**
1. **Audit Recent Logs**
   ```typescript
   const critical = await getCriticalSecurityEvents()
   const failedLogins = await prisma.securityLog.findMany({
     where: { event: "FAILED_LOGIN" },
     orderBy: { createdAt: "desc" },
     take: 100,
   })
   ```

2. **Review Deployments**
   - Check Vercel deployment history
   - Review GitHub commit history for unauthorized changes
   - Enable branch protection on main branch

3. **Force Password Reset**
   - Notify all users via email
   - In app, require new password on next login

4. **Check Database Access**
   - Review database connection logs
   - Verify no unauthorized connections

**Medium-term Actions (30+ minutes):**
1. **Forensic Analysis**
   - Export SecurityLog table for investigation
   - Check access patterns and anomalies
   - Identify compromised user accounts

2. **User Notification**
   - Email all users about security incident
   - Provide steps to secure their accounts
   - Offer password reset assistance

3. **System Hardening**
   - Update all dependencies
   - Run security audit: `npm audit fix`
   - Review and tighten security policies

4. **Enable Admin Alerts**
   - Monitor SecurityLog for continued attacks
   - Setup webhook alerts for critical events

## Monitoring & Alerts

### Create Monitoring Dashboard
```typescript
// src/app/api/admin/security-status/route.ts
import { getCriticalSecurityEvents, getRecentSecurityEvents } from "@/lib/security-log"
import { protectAPI } from "@/lib/api-protection"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const protected = await protectAPI(req, {
    requireAuth: true,
    requireRole: "admin",
  })

  if (!protected.ok) return protected.response

  const critical = await getCriticalSecurityEvents()
  const recent = await getRecentSecurityEvents(20)
  const unresolved = await prisma.securityLog.findMany({
    where: { resolved: false },
  })

  return NextResponse.json({
    criticalEventsLast24h: critical.length,
    recentEvents: recent,
    unresolvedCount: unresolved.length,
    threatLevel: critical.length > 10 ? "HIGH" : "NORMAL",
  })
}
```

## Environment Variables Checklist

**Required for Production:**
```
# Authentication
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=https://vicessa.vercel.app

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email
RESEND_API_KEY=...

# Auth Providers (if using OAuth)
GITHUB_ID=...
GITHUB_SECRET=...
```

**Never commit secrets** - Use Vercel's environment variable management.

## Dependencies

```json
{
  "dependencies": {
    "@upstash/ratelimit": "^1.1.0",
    "@upstash/redis": "^1.28.0",
    "zod": "^4.3.6",
    "bcryptjs": "^3.0.3"
  },
  "devDependencies": {
    "typescript": "^5"
  }
}
```

## Security Best Practices

### For Developers
1. ✅ **Always validate user input** - Use Zod schemas
2. ✅ **Use parameterized queries** - Prisma handles this automatically
3. ✅ **Check authentication** - Use `protectAPI` middleware
4. ✅ **Log security events** - Call `logSecurityEvent` for suspicious activity
5. ✅ **Never log sensitive data** - Don't log passwords, API keys, tokens
6. ✅ **Use environment variables** - Never hardcode secrets
7. ✅ **Run security audits** - `npm audit` regularly
8. ✅ **Review dependencies** - Keep packages updated

### For Administrators
1. ✅ **Monitor security logs** regularly
2. ✅ **Rotate API keys** every 90 days
3. ✅ **Enable 2FA** on GitHub and Vercel accounts
4. ✅ **Review access logs** weekly
5. ✅ **Test killswitches** monthly
6. ✅ **Backup database** daily
7. ✅ **Update dependencies** monthly
8. ✅ **Review deployments** before merging

## Testing Security

### Manual Tests
```bash
# Test rate limiting
for i in {1..20}; do curl http://localhost:3000/api/test; done

# Test input validation
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"short"}'

# Test auth requirement
curl http://localhost:3000/api/admin/control

# Test killswitch
# Set DISABLE_AUTH to true, try to login
```

### Automated Testing
```typescript
// tests/security.test.ts
describe("Security", () => {
  it("should reject requests without auth", async () => {
    const res = await fetch("/api/admin/control")
    expect(res.status).toBe(401)
  })

  it("should rate limit excessive requests", async () => {
    for (let i = 0; i < 110; i++) {
      await fetch("/api/test")
    }
    const res = await fetch("/api/test")
    expect(res.status).toBe(429)
  })
})
```

## Support & Escalation

**For security incidents:** Contact your security team immediately.

**For questions about implementation:** Refer to code comments in security files.

**For emergencies:** Activate MAINTENANCE_MODE and contact Vercel support.

---

**Last Updated:** January 26, 2026
**Status:** ✅ All security measures implemented and tested
