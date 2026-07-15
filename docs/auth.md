# Auth Coding Standards

These rules are mandatory for all authentication and authorization work in
this project. They exist to keep auth consistent, auditable, and secure.

## Auth provider: Clerk ONLY

- **This app uses [Clerk](https://clerk.com/) (`@clerk/nextjs`) for all
  authentication.** Do not introduce another auth library, a hand-rolled
  auth/session system, or a competing pattern (e.g. NextAuth/Auth.js,
  custom JWT handling, custom cookie-based sessions).
- Do not hand-roll sign-in/sign-up forms, session management, or password
  handling. Use Clerk's components and APIs for all of this.

## Route protection: `clerkMiddleware` in `src/proxy.ts`

- Route access control is centralized in `src/proxy.ts` via
  `clerkMiddleware` and `createRouteMatcher`.
- Public (unauthenticated) routes are declared in the `isPublicRoute`
  matcher. Any new route that must be reachable without auth must be added
  there explicitly — routes are protected by default.
- All other routes are protected by calling `auth.protect()` inside the
  middleware. Do not implement route protection ad hoc in individual pages,
  layouts, or Route Handlers as a substitute for this.

## Server-side auth checks: `auth()` from `@clerk/nextjs/server`

- In Server Components and Server Actions, get the current user via
  `const { userId } = await auth()` from `@clerk/nextjs/server`.
- A page that requires a signed-in user must check `userId` and `redirect`
  to `/sign-in` if it is missing, even though middleware also protects the
  route — see `src/app/dashboard/page.tsx` for the standard pattern:

  ```ts
  import { auth } from "@clerk/nextjs/server"
  import { redirect } from "next/navigation"

  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  ```

- `userId` is the current user's identity and must be passed into `/data`
  helper functions to scope queries to that user (see
  [`/docs/data-fetching.md`](./data-fetching.md) — a user may only ever
  access their own data). Never trust a client-supplied user/account ID
  instead of the `userId` from `auth()`.

## Client-side auth UI: Clerk components only

- Use Clerk's prebuilt components for auth UI: `<SignIn />`, `<SignUp />`,
  `<SignInButton />`, `<SignUpButton />`, `<UserButton />`, and `<Show />`
  (for conditionally rendering signed-in vs signed-out UI), as done in
  `src/app/layout.tsx` and the `sign-in` / `sign-up` pages.
- Do not build custom sign-in/sign-up forms or custom
  signed-in/signed-out conditional logic (e.g. hand-rolled checks against a
  user object) — use `<Show when="signed-in">` / `<Show when="signed-out">`
  instead.
- The whole app is wrapped in a single `<ClerkProvider>` in
  `src/app/layout.tsx`. Do not add additional/nested `ClerkProvider`s.
- Sign-in and sign-up pages live at `src/app/sign-in/[[...sign-in]]/page.tsx`
  and `src/app/sign-up/[[...sign-up]]/page.tsx` using Clerk's catch-all
  route convention. Do not create alternate auth routes.

## Combine with data-fetching rules

- Auth checks belong in Server Components/Server Actions per
  [`/docs/data-fetching.md`](./data-fetching.md) — do not fetch the current
  user or perform auth checks in Client Components, Route Handlers, or via
  client-side `fetch`.
