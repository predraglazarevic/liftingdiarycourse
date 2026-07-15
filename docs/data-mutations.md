# Data Mutation Standards

These rules are mandatory for all data mutations (creating, updating, or
deleting data) in this project. They exist to keep mutations consistent,
auditable, type-safe, and secure.

## All mutations MUST go through Server Actions

- **All data mutations must be performed via Next.js Server Actions.** No
  Route Handlers (`app/**/route.ts`), no client-side `fetch` calls to an API
  endpoint, and no other mechanism may be used to mutate data.
- Server Actions must live in a colocated file named **`actions.ts`**,
  placed next to the route segment or feature that uses them (e.g.
  `src/app/workouts/actions.ts`). Do not scatter Server Actions across
  arbitrary files or names.
- Each file must start with `"use server"`.

## Server Action parameters MUST be typed, not `FormData`

- **Server Actions must accept explicitly typed parameters.** Define a
  TypeScript type/interface (or infer it from the Zod schema, see below) for
  every parameter — do not type parameters as `any` or leave them implicit.
- **Server Actions must NOT accept `FormData` as a parameter type.** Do not
  write actions like `async function createSet(formData: FormData)`. Instead,
  call the action with plain, explicitly typed arguments (e.g. from a
  client component that has already parsed form state into a typed object).

## Server Actions MUST validate arguments with Zod

- **Every Server Action must validate all of its incoming arguments using
  Zod** before doing anything else with them (before calling a `/data`
  helper, before touching the database).
- Define a Zod schema per action (or shared across closely related actions)
  and parse/validate the arguments at the top of the action body — e.g. via
  `schema.parse(args)` or `schema.safeParse(args)`. If validation fails, the
  action must return/throw an error and must not proceed to call any
  database helper.
- Do not skip validation because the caller is "trusted" (e.g. a Server
  Component or a form in the same app) — Server Actions are public HTTP
  endpoints and must validate every call.

## Mutations MUST go through `/data` helper functions

- **All database mutations (inserts, updates, deletes) must be performed via
  helper functions defined in the `src/data` directory.** Server Actions
  must call these helpers — they must not construct or run mutation queries
  inline within `actions.ts`.
- These helper functions **must use Drizzle ORM** to perform the mutation.
- **Do NOT use raw SQL.** No `sql\`...\`` template escapes, no raw driver
  queries. Use Drizzle's query builder exclusively.
- A Server Action's job is to: validate input with Zod, call the appropriate
  `/data` helper(s) with the validated, typed arguments, and handle the
  result (e.g. revalidate a path/tag, return a success/error value). It
  should not contain Drizzle query logic itself.

## A user may ONLY mutate their own data

- Every `/data` mutation helper that writes user-owned data must take the
  current user's identity (e.g. user ID from the authenticated session) and
  scope the mutation accordingly (e.g. a `where` clause matching the owning
  user ID column, or setting the owning user ID column on insert). Never
  rely solely on a client-supplied ID to identify which row to update or
  delete without also constraining the query to the current user.
- Do not add "admin" or "debug" mutation helpers that bypass this scoping
  unless explicitly required and reviewed — such helpers are a common source
  of cross-user data corruption or leaks.

## Do NOT call `redirect()` inside Server Actions

- **Server Actions must not call Next.js's `redirect()`.** Perform redirects
  client-side instead: call the Server Action from a Client Component, await
  its result, and once it resolves successfully, redirect with the
  `useRouter()` hook (e.g. `router.push(...)`).
- A Server Action should just do its work (validate, mutate, revalidate) and
  return a typed result (e.g. `{ success: true, ... }` / `{ success: false,
  error: ... }`) for the caller to act on.

## Example shape

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkoutSet } from "@/data/workout-sets";

const createSetSchema = z.object({
  workoutId: z.string().uuid(),
  exercise: z.string().min(1),
  reps: z.number().int().positive(),
  weightKg: z.number().positive(),
});

type CreateSetArgs = z.infer<typeof createSetSchema>;

export async function createSetAction(args: CreateSetArgs) {
  const parsed = createSetSchema.safeParse(args);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten() };
  }

  await createWorkoutSet(parsed.data);

  return { success: true };
}
```

```ts
// src/data/workout-sets.ts
import { db } from "@/db";
import { workoutSets } from "@/db/schema";
import { getCurrentUserId } from "@/lib/auth";

export async function createWorkoutSet(args: {
  workoutId: string;
  exercise: string;
  reps: number;
  weightKg: number;
}) {
  const userId = await getCurrentUserId();

  return db.insert(workoutSets).values({
    ...args,
    userId,
  });
}
```
