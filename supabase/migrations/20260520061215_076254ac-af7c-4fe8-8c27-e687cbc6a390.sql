
-- 1. Roles enum and table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- 2. has_role security definer function (avoids RLS recursion)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- 3. RLS for user_roles
create policy "Users can view their own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can view all roles"
on public.user_roles for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- 4. Page views table
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_page_views_created_at on public.page_views(created_at desc);
create index idx_page_views_path on public.page_views(path);
create index idx_page_views_session on public.page_views(session_id);

alter table public.page_views enable row level security;

-- Anyone (including anonymous) can log a page view
create policy "Anyone can insert page views"
on public.page_views for insert
to anon, authenticated
with check (true);

-- Only admins can read
create policy "Admins can read page views"
on public.page_views for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- 5. Update handle_new_user to auto-grant admin role to the 3 specified emails
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_emails text[] := array['jklwjr@gmail.com', 'arminko2023@gmail.com', 'bj.euphoria@gmail.com'];
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  );

  -- Grant admin role if email is in the allowlist
  if lower(new.email) = any(admin_emails) then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;

  -- Always grant base 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

-- Ensure trigger exists on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Backfill: grant admin role to any of the 3 emails that already exist
insert into public.user_roles (user_id, role)
select u.id, 'admin'::app_role
from auth.users u
where lower(u.email) in ('jklwjr@gmail.com', 'arminko2023@gmail.com', 'bj.euphoria@gmail.com')
on conflict (user_id, role) do nothing;
