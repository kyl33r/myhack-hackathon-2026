import type { StartupProfile, MatchResponse, LinkageCreate, Linkage } from '../types'

function delay<T>(value: T, ms = 1200): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

let linkageCounter = 1

const stubLinkages: Linkage[] = [
  {
    linkageId: 'lnk_20260516_001',
    startupId: 'startup_001',
    startupName: 'PayEase',
    actorType: 'mentor',
    partnerType: null,
    actorId: 'mentor_001',
    actorName: 'Ahmad Razif',
    matchScore: 92,
    status: 'active',
    programmeCycle: null,
    createdAt: '2026-05-16',
    outcome: '—',
  },
  {
    linkageId: 'lnk_20260516_002',
    startupId: 'startup_001',
    startupName: 'PayEase',
    actorType: 'programme',
    partnerType: null,
    actorId: 'prog_001',
    actorName: 'CIP Accelerate',
    matchScore: 90,
    status: 'active',
    programmeCycle: 'Q3 2026',
    createdAt: '2026-05-16',
    outcome: '—',
  },
  {
    linkageId: 'lnk_20260516_003',
    startupId: 'startup_001',
    startupName: 'PayEase',
    actorType: 'partner',
    partnerType: 'corporate',
    actorId: 'partner_001',
    actorName: 'Mastercard',
    matchScore: 88,
    status: 'pending',
    programmeCycle: null,
    createdAt: '2026-05-16',
    outcome: '—',
  },
  {
    linkageId: 'lnk_20260516_004',
    startupId: 'startup_001',
    startupName: 'PayEase',
    actorType: 'partner',
    partnerType: 'investor',
    actorId: 'partner_002',
    actorName: 'Openspace Ventures',
    matchScore: 86,
    status: 'active',
    programmeCycle: null,
    createdAt: '2026-05-16',
    outcome: '—',
  },
  {
    linkageId: 'lnk_20260516_005',
    startupId: 'startup_001',
    startupName: 'PayEase',
    actorType: 'partner',
    partnerType: 'service_provider',
    actorId: 'partner_003',
    actorName: 'Wong & Partners',
    matchScore: 83,
    status: 'active',
    programmeCycle: null,
    createdAt: '2026-05-16',
    outcome: '—',
  },
  {
    linkageId: 'lnk_20260515_001',
    startupId: 'startup_002',
    startupName: 'MediTrack',
    actorType: 'mentor',
    partnerType: null,
    actorId: 'mentor_002',
    actorName: 'Priya Nair',
    matchScore: 85,
    status: 'active',
    programmeCycle: null,
    createdAt: '2026-05-15',
    outcome: '—',
  },
  {
    linkageId: 'lnk_20260514_001',
    startupId: 'startup_002',
    startupName: 'MediTrack',
    actorType: 'programme',
    partnerType: null,
    actorId: 'prog_002',
    actorName: 'GAIN Grant',
    matchScore: 76,
    status: 'closed',
    programmeCycle: null,
    createdAt: '2026-05-14',
    outcome: 'Not selected',
  },
  {
    linkageId: 'lnk_20260515_002',
    startupId: 'startup_002',
    startupName: 'MediTrack',
    actorType: 'partner',
    partnerType: 'investor',
    actorId: 'partner_004',
    actorName: 'Iterative',
    matchScore: 74,
    status: 'pending',
    programmeCycle: null,
    createdAt: '2026-05-15',
    outcome: '—',
  },
  {
    linkageId: 'lnk_20260513_001',
    startupId: 'startup_003',
    startupName: 'EduReach',
    actorType: 'mentor',
    partnerType: null,
    actorId: 'mentor_003',
    actorName: 'David Tan',
    matchScore: 80,
    status: 'active',
    programmeCycle: null,
    createdAt: '2026-05-13',
    outcome: '—',
  },
  {
    linkageId: 'lnk_20260513_002',
    startupId: 'startup_003',
    startupName: 'EduReach',
    actorType: 'partner',
    partnerType: 'service_provider',
    actorId: 'partner_005',
    actorName: 'AWS Activate',
    matchScore: 75,
    status: 'active',
    programmeCycle: null,
    createdAt: '2026-05-13',
    outcome: '—',
  },
]

export async function stubSubmitStartupProfile(_data: StartupProfile): Promise<{ startupId: string }> {
  return delay({ startupId: 'startup_001' })
}

export async function stubGetMatches(_startupId: string): Promise<MatchResponse> {
  return delay({
    mentors: [
      {
        actorId: 'mentor_001',
        actorName: 'Ahmad Razif',
        actorType: 'mentor' as const,
        partnerType: null,
        matchScore: 92,
        matchReason: 'Ahmad has fintech expertise and mentored 3 payment startups at seed stage.',
      },
      {
        actorId: 'mentor_002',
        actorName: 'Priya Nair',
        actorType: 'mentor' as const,
        partnerType: null,
        matchScore: 85,
        matchReason: 'Priya has scaled two B2B SaaS startups and advises on GTM and enterprise sales.',
      },
      {
        actorId: 'mentor_003',
        actorName: 'David Tan',
        actorType: 'mentor' as const,
        partnerType: null,
        matchScore: 74,
        matchReason: 'David built a cross-border payments platform and has deep regulatory knowledge in SEA.',
      },
    ],
    programmes: [
      {
        actorId: 'prog_001',
        actorName: 'CIP Accelerate',
        actorType: 'programme' as const,
        partnerType: null,
        matchScore: 90,
        matchReason: 'CIP Accelerate targets fintech seed-stage startups and offers direct investment plus lab access.',
      },
      {
        actorId: 'prog_002',
        actorName: 'GAIN Grant',
        actorType: 'programme' as const,
        partnerType: null,
        matchScore: 82,
        matchReason: "GAIN supports early-stage startups with commercialisation grants, matching PayEase's seed stage.",
      },
      {
        actorId: 'prog_003',
        actorName: 'Tech Startup Catalyst',
        actorType: 'programme' as const,
        partnerType: null,
        matchScore: 71,
        matchReason: 'TSC provides structured mentorship and market access for early fintech and payments startups.',
      },
    ],
    corporatePartners: [
      {
        actorId: 'partner_001',
        actorName: 'Mastercard',
        actorType: 'partner' as const,
        partnerType: 'corporate' as const,
        matchScore: 88,
        matchReason: 'Mastercard runs a fintech pilot programme and actively seeks seed-stage payment startups for co-pilots.',
      },
      {
        actorId: 'partner_006',
        actorName: 'CIMB Bank',
        actorType: 'partner' as const,
        partnerType: 'corporate' as const,
        matchScore: 79,
        matchReason: 'CIMB offers API sandbox access and distribution channels ideal for cross-border payment startups.',
      },
    ],
    investors: [
      {
        actorId: 'partner_002',
        actorName: 'Openspace Ventures',
        actorType: 'partner' as const,
        partnerType: 'investor' as const,
        matchScore: 86,
        matchReason: "Openspace focuses on B2B tech with SEA expansion potential, aligning well with PayEase's cross-border payments thesis.",
      },
      {
        actorId: 'partner_004',
        actorName: 'Iterative',
        actorType: 'partner' as const,
        partnerType: 'investor' as const,
        matchScore: 77,
        matchReason: "Iterative backs early-stage SEA founders with capital and YC-style support, suitable for PayEase's current stage.",
      },
    ],
    serviceProviders: [
      {
        actorId: 'partner_003',
        actorName: 'Wong & Partners',
        actorType: 'partner' as const,
        partnerType: 'service_provider' as const,
        matchScore: 83,
        matchReason: 'Wong & Partners specialises in fintech startup legal work and offers discounted rates for Cradle-referred companies.',
      },
      {
        actorId: 'partner_005',
        actorName: 'AWS Activate',
        actorType: 'partner' as const,
        partnerType: 'service_provider' as const,
        matchScore: 75,
        matchReason: "AWS Activate provides up to $25K in cloud credits, reducing infrastructure costs for PayEase's early growth phase.",
      },
    ],
  })
}

export async function stubConfirmLinkage(_data: LinkageCreate): Promise<{ linkageId: string }> {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const id = `lnk_${today}_${String(linkageCounter++).padStart(3, '0')}`
  return delay({ linkageId: id })
}

export async function stubGetLinkages(): Promise<Linkage[]> {
  return delay([...stubLinkages])
}

export async function stubSubmitPartnerProfile(_data: unknown): Promise<void> {
  return delay(undefined as unknown as void)
}

export async function stubStaffLogin(_email: string, _password: string): Promise<void> {
  return delay(undefined as unknown as void)
}
