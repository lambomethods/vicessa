import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_123')

export class NotificationService {
    static async sendDailyCheckin(email: string, name: string) {
        return this.createNotification(email, "Daily Check-in", "How are you check-in")
    }

    static async createNotification(userIdOrEmail: string, title: string, message: string, type?: string) {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[DEV] Mock Notification to ${userIdOrEmail}: ${title} [Type: ${type || 'generic'}]`)
            return
        }
        // Implementation for real email if needed
    }

    static async sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
        if (!process.env.RESEND_API_KEY) {
            console.log(`[DEV] Mock Email to ${to}: ${subject}`)
            return
        }

        try {
            await resend.emails.send({
                from: 'Vicessa <wellness@vicessa.com>',
                to: to,
                subject: subject,
                html: html
            })
        } catch (error: unknown) {
            console.error("Failed to send email", error)
        }
    }
}
