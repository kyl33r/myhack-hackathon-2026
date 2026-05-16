import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../lib/get-store'

function newLinkageId() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  return `lnk_${d}_${seq}`
}

function toResponse(r: Record<string, unknown>) {
  return {
    linkageId: r.linkage_id,
    startupId: r.startup_id,
    startupName: r.startup_name,
    actorType: r.actor_type,
    partnerType: r.partner_type ?? null,
    actorId: r.actor_id,
    actorName: r.actor_name,
    matchScore: r.match_score,
    status: r.status,
    programmeCycle: r.programme_cycle ?? null,
    createdAt: r.created_at,
    outcome: r.outcome ?? null,
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>
  const linkage: Record<string, unknown> = {
    linkage_id: newLinkageId(),
    startup_id: body.startupId,
    startup_name: body.startupName,
    actor_type: body.actorType,
    partner_type: body.partnerType ?? null,
    actor_id: body.actorId,
    actor_name: body.actorName,
    match_score: body.matchScore,
    match_reason: body.matchReason,
    status: 'active',
    programme_cycle: null,
    created_at: new Date().toISOString(),
    outcome: null,
  }
  await getStore().saveLinkage(linkage)
  return NextResponse.json({ linkageId: linkage.linkage_id }, { status: 201 })
}

export async function GET() {
  const rows = await getStore().getAllLinkages()
  return NextResponse.json(rows.map(toResponse))
}
