# Frontend Conventions

## Stack

React (Vite) + plain CSS. TypeScript optional but not required for hackathon speed.
Deployed via Firebase Hosting (build output from `dist/`).

## File Layout

```
frontend/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── seed/
│       ├── mentors.json
│       ├── programmes.json
│       └── partners.json
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Router root
    ├── pages/
    │   ├── ProfileForm.jsx     # Screen 1 — Cofounder profile form
    │   ├── MatchResults.jsx    # Screen 2 — Match results
    │   └── AdminDashboard.jsx  # Screen 3 — Admin dashboard
    ├── components/
    │   ├── MatchCard.jsx       # Reusable mentor/programme/partner card
    │   ├── StatusBadge.jsx     # Coloured status pill
    │   └── LinkageTable.jsx    # Admin table with filters
    ├── services/
    │   ├── api.js              # Fetch wrappers for backend calls
    │   └── firebase.js         # Firebase init + Firestore helpers
    ├── hooks/
    │   └── useLinkages.js      # Fetches and filters linkages for admin view
    └── styles/
        └── index.css
```

## Routing

Use `react-router-dom` with these routes:

| Path | Component |
|------|-----------|
| `/` | `ProfileForm` |
| `/results/:startupId` | `MatchResults` |
| `/admin` | `AdminDashboard` |

Pass `startupId` via route param, not query string.

## Component Conventions

- One component per file, named identically to the file (`MatchCard.jsx` → `export default MatchCard`).
- Pages live in `pages/`, reusable UI in `components/`.
- No business logic in components — data fetching and mutations go in `services/` or a custom hook.
- Props over global state; only lift state when two siblings need it.

## State & Async

- `useState` + `useEffect` is sufficient — no Redux or Zustand needed.
- Every async action must have three visible states:
  1. Loading — disable the triggering button, show a spinner or "Processing…" text
  2. Success — render results or show a toast
  3. Error — show an inline error message near the action that failed

## API Communication

All backend calls go through `src/services/api.js`.
Base URL is a single `const BASE_URL` at the top — change it once for local vs. deployed.

## Cards (Screen 2)

`MatchCard` receives: `name`, `matchScore`, `matchReason`, `actorType`, and an `onConfirm` callback.
After `onConfirm` resolves: set a local `confirmed` state, disable the button, change label to "Linked ✓". Never unmount the card on confirm.

## Admin Table (Screen 3)

Columns: Startup | Actor Type | Actor Name | Match Score | Status | Date | Outcome.
Filter state lives in `AdminDashboard` as controlled inputs; filtering is client-side over the fetched list.
Status badge colours: `active` → green, `pending` → yellow, `closed` → grey — handled by `StatusBadge`.

## Seed Data

Fetched from `/seed/mentors.json`, `/seed/programmes.json`, `/seed/partners.json` at runtime via `fetch()` in `api.js`.
Never import seed files directly into components.
