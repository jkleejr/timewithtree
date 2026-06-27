ALTER TABLE public.store_settings
  ADD COLUMN IF NOT EXISTS notify_admin_new_order boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_customer_shipped boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS notify_customer_order_confirmation boolean NOT NULL DEFAULT true;