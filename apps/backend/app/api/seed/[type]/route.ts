import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const ALLOWED = new Set(['mentors', 'programmes', 'partners'])

export async function GET(_req: NextRequest, { params }: { params: { type: string } }) {
  if (!ALLOWED.has(params.type)) {
    return NextResponse.json({ error: 'Unknown seed type' }, { status: 404 })
  }
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', `${params.type}.json`), 'utf-8')
  ) as unknown
  return NextResponse.json(data)
}
