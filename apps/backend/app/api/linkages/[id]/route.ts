import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../../lib/get-store'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const row = await getStore().getLinkage(params.id)
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    linkageId: row.linkage_id, startupId: row.startup_id, startupName: row.startup_name,
    actorType: row.actor_type, partnerType: row.partner_type ?? null,
    actorId: row.actor_id, actorName: row.actor_name, matchScore: row.match_score,
    status: row.status, programmeCycle: row.programme_cycle ?? null,
    createdAt: row.created_at, outcome: row.outcome ?? null,
  })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json() as Record<string, unknown>
  const updated = await getStore().updateLinkage(params.id, body)
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}
