# Frontend Conventions

## Stack

React 18 + TypeScript + Vite. Plain CSS (no CSS modules, no Tailwind).
Deployed via Firebase Hosting (build output: `dist/`).

## File Layout

```
frontend/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.development        # VITE_USE_STUB=true, VITE_API_BASE_URL=...
├── public/
│   └── seed/
│       ├── mentors.json
│       ├── programmes.json
│       └── partners.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── types.ts                # All shared TypeScript types and interfaces
    ├── pages/
    │   ├── ActorPicker.tsx
    │   ├── startup/
    │   │   ├── ProfileForm.tsx
    │   │   └── MatchResults.tsx
    │   ├── partner/
    │   │   ├── PartnerTypePicker.tsx
    │   │   ├── CorporateForm.tsx
    │   │   ├── InvestorForm.tsx
    │   │   └── ServiceProviderForm.tsx
    │   ├── staff/
    │   │   └── StaffLogin.tsx
    │   └── admin/
    │       └── AdminDashboard.tsx
    ├── components/
    │   ├── Nav.tsx
    │   ├── ActorCard.tsx
    │   ├── MatchCard.tsx
    │   ├── StatusBadge.tsx
    │   ├── LinkageTable.tsx
    │   ├── LoadingOverlay.tsx
    │   └── Toast.tsx
    ├── services/
    │   ├── api.ts              # Single API surface — checks VITE_USE_STUB
    │   └── stubs.ts            # Stub implementations returning mock data
    ├── hooks/
    │   └── useLinkages.ts
    └── styles/
        └── index.css
```

## TypeScript

- All files use `.tsx` for components, `.ts` for non-JSX modules.
- No `any`. Use `unknown` and narrow, or define a proper type in `types.ts`.
- All shared types (API payloads, Firestore shapes, seed data) go in `src/types.ts`.
- Component props are typed inline as `interface Props` above the component.

## Routing

`react-router-dom` v6 with these routes:

| Path | Component |
|------|-----------|
| `/` | `ActorPicker` |
| `/startup` | `ProfileForm` |
| `/startup/results` | `MatchResults` (receives startup via `location.state`) |
| `/partner` | `PartnerTypePicker` |
| `/partner/corporate` | `CorporateForm` |
| `/partner/investor` | `InvestorForm` |
| `/partner/service` | `ServiceProviderForm` |
| `/staff/login` | `StaffLogin` |
| `/admin` | `AdminDashboard` |

Pass data between pages using `useNavigate` with `state`, not query strings.

## Component Conventions

- One component per file, named identically to the file (`MatchCard.tsx` → `export default MatchCard`).
- Pages in `pages/`, reusable UI in `components/`.
- No API calls or business logic inside components — use `services/api.ts` or a custom hook.
- Props over global state; lift state only when two siblings need it.

## State & Async

- `useState` + `useEffect` only — no Redux or Zustand.
- Every async action must have three visible states: loading, success, error.
- Loading: disable the triggering button and show a spinner.
- Error: show inline message near the failed action, never silently swallow.

## Stub / Real API Toggle

All backend calls go through `src/services/api.ts`.
`api.ts` reads `import.meta.env.VITE_USE_STUB`:
- `"true"` → delegates to `stubs.ts` (returns mock data after a fake 1–2s delay)
- anything else → fetches from `import.meta.env.VITE_API_BASE_URL`

To wire up the real backend: set `VITE_USE_STUB=false` in `.env.development`. No component changes needed.

## Cards (MatchResults)

`MatchCard` receives: `name`, `matchScore`, `matchReason`, `actorType`, `partnerType`, and an `onConfirm` callback.
After confirm resolves: set local `confirmed` state, disable button, change label to "Linked ✓".

## Admin Table

Client-side filtering over the fetched linkages list. Filter state lives in `AdminDashboard` as controlled inputs.
`StatusBadge` handles colour: `active` → green, `pending` → yellow, `closed` → grey.
