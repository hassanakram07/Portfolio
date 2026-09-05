import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectToDatabase } from '@/lib/mongodb'
import { AdminUserModel } from '@/models/AdminUser'
import { ensureDatabaseSeeded } from '@/lib/db-init'
import { signAdminToken, AUTH_COOKIE_NAME } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await ensureDatabaseSeeded()
    await connectToDatabase()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const trimmedEmail = email.toLowerCase().trim()

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if admin user already exists
    const existingAdmin = await AdminUserModel.findOne({ email: trimmedEmail })
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'An administrator account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const newAdmin = await AdminUserModel.create({
      email: trimmedEmail,
      passwordHash,
      role: 'admin',
    })

    // Sign session token
    const token = await signAdminToken({
      email: newAdmin.email,
      role: newAdmin.role,
    })

    const response = NextResponse.json(
      {
        success: true,
        user: {
          email: newAdmin.email,
          role: newAdmin.role,
        },
      },
      { status: 201 }
    )

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (err: any) {
    console.error('Registration error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to create administrator account' },
      { status: 500 }
    )
  }
}
