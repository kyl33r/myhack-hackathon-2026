import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email: string; password: string }
  const expectedEmail = process.env.STAFF_EMAIL ?? 'admin@cradle.com.my'
  const expectedPassword = process.env.STAFF_PASSWORD ?? 'cradle2026'
  if (email !== expectedEmail || password !== expectedPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
