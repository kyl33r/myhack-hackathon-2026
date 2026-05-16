import type { AbstractStore } from './store'

export class StubStore implements AbstractStore {
  private startups = new Map<string, Record<string, unknown>>()
  private linkages = new Map<string, Record<string, unknown>>()
  private partners = new Map<string, Record<string, unknown>>()

  constructor() {
    for (const row of defaultLinkages()) {
      this.linkages.set(row.linkage_id as string, row)
    }
  }

  async saveStartup(id: string, data: Record<string, unknown>) { this.startups.set(id, data) }
  async getStartup(id: string) { return this.startups.get(id) ?? null }
  async getAllStartups() { return [...this.startups.values()] }

  async saveLinkage(linkage: Record<string, unknown>) {
    this.linkages.set(linkage.linkage_id as string, linkage)
  }
  async getLinkage(id: string) { return this.linkages.get(id) ?? null }
  async getAllLinkages() { return [...this.linkages.values()] }
  async updateLinkage(id: string, updates: Record<string, unknown>) {
    const existing = this.linkages.get(id)
    if (!existing) return null
    const updated = { ...existing, ...updates }
    this.linkages.set(id, updated)
    return updated
  }

  async savePartner(id: string, data: Record<string, unknown>) { this.partners.set(id, data) }
}

function defaultLinkages(): Record<string, unknown>[] {
  const now = new Date().toISOString()
  return [
    { linkage_id: 'lnk_20260516_001', startup_id: 'startup_001', startup_name: 'PayEase',   actor_type: 'mentor',    partner_type: null,               actor_id: 'mentor_001',  actor_name: 'Ahmad Razif',        match_score: 92, match_reason: 'Fintech expertise at seed stage.',        status: 'active',  programme_cycle: null,      created_at: now, outcome: null },
    { linkage_id: 'lnk_20260516_002', startup_id: 'startup_001', startup_name: 'PayEase',   actor_type: 'programme', partner_type: null,               actor_id: 'prog_001',    actor_name: 'CIP Accelerate',     match_score: 90, match_reason: 'Targets fintech seed-stage startups.',     status: 'active',  programme_cycle: 'Q3 2026', created_at: now, outcome: null },
    { linkage_id: 'lnk_20260516_003', startup_id: 'startup_001', startup_name: 'PayEase',   actor_type: 'partner',   partner_type: 'corporate',        actor_id: 'partner_001', actor_name: 'Mastercard',         match_score: 88, match_reason: 'Fintech pilot programme.',                 status: 'pending', programme_cycle: null,      created_at: now, outcome: null },
    { linkage_id: 'lnk_20260516_004', startup_id: 'startup_001', startup_name: 'PayEase',   actor_type: 'partner',   partner_type: 'investor',         actor_id: 'partner_002', actor_name: 'Openspace Ventures', match_score: 86, match_reason: 'B2B tech SEA focus.',                      status: 'active',  programme_cycle: null,      created_at: now, outcome: null },
    { linkage_id: 'lnk_20260516_005', startup_id: 'startup_001', startup_name: 'PayEase',   actor_type: 'partner',   partner_type: 'service_provider', actor_id: 'partner_003', actor_name: 'Wong & Partners',    match_score: 83, match_reason: 'Fintech legal specialists.',               status: 'active',  programme_cycle: null,      created_at: now, outcome: null },
    { linkage_id: 'lnk_20260515_001', startup_id: 'startup_002', startup_name: 'MediTrack', actor_type: 'mentor',    partner_type: null,               actor_id: 'mentor_002',  actor_name: 'Priya Nair',         match_score: 85, match_reason: 'B2B SaaS GTM experience.',                status: 'active',  programme_cycle: null,      created_at: now, outcome: null },
    { linkage_id: 'lnk_20260514_001', startup_id: 'startup_002', startup_name: 'MediTrack', actor_type: 'programme', partner_type: null,               actor_id: 'prog_002',    actor_name: 'GAIN Grant',         match_score: 76, match_reason: 'Commercialisation grant match.',           status: 'closed',  programme_cycle: null,      created_at: now, outcome: 'Not selected' },
  ]
}
