import type { Linkage, ActorType, PartnerType } from '../types'
import StatusBadge from './StatusBadge'

interface Props {
  linkages: Linkage[]
  filterActorType: string
  filterPartnerType: string
  filterStartup: string
  filterStatus: string
}

function scoreClass(score: number): string {
  if (score >= 85) return 'score-high'
  if (score >= 70) return 'score-mid'
  return 'score-low'
}

function actorTagClass(actorType: ActorType): string {
  if (actorType === 'mentor') return 'tag-mentor'
  if (actorType === 'programme') return 'tag-programme'
  return 'tag-corporate'
}

function partnerTagClass(partnerType: PartnerType): string {
  if (partnerType === 'corporate') return 'tag-corporate'
  if (partnerType === 'investor') return 'tag-investor'
  return 'tag-service'
}

function partnerLabel(partnerType: PartnerType): string {
  if (partnerType === 'corporate') return 'Corporate'
  if (partnerType === 'investor') return 'Investor'
  return 'Service Provider'
}

export default function LinkageTable({ linkages, filterActorType, filterPartnerType, filterStartup, filterStatus }: Props) {
  const filtered = linkages.filter(r => {
    if (filterActorType && r.actorType !== filterActorType) return false
    if (filterPartnerType && r.partnerType !== filterPartnerType) return false
    if (filterStartup && !r.startupName.toLowerCase().includes(filterStartup.toLowerCase())) return false
    if (filterStatus && r.status !== filterStatus) return false
    return true
  })

  return (
    <section className="table-section">
      <table className="linkage-table">
        <thead>
          <tr>
            <th>Startup</th>
            <th>Actor Type</th>
            <th>Partner Type</th>
            <th>Actor Name</th>
            <th>Match Score</th>
            <th>Status</th>
            <th>Date</th>
            <th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(row => (
            <tr key={row.linkageId}>
              <td>{row.startupName}</td>
              <td>
                <span className={`actor-tag ${actorTagClass(row.actorType)}`}>
                  {row.actorType.charAt(0).toUpperCase() + row.actorType.slice(1)}
                </span>
              </td>
              <td>
                {row.partnerType
                  ? <span className={`actor-tag ${partnerTagClass(row.partnerType)}`}>{partnerLabel(row.partnerType)}</span>
                  : <span className="text-muted">—</span>
                }
              </td>
              <td>{row.actorName}</td>
              <td><span className={`score-badge ${scoreClass(row.matchScore)}`}>{row.matchScore}%</span></td>
              <td><StatusBadge status={row.status} /></td>
              <td>{row.createdAt}</td>
              <td>{row.outcome}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <div className="empty-state">No linkages match your filters.</div>
      )}
    </section>
  )
}
