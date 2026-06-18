ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipped_email_sent_at timestamptz;
DROP TRIGGER IF EXISTS trg_notify_customer_on_status_change ON public.orders;
DROP TRIGGER IF EXISTS notify_customer_on_status_change ON public.orders;