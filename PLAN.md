# Cradle Portal — Build Plan

## Overview

A web app that solves Cradle's three core linkage problems — mentor matching, programme eligibility, and partner reuse — through an AI-powered matching engine backed by Firebase.

---

## The 3 Problems Being Solved

| # | Linkage | Current Pain | Goal |
|---|---------|-------------|------|
| 1 | Mentor → Company | Matches live in staff heads/Excel, never stored | AI-matched, saved as structured entity |
| 2 | Company → Programme | Manual reading of 200+ applications takes weeks | Automatic eligibility engine |
| 3 | Partner → Initiative | Cold calls repeat every initiative, agreements buried in PDFs | Partnerships stored as reusable assets |

---

## Actor Model

| Actor | Role | Demo Coverage |
|-------|------|---------------|
| Company | Startup submitting for matches | Cofounder profile form |
| Mentor | Individual advisor matched to startup | Seed data, managed by Cradle |
| Partner — Corporate | Pilots, distribution, APIs | Seed data, managed by Cradle |
| Partner — Investor | Funding, deal flow, fundraising readiness | Seed data, managed by Cradle |
| Partner — Service Provider | Legal, accounting, cloud credits, regulatory | Seed data, managed by Cradle |
| Programme Administrator | Day-to-day programme ops | Cradle staff portal |
| Programme Owner | Creates and owns a programme | Cradle staff portal |
| Ecosystem Administrator | Top-level Cradle admin, full access | Cradle staff portal |

---

## Tech Stack

| Layer | Tool | Reason |
|-------|------|--------|
| Frontend | React (Vite) + plain CSS | Component-ready, fast to build |
| AI Matching | Gemini API (Google AI Studio) | Free tier, strong reasoning |
| Web Search | Gemini Grounding / Google Search API | Enriches startup context |
| Database | Firebase Firestore | Flexible schema, real-time queries |
| Hosting | Firebase Hosting | One-command deploy |
| Slides Output | Gemini → rendered HTML | No extra tooling needed |

---

## Data Model

### Seeded Entities (Static JSON)

Five seed lists loaded at runtime — no DB writes needed for seed data.

**Mentors**
```json
{
  "id": "mentor_001",
  "name": "Ahmad Razif",
  "expertise": ["fintech", "payments"],
  "background": "Ex-VP at Maybank, built cross-border payment products",
  "industries": ["fintech", "banking"],
  "startup_stage": ["pre-seed", "seed"],
  "availability": "2 sessions/month",
  "location": "Kuala Lumpur"
}
```

**Programmes**
```json
{
  "id": "programme_001",
  "name": "CIP Accelerate",
  "type": "accelerator",
  "focus_industries": ["fintech", "healthtech"],
  "eligibility": { "stage": ["seed"], "min_team_size": 2, "must_be_malaysian": true },
  "funding_amount": 500000,
  "benefits": ["mentorship", "lab access", "investor intros"],
  "next_intake": "2026-Q3",
  "owner": "Cradle"
}
```

**Partners — Corporate** (`partner_type: "corporate"`)
```json
{
  "id": "partner_corp_001",
  "partner_type": "corporate",
  "name": "Mastercard",
  "industries_interested": ["fintech", "payments"],
  "what_they_offer": ["pilot program", "API access", "co-marketing"],
  "past_initiatives": ["Mastercard Fintech Express 2025"],
  "suitable_for_stage": ["seed", "series-a"],
  "contact_type": "partnership"
}
```

**Partners — Investor** (`partner_type: "investor"`)
```json
{
  "id": "partner_inv_001",
  "partner_type": "investor",
  "name": "Openspace Ventures",
  "industries": ["fintech", "saas", "healthtech"],
  "investment_stage": ["seed", "series-a"],
  "ticket_size_min": 500000,
  "ticket_size_max": 3000000,
  "investment_thesis": "B2B tech with SEA expansion potential",
  "portfolio_companies": ["Funding Societies", "Doctor Anywhere"],
  "contact_type": "warm intro only"
}
```

**Partners — Service Provider** (`partner_type: "service_provider"`)
```json
{
  "id": "partner_svc_001",
  "partner_type": "service_provider",
  "name": "Wong & Partners",
  "service_type": "legal",
  "what_they_offer": ["startup incorporation", "term sheet review", "IP filing"],
  "pricing_model": "discounted",
  "suitable_for_stage": ["pre-seed", "seed"],
  "contact_type": "referral"
}
```

### Firestore Collections

#### `startups`
Stores cofounder profile submissions.

```json
{
  "startup_id": "startup_001",
  "cofounder_name": "Jane Lim",
  "startup_name": "PayEase",
  "industry": "fintech",
  "stage": "seed",
  "problem": "Cross-border payments for SMEs",
  "needs": ["mentorship", "funding", "pilot partners"],
  "created_at": "2026-05-16T09:00:00Z"
}
```

#### `linkages` (single fact table)
One row per confirmed match. `actor_type` differentiates all actor kinds. For partners, `partner_type` narrows the subtype.

```json
{
  "linkage_id": "lnk_20260516_001",
  "startup_id": "startup_001",
  "startup_name": "PayEase",
  "actor_type": "mentor",          // "mentor" | "programme" | "partner"
  "partner_type": null,            // "corporate" | "investor" | "service_provider" — only set when actor_type = "partner"
  "actor_id": "mentor_001",
  "actor_name": "Ahmad Razif",
  "match_score": 92,
  "match_reason": "Ahmad has fintech expertise and mentored 3 payment startups at seed stage",
  "status": "active",
  "programme_cycle": "Cohort 2026 Q3",
  "created_at": "2026-05-16T09:36:00Z",
  "outcome": null
}
```

---

## Screen-by-Screen Spec

### Screen 1 — Cofounder Profile Form

**Route:** `/index.html`

**Fields:**
- Cofounder name
- Startup name
- Industry (dropdown: fintech, healthtech, edtech, agritech, other)
- Stage (dropdown: pre-seed, seed, Series A, Series B+)
- Problem being solved (textarea)
- What help is needed (multi-select: mentorship, funding, pilot partners, networking)

**On Submit:**
1. Save profile to Firestore `startups` collection
2. Send profile + seed data to Gemini API
3. Redirect to Screen 2 with results

---

### Screen 2 — Match Results Page

**Route:** `/results.html?startup_id=xxx`

**Displays:**
- 3 Mentor cards (name, expertise, match score, match reason)
- 3 Programme cards (name, funding amount, eligibility reason, next intake)
- 2 Corporate Partner cards (name, what they offer, relevance reason)
- 2 Investor cards (name, ticket size, investment thesis snippet, relevance reason)
- 2 Service Provider cards (name, service type, pricing model, relevance reason)

**Each card has:**
- Match score badge (e.g. 92%)
- Match reason text (AI-generated)
- **"Confirm Linkage" button** → writes one row to Firestore `linkages`

**Bonus:**
- "Generate Slide Deck" button → calls Gemini, renders summary as HTML slides in a modal

---

### Screen 3 — Admin Dashboard

**Route:** `/admin.html`

**Features:**
- Filterable table of all linkages
- Filter by: `actor_type`, `partner_type`, `startup_name`, `status`, `programme_cycle`
- Columns: Startup | Actor Type | Partner Type | Actor Name | Match Score | Status | Date | Outcome
- Status badge (active / pending / closed)
- Export to CSV button (optional)

**Key queries the dashboard supports:**

| Filter | What Cradle sees |
|--------|-----------------|
| `actor_id = mentor_001` | All startups Ahmad has ever been linked to |
| `actor_type = programme, actor_name = CIP Accelerate` | All startups in that programme |
| `actor_type = partner, partner_type = corporate` | All corporate partner linkages |
| `actor_type = partner, partner_type = investor` | All investor linkages (deal flow view) |
| `actor_type = partner, partner_type = service_provider` | All service provider linkages |
| `actor_type = partner, actor_name = Mastercard` | All startups Mastercard is linked to |
| `startup_name = PayEase` | Everything PayEase is connected to |
| `status = active` | All live linkages right now |

---

## AI Matching Flow

```
Cofounder submits form
        ↓
Profile saved to Firestore
        ↓
Gemini receives:
  - Startup profile (JSON)
  - Full seed lists (mentors, programmes, partners)
  - Instruction: "Return top 3 mentor matches, top 3 programme matches,
    top 2 corporate partner matches, top 2 investor matches,
    top 2 service provider matches. For each: actor_id, actor_type,
    partner_type (if applicable), match_score (0–100),
    match_reason (2 sentences). Return as JSON only."
        ↓
Gemini returns structured JSON
        ↓
Results rendered on Screen 2
        ↓
User clicks "Confirm Linkage"
        ↓
Linkage entity written to Firestore
        ↓
Visible in Admin Dashboard
```

---

## Build Phases

### Phase 1 — Foundation (Day 1)
- [ ] Set up Firebase project (Firestore + Hosting)
- [ ] Create seed data JSON files (mentors, programmes, partners)
- [ ] Build Screen 1: profile form with Firestore write

### Phase 2 — AI Matching (Day 1–2)
- [ ] Integrate Gemini API
- [ ] Write matching prompt with seed data injection
- [ ] Parse and validate Gemini JSON response
- [ ] Build Screen 2: render match cards from response

### Phase 3 — Linkage Confirmation (Day 2)
- [ ] Wire "Confirm Linkage" button to Firestore write
- [ ] Generate `linkage_id` (timestamp-based)
- [ ] Show confirmation toast / state change on card

### Phase 4 — Admin Dashboard (Day 2–3)
- [ ] Build Screen 3: fetch and display all linkages
- [ ] Add filter controls (actor_type, startup_name, status)
- [ ] Style table with status badges and match score colouring

### Phase 5 — Polish & Bonus (Day 3)
- [ ] Slide deck generation (Gemini → HTML modal)
- [ ] Loading states and error handling
- [ ] Firebase Hosting deploy
- [ ] Final demo run-through

---

## Demo Script

1. Open Screen 1 → fill in a fintech seed-stage startup
2. Submit → watch AI process (show loading state)
3. Screen 2 loads with 3 mentors, 3 programmes, 2 partners
4. Confirm 2–3 linkages
5. Open Admin Dashboard → show the confirmed linkages as structured rows
6. Filter by `actor_type = mentor` → proves reusability
7. (Bonus) Generate slide deck → show the HTML summary

**Core narrative:** *"Every match is now a structured entity — not an email, not an Excel row, not someone's memory."*

---

## Open Questions / Decisions Needed

| Question | Options | Recommendation |
|----------|---------|---------------|
| Auth for admin dashboard? | None (demo), Firebase Auth, password-protect | Skip for demo, add note |
| How many seed records per category? | 3–5 each is enough | 3 mentors, 3 programmes, 3 partners |
| Gemini model to use? | `gemini-1.5-flash` (fast/free) vs `gemini-1.5-pro` | Flash for demo speed |
| Web search enrichment? | Grounding on/off | Off for demo simplicity, toggle as bonus |
| Slide deck format? | HTML modal, new tab, downloadable PDF | HTML modal (simplest) |