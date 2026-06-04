create or replace function public.lookup_order(p_order_number text, p_email text)
returns setof public.orders
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.orders
  where order_number = p_order_number
    and lower(customer_email) = lower(p_email)
  limit 1
$$;

revoke all on function public.lookup_order(text, text) from public;
grant execute on function public.lookup_order(text, text) to anon, authenticated;