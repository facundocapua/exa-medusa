import { 
  type SubscriberConfig, 
  type SubscriberArgs 
} from '@medusajs/medusa'
import { Resend } from 'resend'

export default async function handleUserPasswordReset({
  data, eventName, container
}: SubscriberArgs<{ email: string; token: string; user_id: string }>) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { email, token } = data

  // Determine Admin URL. 
  // We can try to infer from ADMIN_CORS or use a default.
  // Typically Medusa Admin runs on port 7000 or 7001.
  // We'll use a link that points to the expected reset password route.
  // Since we don't know the exact deployed URL, we'll try to use process.env.ADMIN_URL if available, 
  // or fall back to the first origin in ADMIN_CORS, or localhost.
  
  const adminCors = process.env.ADMIN_CORS || ''
  const origins = adminCors.split(',').map(s => s.trim())
  const adminUrl = process.env.ADMIN_URL || origins[0] || 'http://localhost:7000'

  // Standard Medusa Admin reset route is often /reset-password or handled via /invite depending on version.
  // But usually /reset-password.
  const link = `${adminUrl}/reset-password?token=${token}`

  const htmlContent = `
    <h1>Password Reset Request</h1>
    <p>You have requested to reset your password for the admin dashboard.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="${link}">Reset Password</a></p>
    <p>Or copy this link:</p>
    <p>${link}</p>
    <p>If you did not request this, please ignore this email.</p>
  `

  console.log('[Resend] Sending password reset to', email)

  await resend.emails.send({
    from: 'no-reploy@fernandagutierrez.com.ar',
    to: email,
    subject: 'Reset your password',
    html: htmlContent
  })
}

export const config: SubscriberConfig = {
  event: 'user.password_reset',
  context: {
    subscriberId: 'user-password-reset-handler'
  }
}
