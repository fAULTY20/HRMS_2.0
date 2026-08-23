create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  role text not null default 'EMPLOYEE' check (role in ('HR_ADMIN', 'MANAGER', 'EMPLOYEE')),
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index profiles_role_idx on public.profiles(role);
alter table public.profiles enable row level security;

create or replace function public.is_hr_admin() returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'HR_ADMIN');
$$;

create or replace function public.current_profile_role() returns text language sql security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create policy "Users can read their own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "HR admins can read all profiles" on public.profiles for select to authenticated using (public.is_hr_admin());
create policy "Users can update their own non-role fields" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id and role = public.current_profile_role());
create policy "HR admins can manage profiles" on public.profiles for all to authenticated using (public.is_hr_admin()) with check (public.is_hr_admin());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email) values (new.id, new.raw_user_meta_data ->> 'full_name', new.email);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();