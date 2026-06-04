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
  status public.order_status,
  customer_note text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.id,
    o.order_number,
    o.user_id,
    o.customer_name,
    o.customer_phone,
    o.customer_email,
    o.shipping_address,
    o.postal_code,
    o.items,
    o.subtotal,
    o.currency,
    o.status,
    o.customer_note,
    o.created_at,
    o.updated_at
  FROM public.orders AS o
  WHERE o.order_number = p_order_number
    AND lower(o.customer_email) = lower(p_email)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_order(text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.lookup_order(text, text) TO anon, authenticated;