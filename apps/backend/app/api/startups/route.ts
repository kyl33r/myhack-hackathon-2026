import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../lib/get-store'

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>
  const startupId = `startup_${Date.now()}`
  await getStore().saveStartup(startupId, { startup_id: startupId, ...body })
  return NextResponse.json({ startupId }, { status: 201 })
}

export async function GET() {
  const startups = await getStore().getAllStartups()
  return NextResponse.json(startups)
}
