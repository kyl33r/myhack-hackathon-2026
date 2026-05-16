import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../../components/Nav'
import LoadingOverlay from '../../components/LoadingOverlay'
import { submitPartnerProfile } from '../../services/api'

interface FormState {
  orgName: string
  contactName: string
  contactEmail: string
  industries: string[]
  offers: string[]
  stages: string[]
  pastInitiatives: string
}

const INDUSTRY_OPTIONS = ['fintech', 'healthtech', 'edtech', 'agritech', 'other']
const OFFER_OPTIONS = [
  { value: 'pilot', label: 'Pilot Program' },
  { value: 'api', label: 'API Access' },
  { value: 'distribution', label: 'Distribution' },
  { value: 'co-marketing', label: 'Co-marketing' },
  { value: 'credits', label: 'Credits / Resources' },
]
const STAGE_OPTIONS = ['pre-seed', 'seed', 'series-a', 'series-b']
const STAGE_LABELS: Record<string, string> = {
  'pre-seed': 'Pre-seed',
  'seed': 'Seed',
  'series-a': 'Series A',
  'series-b': 'Series B+',
}

export default function CorporateForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    orgName: '',
    contactName: '',
    contactEmail: '',
    industries: [],
    offers: [],
    stages: [],
    pastInitiatives: '',
  })
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  function handleCheckboxGroup(field: 'industries' | 'offers' | 'stages', value: string, checked: boolean) {
    setForm(f => ({
      ...f,
      [field]: checked ? [...f[field], value] : f[field].filter(v => v !== value),
    }))
  }

  function validate(): boolean {
    const newErrors: Partial<Record<string, string>> = {}
    if (!form.orgName.trim()) newErrors.orgName = 'This field is required.'
    if (!form.contactName.trim()) newErrors.contactName = 'This field is required.'
    if (!form.contactEmail.trim() || !form.contactEmail.includes('@')) newErrors.contactEmail = 'A valid email is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setSubmitError(null)
    try {
      await submitPartnerProfile({ ...form, partnerType: 'corporate' })
      setSubmitted(true)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <main className="container">
        <button className="back-btn" onClick={() => navigate('/partner')} type="button">← Back</button>
        <div className="card form-card">
          <div className="form-type-badge">
            <span className="actor-tag tag-corporate">Corporate Partner</span>
          </div>

          {submitted ? (
            <div className="success-box">
              <span className="success-icon">✅</span>
              <h3>Profile Submitted!</h3>
              <p>Cradle will review and activate your account within 5 working days.</p>
              <button className="btn btn-primary" onClick={() => navigate('/')} type="button" style={{ marginTop: '1rem' }}>
                Back to Home
              </button>
            </div>
          ) : (
            <>
              <h1 className="page-title">Register your organisation</h1>
              <p className="page-subtitle">Your profile will be reviewed by Cradle before being added to the ecosystem.</p>

              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="orgName">Organisation Name</label>
                  <input type="text" id="orgName" name="orgName" placeholder="e.g. Mastercard" value={form.orgName} onChange={handleChange} required />
                  {errors.orgName && <span className="field-error visible">{errors.orgName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactName">Contact Person</label>
                  <input type="text" id="contactName" name="contactName" placeholder="e.g. Sarah Lee" value={form.contactName} onChange={handleChange} required />
                  {errors.contactName && <span className="field-error visible">{errors.contactName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="contactEmail">Work Email</label>
                  <input type="email" id="contactEmail" name="contactEmail" placeholder="e.g. sarah@mastercard.com" value={form.contactEmail} onChange={handleChange} required />
                  {errors.contactEmail && <span className="field-error visible">{errors.contactEmail}</span>}
                </div>

                <div className="form-group">
                  <label>Industries Interested In</label>
                  <div className="checkbox-group">
                    {INDUSTRY_OPTIONS.map(opt => (
                      <label key={opt} className="checkbox-label">
                        <input type="checkbox" value={opt} checked={form.industries.includes(opt)} onChange={e => handleCheckboxGroup('industries', opt, e.target.checked)} />
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>What do you offer startups?</label>
                  <div className="checkbox-group">
                    {OFFER_OPTIONS.map(opt => (
                      <label key={opt.value} className="checkbox-label">
                        <input type="checkbox" value={opt.value} checked={form.offers.includes(opt.value)} onChange={e => handleCheckboxGroup('offers', opt.value, e.target.checked)} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Suitable Startup Stage</label>
                  <div className="checkbox-group">
                    {STAGE_OPTIONS.map(opt => (
                      <label key={opt} className="checkbox-label">
                        <input type="checkbox" value={opt} checked={form.stages.includes(opt)} onChange={e => handleCheckboxGroup('stages', opt, e.target.checked)} />
                        {STAGE_LABELS[opt]}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pastInitiatives">Past Initiatives (optional)</label>
                  <textarea id="pastInitiatives" name="pastInitiatives" rows={3} placeholder="e.g. Mastercard Fintech Express 2025, ASEAN Startup Program…" value={form.pastInitiatives} onChange={handleChange} />
                </div>

                {submitError && <p className="field-error visible">{submitError}</p>}

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit for Review'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
      <LoadingOverlay visible={loading} message="Submitting your profile…" sub="Cradle will review and activate your account" />
    </>
  )
}
