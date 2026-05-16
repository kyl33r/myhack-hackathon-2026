import type { StartupProfile, MatchResponse, LinkageCreate, Linkage } from '../types'
import {
  stubSubmitStartupProfile,
  stubGetMatches,
  stubConfirmLinkage,
  stubGetLinkages,
  stubSubmitPartnerProfile,
  stubStaffLogin,
} from './stubs'

const USE_STUB = import.meta.env.VITE_USE_STUB === 'true'
const API_BASE = import.meta.env.VITE_API_BASE_URL as string

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  return res.json() as Promise<T>
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  return res.json() as Promise<T>
}

export async function submitStartupProfile(data: StartupProfile): Promise<{ startupId: string }> {
  if (USE_STUB) return stubSubmitStartupProfile(data)
  return post<{ startupId: string }>('/startups', data)
}

export async function getMatches(startupId: string): Promise<MatchResponse> {
  if (USE_STUB) return stubGetMatches(startupId)
  return get<MatchResponse>(`/startups/${startupId}/matches`)
}

export async function confirmLinkage(data: LinkageCreate): Promise<{ linkageId: string }> {
  if (USE_STUB) return stubConfirmLinkage(data)
  return post<{ linkageId: string }>('/linkages', data)
}

export async function getLinkages(): Promise<Linkage[]> {
  if (USE_STUB) return stubGetLinkages()
  return get<Linkage[]>('/linkages')
}

export async function submitPartnerProfile(data: unknown): Promise<void> {
  if (USE_STUB) return stubSubmitPartnerProfile(data)
  await post<void>('/partners', data)
}

export async function staffLogin(email: string, password: string): Promise<void> {
  if (USE_STUB) return stubStaffLogin(email, password)
  await post<void>('/auth/login', { email, password })
}
