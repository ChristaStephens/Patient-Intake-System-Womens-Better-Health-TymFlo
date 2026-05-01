# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Client: Better Women's Care

Practice info is in `artifacts/intake-form/src/lib/config.ts`.

### Brand Colors (ADA-compliant, WCAG AA)
- Deep Berry `#3d0e22` — titles, hover states (contrast on white ~14:1)
- Dark Rose `#6b1e3d` — primary buttons, section headers (contrast on white ~10.9:1)
- Brand Pink `#9b3060` — progress bar, step indicators, focus rings (contrast on white ~8.1:1)
- Light Pink `#c96090` — lighter accents, borders
- Blush `#f0c0d4` — background tints

### Form Structure (7 steps)
1. Personal Information — First Name, Last Name, DOB (required); Email, Phone (required)
2. Address — Street Address (required)
3. Provider & Visit
4. Clinical History — Past Medical, OB/GYN History, Menstrual History, Family History, Cancer History, Social/Behavioral questions
5. Emergency Contact
6. Insurance
7. Legal & Signature — Privacy Notice, Assignment of Benefits, Financial Responsibility, Insurance Waiver, Patient Certification + Signature

### Email
Office email placeholder: `office@betterwomenscare.com` — update in `config.ts` once provided.

### Video Tutorial
An animated 8-scene tutorial video is at `artifacts/intake-form-tutorial/` (previewPath `/intake-form-tutorial/`). Built with React + Framer Motion using the video-js skill. Covers all 7 form sections with TymFlo branding. The video is embedded as an iframe near the top of the Terms of Use page (`/terms`). Scene selector controls (jump to scene, loop current scene) render only when the video is in an iframe.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
