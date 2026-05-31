
-- 1) Validation trigger for orders: ensure subtotal > 0 and matches items
CREATE OR REPLACE FUNCTION public.validate_order_amounts()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  computed_total numeric(12,2) := 0;
  item jsonb;
  qty numeric;
  unit numeric;
  line numeric;
BEGIN
  IF NEW.subtotal IS NULL OR NEW.subtotal <= 0 THEN
    RAISE EXCEPTION 'Invalid subtotal: must be greater than zero';
  END IF;

  IF NEW.items IS NULL OR jsonb_typeof(NEW.items) <> 'array' OR jsonb_array_length(NEW.items) = 0 THEN
    RAISE EXCEPTION 'Invalid items: must be a non-empty array';
  END IF;

  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    qty  := COALESCE((item->>'quantity')::numeric, 0);
    unit := COALESCE((item->>'unit_price')::numeric, 0);
    line := COALESCE((item->>'line_total')::numeric, qty * unit);

    IF qty <= 0 OR unit <= 0 OR line <= 0 THEN
      RAISE EXCEPTION 'Invalid item amount: quantity, unit_price, and line_total must be positive';
    END IF;

    IF round(line, 2) <> round(qty * unit, 2) THEN
      RAISE EXCEPTION 'Invalid item line_total: does not match quantity * unit_price';
    END IF;

    computed_total := computed_total + line;
  END LOOP;

  IF round(computed_total, 2) <> round(NEW.subtotal, 2) THEN
    RAISE EXCEPTION 'Invalid subtotal: does not match sum of item line totals';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_order_amounts_trg ON public.orders;
CREATE TRIGGER validate_order_amounts_trg
  BEFORE INSERT OR UPDATE OF subtotal, items ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.validate_order_amounts();

-- 2) After-insert trigger: notify admins server-side via pg_net using vault key
CREATE OR REPLACE FUNCTION public.notify_admin_on_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  service_key text;
  fn_url text;
BEGIN
  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'email_queue_service_role_key'
  LIMIT 1;

  IF service_key IS NULL THEN
    RAISE WARNING 'notify_admin_on_new_order: missing vault key';
    RETURN NEW;
  END IF;

  fn_url := 'https://eceyckeatlcdlxpehbod.supabase.co/functions/v1/notify-admin-order';

  PERFORM net.http_post(
    url := fn_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object('order_id', NEW.id)
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_admin_on_new_order_trg ON public.orders;
CREATE TRIGGER notify_admin_on_new_order_trg
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_on_new_order();
