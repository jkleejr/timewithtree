-- Revoke EXECUTE from anon/authenticated on SECURITY DEFINER functions that should not be callable from clients.
-- Keep: public.lookup_order (intentional anon guest lookup), public.has_role (required by RLS policies for authenticated),
-- and public.claim_guest_orders (intentional authenticated call after sign-in).

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.force_pending_order_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_order_amounts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admin_on_new_order() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_customer_on_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
