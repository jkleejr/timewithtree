CREATE OR REPLACE FUNCTION public.claim_guest_orders()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text;
  v_count integer := 0;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN 0;
  END IF;

  SELECT lower(email) INTO v_email FROM auth.users WHERE id = v_user_id;
  IF v_email IS NULL OR length(v_email) = 0 THEN
    RETURN 0;
  END IF;

  WITH updated AS (
    UPDATE public.orders
    SET user_id = v_user_id
    WHERE user_id IS NULL
      AND lower(customer_email) = v_email
    RETURNING 1
  )
  SELECT count(*) INTO v_count FROM updated;

  RETURN v_count;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_guest_orders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_guest_orders() TO authenticated;