create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  description text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  code text not null,
  description text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, name),
  unique (organization_id, code)
);

create table public.designations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  code text not null,
  description text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, name),
  unique (organization_id, code)
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  employee_code text not null unique,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  date_of_birth date,
  gender text check (gender in ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY')),
  date_of_joining date not null,
  department_id uuid not null references public.departments(id) on delete restrict,
  designation_id uuid not null references public.designations(id) on delete restrict,
  manager_id uuid references public.employees(id) on delete set null,
  employment_type text not null check (employment_type in ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'ON_LEAVE')),
  profile_image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (manager_id is null or manager_id <> id)
);

create index departments_organization_idx on public.departments(organization_id);
create index designations_organization_idx on public.designations(organization_id);
create index employees_organization_idx on public.employees(organization_id);
create index employees_department_idx on public.employees(department_id);
create index employees_designation_idx on public.employees(designation_id);
create index employees_manager_idx on public.employees(manager_id);
create index employees_status_idx on public.employees(status);

alter table public.organizations enable row level security;
alter table public.departments enable row level security;
alter table public.designations enable row level security;
alter table public.employees enable row level security;

create or replace function public.current_employee_id() returns uuid language sql security definer set search_path = public as $$
  select id from public.employees where lower(email) = lower(auth.jwt() ->> 'email') limit 1;
$$;

create policy "HR admins manage organizations" on public.organizations for all to authenticated using (public.is_hr_admin()) with check (public.is_hr_admin());
create policy "HR admins manage departments" on public.departments for all to authenticated using (public.is_hr_admin()) with check (public.is_hr_admin());
create policy "HR admins manage designations" on public.designations for all to authenticated using (public.is_hr_admin()) with check (public.is_hr_admin());
create policy "People can read relevant employees" on public.employees for select to authenticated using (
  public.is_hr_admin() or lower(email) = lower(auth.jwt() ->> 'email') or manager_id = public.current_employee_id()
);
create policy "HR admins manage employees" on public.employees for all to authenticated using (public.is_hr_admin()) with check (public.is_hr_admin());