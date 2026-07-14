# Data Fetching Standards

These rules are mandatory for all data fetching in this project. They exist to
keep data access consistent, auditable, and secure.

## All data fetching MUST happen in Server Components

- **ALL data fetching within this app must be done via Server Components.**
  This is incredibly important and has no exceptions.
- Data must **NOT** be fetched via Route Handlers (`app/**/route.ts`).
- Data must **NOT** be fetched via Client Components (no `useEffect` +
  `fetch`, no client-side data libraries like SWR/React Query for initial
  loads, no `"use client"` component making its own data calls).
- Data must **NOT** be fetched via any other mechanism (middleware,
  getServerSideProps-style patterns, external API calls from the browser,
  etc.).
- If a screen needs data, fetch it in a Server Component (a page, layout, or
  a server component further down the tree) and pass it down as props. Client
  Components may receive data as props and handle interactivity, but they may
  not fetch data themselves.
- Mutations (creating/updating/deleting data) go through Server Actions, not
  Route Handlers and not client-side `fetch` calls to an API endpoint.

## Database access MUST go through `/data` helper functions

- **All database queries must be performed via helper functions defined in
  the `/data` directory.** Server Components and Server Actions must call
  these helpers — they must not construct or run queries inline.
- These helper functions **must use Drizzle ORM** to query the database.
- **Do NOT use raw SQL.** No `sql\`...\`` template escapes for querying
  application data, no raw driver queries. Use Drizzle's query builder /
  relational API exclusively.

## A user may ONLY access their own data

- **It is incredibly important that a logged-in user can only ever access
  their own data.** A user must never be able to read, list, update, or
  delete another user's data, under any circumstance.
- Every `/data` helper function that reads or writes user-owned data must
  take the current user's identity (e.g. user ID from the authenticated
  session) and scope its Drizzle query accordingly — typically via a `where`
  clause matching the owning user ID column. Never rely solely on a
  client-supplied ID (e.g. a record ID from a URL param or form field)
  without also constraining the query to the current user.
- Do not add "admin" or "debug" helpers that bypass this scoping unless
  explicitly required and reviewed — such helpers are a common source of
  cross-user data leaks.
