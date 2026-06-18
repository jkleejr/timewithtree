# Fix Order Emails Not Sending

## Root cause

The `notify-admin-order` Edge Function (triggered by the DB on every new order) is failing to boot. Edge logs show repeatedly:

```
worker boot error: Unable to load .../@supabase/supabase-js/2.45.0/cors ... path not found
```

The line `import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'` is invalid — that subpath doesn't exist in the package. Because the function never boots, no admin notification email and no customer confirmation email are ever sent, even though templates and `send-transactional-email` are wired correctly.

Your email infrastructure is otherwise healthy: `notify.timewithtree.co.kr` is verified, templates (`new-order-admin`, `customer-order-confirmation`) exist, queue + cron exist.

## Plan

1. **Fix the CORS import** in `supabase/functions/notify-admin-order/index.ts` — declare `corsHeaders` inline (the standard Lovable pattern) instead of importing a non-existent subpath. No other logic changes.
2. **Redeploy** `notify-admin-order`.
3. **Verify** by placing a fresh test order, then:
   - Check edge logs for `notify-admin-order` → expect no boot errors and a 200 response.
   - Check `email_send_log` for two rows per order: one with `template_name = 'new-order-admin'` (to admin emails) and one `customer-order-confirmation` (to the customer), each with `status = 'sent'`.
   - Confirm both inboxes received the emails.
4. If `email_send_log` shows `pending` that never flips to `sent`, inspect `process-email-queue` logs next. If it shows `dlq` or `failed`, surface the `error_message`.

## Technical detail

Replacement snippet (top of file):

```ts
import { createClient } from 'npm:@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

Everything else in the function stays as-is.
