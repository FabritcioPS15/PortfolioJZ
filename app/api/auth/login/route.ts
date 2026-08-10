import { NextResponse } from 'next/server'
import { createToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/lib/auth'

export async function POST(request: Request) {
  let password = ''
  try {
    const body = await request.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const expected = process.env.EDITOR_PASSWORD || process.env.ADMIN_PASSWORD || ''
  if (!expected) {
    return NextResponse.json(
      { error: 'El editor no está configurado (falta EDITOR_PASSWORD)' },
      { status: 500 }
    )
  }

  if (!password || password !== expected) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}
