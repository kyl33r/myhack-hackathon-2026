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

## Tech Stack

| Layer | Tool | Reason |
|-------|------|--------|
| Frontend | HTML/CSS + Vanilla JS | Fast to build, no framework overhead |
| AI Matching | Gemini API (Google AI Studio) | Free tier, strong reasoning |
| Web Search | Gemini Grounding / Google Search API | Enriches startup context |
| Database | Firebase Firestore | Flexible schema, real-time queries |
| Hosting | Firebase Hosting | One-command deploy |
| Slides Output | Gemini → rendered HTML | No extra tooling needed |

---

## Data Model

### Seeded Entities (Static JSON)

Three seed lists are loaded at runtime — no DB writes needed for seed data.

**Mentors** — fields: `id`, `name`, `expertise[]`, `background`, `industries[]`, `startup_stage[]`, `availability`, `location`

**Programmes** — fields: `id`, `name`, `type`, `focus_industries[]`, `eligibility{}`, `funding_amount`, `benefits[]`, `next_intake`

**Partners** — fields: `id`, `name`, `type`, `industries_interested[]`, `what_they_offer[]`, `past_initiatives[]`, `suitable_for_stage[]`, `contact_type`

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
One row per confirmed match. `actor_type` differentiates mentor / programme / partner.

```json
{
  "linkage_id": "lnk_20260516_001",
  "startup_id": "startup_001",
  "startup_name": "PayEase",
  "actor_type": "mentor",          // "mentor" | "programme" | "partner"
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
- 2 Partner cards (name, what they offer, relevance reason)

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
- Filter by: `actor_type`, `startup_name`, `status`, `programme_cycle`
- Columns: Startup | Actor Type | Actor Name | Match Score | Status | Date | Outcome
- Status badge (active / pending / closed)
- Export to CSV button (optional)

**Key queries the dashboard supports:**

| Filter | What Cradle sees |
|--------|-----------------|
| `actor_id = mentor_001` | All startups Ahmad has ever been linked to |
| `actor_type = programme, actor_name = CIP Accelerate` | All startups in that programme |
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
    top 2 partner matches. For each: actor_id, match_score (0–100),
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