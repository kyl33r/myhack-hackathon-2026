import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MatchResponse } from '../types'

let _client: GoogleGenerativeAI | null = null

function getClient(): GoogleGenerativeAI {
  if (!_client) {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error('GEMINI_API_KEY is not set')
    _client = new GoogleGenerativeAI(key)
  }
  return _client
}

function toResult(item: Record<string, unknown>) {
  return {
    actorId: item.actor_id as string,
    actorName: item.actor_name as string,
    actorType: item.actor_type as 'mentor' | 'programme' | 'partner',
    partnerType: (item.partner_type ?? null) as 'corporate' | 'investor' | 'service_provider' | null,
    matchScore: item.match_score as number,
    matchReason: item.match_reason as string,
  }
}

export async function getMatches(prompt: string): Promise<MatchResponse> {
  const model = getClient().getGenerativeModel({ model: 'gemini-1.5-flash' })
  const result = await model.generateContent(prompt)
  let raw = result.response.text().trim()

  if (raw.startsWith('```')) {
    const lines = raw.split('\n')
    const end = lines.at(-1)?.startsWith('```') ? lines.length - 1 : lines.length
    raw = lines.slice(1, end).join('\n').trim()
  }

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>
  } catch (e) {
    throw new Error(`Gemini response is not valid JSON: ${e}`)
  }

  const allItems = [
    ...((parsed.mentors as unknown[]) ?? []),
    ...((parsed.programmes as unknown[]) ?? []),
    ...((parsed.corporate_partners as unknown[]) ?? []),
    ...((parsed.investors as unknown[]) ?? []),
    ...((parsed.service_providers as unknown[]) ?? []),
  ] as Record<string, unknown>[]

  for (const item of allItems) {
    const score = item.match_score
    if (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > 100) {
      throw new Error(`match_score invalid for actor_id=${item.actor_id}: ${score}`)
    }
  }

  return {
    mentors: ((parsed.mentors as Record<string, unknown>[]) ?? []).map(toResult),
    programmes: ((parsed.programmes as Record<string, unknown>[]) ?? []).map(toResult),
    corporatePartners: ((parsed.corporate_partners as Record<string, unknown>[]) ?? []).map(toResult),
    investors: ((parsed.investors as Record<string, unknown>[]) ?? []).map(toResult),
    serviceProviders: ((parsed.service_providers as Record<string, unknown>[]) ?? []).map(toResult),
  }
}
