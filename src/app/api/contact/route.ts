import { NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'
import { connectToDatabase } from '@/lib/mongodb'
import { MessageModel } from '@/models/Message'
import { Resend } from 'resend'

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate input
    const result = contactFormSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const data = result.data

    // Save to MongoDB
    try {
      await connectToDatabase()
      await MessageModel.create({
        name: data.name,
        email: data.email,
        project_type: data.project_type,
        budget_range: data.budget_range,
        message: data.message,
        status: 'unread',
      })
    } catch (dbErr) {
      console.error('MongoDB message save error:', dbErr)
    }

    // Send email notification via Resend (if configured)
    const resend = getResendClient()
    if (resend && process.env.RESEND_TO_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
          to: process.env.RESEND_TO_EMAIL,
          subject: `New contact from ${data.name} — ${data.project_type}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px;">
              <h2 style="color: #3b82f6;">New Portfolio Inquiry</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Project Type</td><td style="padding: 8px 0;">${data.project_type}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #64748b;">Budget</td><td style="padding: 8px 0;">${data.budget_range}</td></tr>
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f1f5f9; border-radius: 8px;">
                <p style="font-weight: bold; color: #64748b; margin: 0 0 8px;">Message</p>
                <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
              </div>
              <p style="margin-top: 16px; font-size: 12px; color: #94a3b8;">
                This message was submitted via your portfolio contact form.
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
