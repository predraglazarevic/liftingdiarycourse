# Routing Coding Standards

These rules are mandatory for all routing work in this project.

## All app routes live under `/dashboard`

- Every feature route in this app must be nested under `/dashboard`
  (e.g. `/dashboard`, `/dashboard/workout/[workoutId]`). Do not add
  top-level route segments for app features.
- The only routes allowed outside `/dashboard` are the public,
  unauthenticated routes: `/`, `/sign-in`, `/sign-up`.

## `/dashboard` and all sub-routes are protected

- `/dashboard` and every route nested under it must only be reachable by
  a signed-in user.
- Do not implement this protection ad hoc per page/layout (e.g. custom
  `redirect` checks as the sole guard) — see below.

## Route protection is done via Next.js middleware, not per-page checks

- All route protection is centralized in `src/proxy.ts` via
  `clerkMiddleware` and `createRouteMatcher`, per
  [`/docs/auth.md`](./auth.md).
- `isPublicRoute` is the only place public routes are declared (`/`,
  `/sign-in(.*)`, `/sign-up(.*)`). Everything else — which includes all of
  `/dashboard` — is protected by `auth.protect()` in the middleware by
  default.
- When adding a new route under `/dashboard`, no middleware changes are
  needed — it is protected automatically since it isn't in
  `isPublicRoute`. Only routes that must be reachable without auth get
  added there.
- Per-page `auth()` + `redirect("/sign-in")` checks (see
  [`/docs/auth.md`](./auth.md)) are still required as defense-in-depth,
  but they are not a substitute for the middleware-based protection —
  never rely on a page-level check alone to protect a route.
