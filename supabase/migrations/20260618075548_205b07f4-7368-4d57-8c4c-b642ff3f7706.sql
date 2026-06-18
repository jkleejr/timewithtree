CREATE OR REPLACE FUNCTION public.notify_customer_on_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  service_key text;
  fn_url text;
BEGIN
  -- Only fire when status actually changes
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'email_queue_service_role_key'
  LIMIT 1;

  IF service_key IS NULL THEN
    RAISE WARNING 'notify_customer_on_status_change: missing vault key';
    RETURN NEW;
  END IF;

  fn_url := 'https://eceyckeatlcdlxpehbod.supabase.co/functions/v1/notify-order-status-change';

  PERFORM net.http_post(
    url := fn_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_key
    ),
    body := jsonb_build_object(
      'order_id', NEW.id,
      'old_status', OLD.status,
      'new_status', NEW.status
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notify_customer_on_status_change_trg ON public.orders;
CREATE TRIGGER notify_customer_on_status_change_trg
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.notify_customer_on_status_change();