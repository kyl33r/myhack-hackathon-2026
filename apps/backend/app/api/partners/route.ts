import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../lib/get-store'

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>
  const partnerId = `partner_${Date.now()}`
  await getStore().savePartner(partnerId, { partner_id: partnerId, status: 'pending_review', ...body })
  return NextResponse.json({ partnerId }, { status: 201 })
}
