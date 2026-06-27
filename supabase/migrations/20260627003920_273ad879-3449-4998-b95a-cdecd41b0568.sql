
-- Admin SELECT on email_send_log
CREATE POLICY "Admins can view email send log"
  ON public.email_send_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.email_send_log TO authenticated;

-- Admin SELECT + UPDATE on email_send_state
CREATE POLICY "Admins can view email send state"
  ON public.email_send_state FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update email send state"
  ON public.email_send_state FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, UPDATE ON public.email_send_state TO authenticated;

-- Admin SELECT on suppressed_emails
CREATE POLICY "Admins can view suppressed emails"
  ON public.suppressed_emails FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.suppressed_emails TO authenticated;

-- Admin SELECT on email_unsubscribe_tokens
CREATE POLICY "Admins can view unsubscribe tokens"
  ON public.email_unsubscribe_tokens FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.email_unsubscribe_tokens TO authenticated;
