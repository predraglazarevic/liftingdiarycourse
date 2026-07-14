# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Next.js 16 — do not rely on training data

This project uses **Next.js 16.2.10** with React 19.2.4 and the App Router. Next.js 16 has breaking changes and new conventions vs. earlier versions your training data likely reflects. Before writing routing, data-fetching, caching, or config code, check `node_modules/next/dist/docs/` (mirrors nextjs.org/docs), especially:

- `01-app/01-getting-started/18-upgrading.md` and `01-app/02-guides/upgrading/version-16.md` for the v16 changelog
- `01-app/02-guides/migrating-to-cache-components.md` for the new caching model
- `01-app/01-getting-started/` for current file-convention and data-fetching patterns

Notable v16 specifics already reflected in this repo's config:
- **Turbopack is the default bundler** for both `next dev` and `next build`. Use `--webpack` to opt out.
- **`next build` no longer runs the linter.** Lint is a separate step (`npm run lint`), configured via `eslint.config.mjs` (flat config), not `next lint`.

## Commands

```bash
npm run dev     # start dev server (Turbopack, http://localhost:3000)
npm run build   # production build (Turbopack)
npm run start   # start production server (requires build first)
npm run lint    # run ESLint (eslint.config.mjs, flat config)
```

There is no test runner configured in this project.

## Architecture

This is a freshly-bootstrapped `create-next-app` project (App Router, TypeScript, Tailwind CSS v4, `src/` directory) with no custom application code yet — only the default scaffold (`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`).

- Import alias `@/*` maps to `src/*` (see `tsconfig.json`).
- Styling is Tailwind CSS v4 via `@tailwindcss/postcss` (see `postcss.config.mjs`), not a `tailwind.config.js`-based v3 setup.
- As real features (e.g. lifting/workout tracking) are added, prefer extending `src/app/` with route segments and colocated components per the App Router conventions documented in `node_modules/next/dist/docs/01-app/`.
