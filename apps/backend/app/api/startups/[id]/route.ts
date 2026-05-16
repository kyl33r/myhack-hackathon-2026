import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../../lib/get-store'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const startup = await getStore().getStartup(params.id)
  if (!startup) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(startup)
}
