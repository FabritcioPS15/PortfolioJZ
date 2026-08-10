import { createHmac, timingSafeEqual } from 'crypto'

export const SESSION_COOKIE = 'editor_token'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 días

function secret(): string {
  return process.env.EDITOR_PASSWORD || process.env.ADMIN_PASSWORD || ''
}

export function createToken(): string {
  const payload = String(Date.now())
  const sig = createHmac('sha256', secret())
    .update(payload)
    .digest('hex')
  return `${payload}.${sig}`
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false
  if (!secret()) return false

  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false

  const ts = parseInt(payload, 10)
  if (isNaN(ts) || Date.now() - ts > SESSION_MAX_AGE_SECONDS * 1000) return false

  const expected = createHmac('sha256', secret())
    .update(payload)
    .digest('hex')

  const a = Buffer.from(sig, 'hex')
  const b = Buffer.from(expected, 'hex')
  if (a.length !== b.length) return false

  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get('cookie')
  if (!cookie) return null

  for (const part of cookie.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === SESSION_COOKIE) return decodeURIComponent(rest.join('='))
  }
  return null
}

export function isAuthenticated(request: Request): boolean {
  return verifyToken(getTokenFromRequest(request))
}
