ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_tel text,
  ADD COLUMN IF NOT EXISTS recipient_name text,
  ADD COLUMN IF NOT EXISTS recipient_phone text,
  ADD COLUMN IF NOT EXISTS recipient_tel text,
  ADD COLUMN IF NOT EXISTS recipient_address text,
  ADD COLUMN IF NOT EXISTS recipient_postal_code text,
  ADD COLUMN IF NOT EXISTS delivery_message text,
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'bank_transfer',
  ADD COLUMN IF NOT EXISTS depositor_name text,
  ADD COLUMN IF NOT EXISTS bank_account text;