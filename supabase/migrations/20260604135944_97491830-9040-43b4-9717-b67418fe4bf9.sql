DROP FUNCTION IF EXISTS public.lookup_order(text, text);

CREATE OR REPLACE FUNCTION public.lookup_order(p_order_number text, p_email text)
RETURNS TABLE (
  id uuid,
  order_number text,
  user_id uuid,
  customer_name text,
  customer_phone text,
  customer_email text,
  shipping_address text,
  postal_code text,
  items jsonb,
  subtotal numeric,
  currency text,
  status order_status,
  customer_note text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, order_number, user_id, customer_name, customer_phone,
         customer_email, shipping_address, postal_code,
         items, subtotal, currency, status, customer_note,
         created_at, updated_at
  FROM public.orders
  WHERE order_number = p_order_number
    AND lower(customer_email) = lower(p_email)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_order(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.lookup_order(text, text) TO anon, authenticated;