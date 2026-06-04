CREATE OR REPLACE FUNCTION public.force_pending_order_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.status := 'pending'::public.order_status;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS force_pending_order_status_trg ON public.orders;
CREATE TRIGGER force_pending_order_status_trg
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.force_pending_order_status();

DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(path) BETWEEN 1 AND 2048
  AND (session_id IS NULL OR char_length(session_id) <= 128)
  AND (referrer IS NULL OR char_length(referrer) <= 2048)
  AND (user_agent IS NULL OR char_length(user_agent) <= 500)
  AND (
    (auth.role() = 'anon' AND user_id IS NULL)
    OR (auth.role() = 'authenticated' AND (user_id IS NULL OR user_id = auth.uid()))
  )
);