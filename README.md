# OmniRoute HRMS

Production-oriented HRMS foundation built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui conventions, Lucide, TanStack Query, and Supabase.

## Local setup

Requirements: Node.js 20.9+ and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Phase 1 runs without Supabase credentials; add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local` when the backend is configured.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

The current release contains only the application foundation and placeholder module routes. Authentication and HR modules are intentionally deferred to later phases.
