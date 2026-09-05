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

    const admin = await AdminUserModel.findOne({ email: email.toLowerCase().trim() })
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const token = await signAdminToken({
      email: admin.email,
      role: admin.role,
    })

    const response = NextResponse.json({
      success: true,
      user: {
        email: admin.email,
        role: admin.role,
      },
    })

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
    console.error('Login error:', err)
    return NextResponse.json(
      { error: err?.message || 'Authentication error' },
      { status: 500 }
    )
  }
}
