# Server Component Coding Standards

These rules are mandatory for all Server Components in this project. They
exist to keep routing code correct given this app's Next.js version.

## `params` (and `searchParams`) MUST be awaited

- In this project, `params` passed to a page, layout, or route segment is a
  **`Promise`**, not a plain object. The same applies to `searchParams`.
- **Always type `params` as `Promise<{ ... }>`** and `await` it before use:

  ```ts
  export default async function Page({
    params,
  }: {
    params: Promise<{ workoutId: string }>
  }) {
    const { workoutId } = await params
    // ...
  }
  ```

- Do not destructure or access fields directly off `params` (e.g.
  `params.workoutId`) without awaiting it first — this will not work and
  must not be used as a shortcut.
- Do not add synchronous fallback handling (e.g. checking whether `params` is
  already a plain object) for backwards compatibility. `params` is always a
  `Promise` here; there is no dual-mode support to account for.
