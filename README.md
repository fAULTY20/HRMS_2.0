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

## Supabase setup

1. Create a Supabase project and apply `supabase/migrations/202608230001_create_profiles.sql` in the SQL Editor.
2. Create users in **Authentication > Users** with email confirmation as required by your project. Example development emails are `hr-admin@example.com`, `manager@example.com`, and `employee@example.com`; set their roles to `HR_ADMIN`, `MANAGER`, and `EMPLOYEE` in `public.profiles` after the trigger creates their profiles.
3. Copy the project URL and anon key into `.env.local` using `.env.example`. Never add passwords, service-role keys, or `.env.local` to source control.

Phase 3 adds `supabase/migrations/202608230002_create_people.sql`. Apply it after the profiles migration to create organizations, departments, designations, employees, indexes, foreign keys, and RLS policies. The People routes are `/people/employees`, `/people/departments`, `/people/designations`, and `/people/organizations`.
