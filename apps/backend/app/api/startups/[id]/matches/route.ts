import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../../../lib/get-store'
import { getMatches } from '../../../../../lib/gemini'
import { buildMatchingPrompt } from '../../../../../lib/prompts'
import path from 'path'
import fs from 'fs'

function readSeed(name: string): unknown[] {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', `${name}.json`), 'utf-8')
  ) as unknown[]
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const startup = await getStore().getStartup(params.id)
  if (!startup) return NextResponse.json({ error: 'Startup not found' }, { status: 404 })

  const prompt = buildMatchingPrompt(
    startup,
    readSeed('mentors'),
    readSeed('programmes'),
    readSeed('partners'),
  )

  try {
    const matches = await getMatches(prompt)
    return NextResponse.json(matches)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Matching failed' },
      { status: 502 },
    )
  }
}
