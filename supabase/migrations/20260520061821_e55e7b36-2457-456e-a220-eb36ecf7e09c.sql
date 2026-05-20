
-- Order status enum
create type public.order_status as enum ('pending', 'paid', 'shipped', 'cancelled');

-- Store settings (singleton row)
create table public.store_settings (
  id uuid primary key default gen_random_uuid(),
  bank_info text not null default '',
  updated_at timestamptz not null default now(),
  singleton boolean not null default true,
  unique (singleton)
);

insert into public.store_settings (bank_info) values ('');

alter table public.store_settings enable row level security;

create policy "Anyone can read store settings"
on public.store_settings for select
to anon, authenticated
using (true);

create policy "Admins can update store settings"
on public.store_settings for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ORD-' || to_char(now() at time zone 'Asia/Seoul', 'YYMMDD') || '-' || lpad((floor(random() * 10000))::text, 4, '0')),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  shipping_address text not null,
  postal_code text,
  items jsonb not null,
  subtotal numeric(12,2) not null,
  currency text not null default 'KRW',
  status order_status not null default 'pending',
  customer_note text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_created_at on public.orders(created_at desc);
create index idx_orders_status on public.orders(status);
create index idx_orders_user on public.orders(user_id);

alter table public.orders enable row level security;

-- Anyone (anon or logged in) can place an order
create policy "Anyone can place an order"
on public.orders for insert
to anon, authenticated
with check (true);

-- Logged-in users can view their own orders
create policy "Users can view their own orders"
on public.orders for select
to authenticated
using (auth.uid() = user_id);

-- Admins can view all orders
create policy "Admins can view all orders"
on public.orders for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Admins can update orders (mark as paid, shipped, etc.)
create policy "Admins can update orders"
on public.orders for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create trigger store_settings_set_updated_at
  before update on public.store_settings
  for each row execute function public.set_updated_at();
