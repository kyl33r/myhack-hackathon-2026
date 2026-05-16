import { useState } from 'react'
import Nav from '../../components/Nav'
import LinkageTable from '../../components/LinkageTable'
import useLinkages from '../../hooks/useLinkages'
import type { ActorType, PartnerType } from '../../types'

interface Filters {
  actorType: ActorType | ''
  partnerType: PartnerType | ''
  startup: string
  status: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { linkages, loading, error } = useLinkages()
  const [filters, setFilters] = useState<Filters>({ actorType: '', partnerType: '', startup: '', status: '' })

  function handleFilter(field: keyof Filters, value: string) {
    setFilters(f => ({ ...f, [field]: value }))
  }

  const filtered = linkages.filter(l =>
    (!filters.actorType   || l.actorType === filters.actorType) &&
    (!filters.partnerType || l.partnerType === filters.partnerType) &&
    (!filters.startup     || l.startupName.toLowerCase().includes(filters.startup.toLowerCase())) &&
    (!filters.status      || l.status === filters.status)
  )

  function exportCSV() {
    const header = ['Startup', 'Actor Type', 'Partner Type', 'Actor Name', 'Match Score', 'Status', 'Date', 'Outcome']
    const rows = filtered.map(l => [
      l.startupName, l.actorType, l.partnerType ?? '', l.actorName,
      `${l.matchScore}%`, l.status, l.createdAt.slice(0, 10), l.outcome ?? '—',
    ])
    const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv,' + encodeURIComponent(csv)
    a.download = 'linkages.csv'
    a.click()
  }

  return (
    <>
      <Nav rightLabel="+ New Submission" rightHref="/" />
      <main className="container">
        <div className="results-header">
          <div>
            <h1 className="page-title">Linkage Dashboard</h1>
            <p className="page-subtitle">All confirmed matches across mentors, programmes, and partners.</p>
          </div>
          <button className="btn btn-secondary" onClick={exportCSV}>Export CSV</button>
        </div>

        <section className="filters-bar">
          <div className="filter-group">
            <label htmlFor="f-actor">Actor Type</label>
            <select id="f-actor" value={filters.actorType} onChange={e => handleFilter('actorType', e.target.value)}>
              <option value="">All</option>
              <option value="mentor">Mentor</option>
              <option value="programme">Programme</option>
              <option value="partner">Partner</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="f-partner">Partner Type</label>
            <select id="f-partner" value={filters.partnerType} onChange={e => handleFilter('partnerType', e.target.value)}>
              <option value="">All</option>
              <option value="corporate">Corporate</option>
              <option value="investor">Investor</option>
              <option value="service_provider">Service Provider</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="f-startup">Startup Name</label>
            <input id="f-startup" type="text" placeholder="Search startup…" value={filters.startup} onChange={e => handleFilter('startup', e.target.value)} />
          </div>
          <div className="filter-group">
            <label htmlFor="f-status">Status</label>
            <select id="f-status" value={filters.status} onChange={e => handleFilter('status', e.target.value)}>
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </section>

        {error && <p className="field-error visible" style={{ marginBottom: '1rem' }}>{error}</p>}

        <section className="table-section">
          {loading
            ? <div className="empty-state">Loading linkages…</div>
            : <LinkageTable linkages={filtered} />
          }
        </section>
      </main>
    </>
  )
}
