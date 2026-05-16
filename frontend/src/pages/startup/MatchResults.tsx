import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../../components/Nav'
import MatchCard from '../../components/MatchCard'
import Toast, { showToast } from '../../components/Toast'
import { confirmLinkage } from '../../services/api'
import type { MatchResponse, MatchResult } from '../../types'

interface LocationState {
  startupId: string
  startupName: string
  matches: MatchResponse
}

function metaForResult(result: MatchResult): string {
  if (result.actorType === 'mentor') {
    return `${result.actorId}`
  }
  return result.actorId
}

// Hardcoded meta lines matching the wireframe seed data
const META_MAP: Record<string, string> = {
  'Ahmad Razif': 'Fintech · Seed · Kuala Lumpur',
  'Priya Nair': 'B2B SaaS · Pre-seed, Seed · Remote',
  'David Tan': 'Payments · Series A · Singapore',
  'CIP Accelerate': 'Funding: RM 500,000 · Next intake: Q3 2026',
  'GAIN Grant': 'Funding: RM 150,000 · Next intake: Q4 2026',
  'Tech Startup Catalyst': 'Funding: RM 100,000 · Next intake: Q2 2026',
  'Mastercard': 'Payments · Pilot Program · API Access',
  'CIMB Bank': 'Banking · API Sandbox · Distribution',
  'Openspace Ventures': 'Ticket: RM 500K–3M · Seed, Series A · B2B Tech',
  'Iterative': 'Ticket: RM 150K–600K · Pre-seed, Seed · SEA Founders',
  'Wong & Partners': 'Legal · Discounted · Incorporation, Term Sheets, IP',
  'AWS Activate': 'Cloud Credits · Free Tier · All stages',
}

interface SlideDeckModalProps {
  startupName: string
  matches: MatchResponse
  onClose: () => void
}

function SlideDeckModal({ startupName, matches, onClose }: SlideDeckModalProps) {
  const topMentor = matches.mentors[0]
  const topProg = matches.programmes[0]
  const topCorp = matches.corporatePartners[0]
  const topInv = matches.investors[0]
  const topSvc = matches.serviceProviders[0]

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Startup Summary Deck</h2>
          <button className="modal-close" onClick={onClose} type="button">✕</button>
        </div>
        <div className="slide">
          <div className="slide-number">1 / 3</div>
          <h3 className="slide-title">{startupName}</h3>
          <p className="slide-tagline">Cross-border payments for SMEs</p>
          <div className="slide-chips">
            <span className="chip">Fintech</span>
            <span className="chip">Seed Stage</span>
            <span className="chip">Kuala Lumpur</span>
          </div>
        </div>
        <div className="slide">
          <div className="slide-number">2 / 3</div>
          <h3 className="slide-title">Top Matches</h3>
          <ul className="slide-list">
            {topMentor && <li>🧑‍💼 Mentor — {topMentor.actorName} ({topMentor.matchScore}%)</li>}
            {topProg && <li>📋 Programme — {topProg.actorName} ({topProg.matchScore}%)</li>}
            {topCorp && <li>🤝 Partner — {topCorp.actorName} ({topCorp.matchScore}%)</li>}
            {topInv && <li>💰 Investor — {topInv.actorName} ({topInv.matchScore}%)</li>}
            {topSvc && <li>⚖️ Service — {topSvc.actorName} ({topSvc.matchScore}%)</li>}
          </ul>
        </div>
        <div className="slide">
          <div className="slide-number">3 / 3</div>
          <h3 className="slide-title">Next Steps</h3>
          <ul className="slide-list">
            <li>Confirm linkages to activate matches</li>
            <li>Cradle staff will reach out within 5 working days</li>
            <li>Prepare a 10-slide deck for programme application</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

interface MatchSectionProps {
  title: string
  results: MatchResult[]
  gridClass?: string
  startupId: string
  startupName: string
}

function MatchSection({ title, results, gridClass, startupId, startupName }: MatchSectionProps) {
  if (results.length === 0) return null
  return (
    <section className="match-section">
      <h2 className="section-title">{title}</h2>
      <div className={`card-grid${gridClass ? ` ${gridClass}` : ''}`}>
        {results.map(r => (
          <MatchCard
            key={r.actorId}
            actorId={r.actorId}
            actorName={r.actorName}
            actorType={r.actorType}
            partnerType={r.partnerType}
            matchScore={r.matchScore}
            matchReason={r.matchReason}
            metaLine={META_MAP[r.actorName] ?? ''}
            onConfirm={async () => {
              await confirmLinkage({
                startupId,
                startupName,
                actorType: r.actorType,
                partnerType: r.partnerType,
                actorId: r.actorId,
                actorName: r.actorName,
                matchScore: r.matchScore,
                matchReason: r.matchReason,
              })
              showToast(`Linkage confirmed: ${r.actorName}`)
            }}
          />
        ))}
      </div>
    </section>
  )
}

export default function MatchResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  const [showModal, setShowModal] = useState(false)

  if (!state) {
    return (
      <>
        <Nav />
        <main className="container">
          <p>No match data found. <button className="back-btn" onClick={() => navigate('/startup')} type="button">← Go back</button></p>
        </main>
      </>
    )
  }

  const { startupId, startupName, matches } = state

  return (
    <>
      <Nav rightLabel="Admin Dashboard" rightHref="/admin" />
      <main className="container">
        <div className="results-header">
          <div>
            <h1 className="page-title">
              Matches for <span className="highlight">{startupName}</span>
            </h1>
            <p className="page-subtitle">AI-matched based on your profile. Confirm a match to save it as a structured linkage.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowModal(true)} type="button">
            Generate Slide Deck
          </button>
        </div>

        <MatchSection title="Mentors" results={matches.mentors} startupId={startupId} startupName={startupName} />
        <MatchSection title="Programmes" results={matches.programmes} startupId={startupId} startupName={startupName} />
        <MatchSection title="Corporate Partners" results={matches.corporatePartners} gridClass="card-grid-2" startupId={startupId} startupName={startupName} />
        <MatchSection title="Investors" results={matches.investors} gridClass="card-grid-2" startupId={startupId} startupName={startupName} />
        <MatchSection title="Service Providers" results={matches.serviceProviders} gridClass="card-grid-2" startupId={startupId} startupName={startupName} />
      </main>

      {showModal && (
        <SlideDeckModal
          startupName={startupName}
          matches={matches}
          onClose={() => setShowModal(false)}
        />
      )}

      <Toast />
    </>
  )
}
