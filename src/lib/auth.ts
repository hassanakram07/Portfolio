import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-local-jwt-key-hassanakram-2026-auth'
const secretKey = new TextEncoder().encode(JWT_SECRET)

export const AUTH_COOKIE_NAME = 'admin_token'

export async function signAdminToken(payload: { email: string; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)
}

export async function verifyAdminToken(token: string): Promise<{ email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as { email: string; role: string }
  } catch {
    return null
  }
}
