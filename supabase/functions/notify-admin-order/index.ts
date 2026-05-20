import { createClient } from 'npm:@supabase/supabase-js@2.45.0'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const ADMIN_EMAILS = [
  'timewithtree@gmail.com',
  'jklwjr@gmail.com',
  'arminko2023@gmail.com',
  'bj.euphoria@gmail.com',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Require service_role JWT — this endpoint must only be called server-to-server
    // to prevent unauthenticated attackers from flooding admin inboxes.
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const token = authHeader.replace('Bearer ', '')
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload?.role !== 'service_role') {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } catch {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { order_id } = await req.json()
    if (!order_id || typeof order_id !== 'string') {
      return new Response(JSON.stringify({ error: 'order_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (error || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Best-effort admin notification.
    // Calls send-transactional-email if available; silently succeeds otherwise
    // so the customer order flow is never blocked by email setup.
    const results: Array<{ email: string; ok: boolean; note?: string }> = []
    for (const email of ADMIN_EMAILS) {
      try {
        const { error: invokeErr } = await supabase.functions.invoke(
          'send-transactional-email',
          {
            body: {
              templateName: 'new-order-admin',
              recipientEmail: email,
              idempotencyKey: `new-order-${order.id}-${email}`,
              templateData: {
                orderNumber: order.order_number,
                customerName: order.customer_name,
                customerPhone: order.customer_phone,
                customerEmail: order.customer_email,
                shippingAddress: order.shipping_address,
                postalCode: order.postal_code,
                items: order.items,
                subtotal: order.subtotal,
                currency: order.currency,
                customerNote: order.customer_note,
                createdAt: order.created_at,
              },
            },
          },
        )
        results.push({ email, ok: !invokeErr, note: invokeErr?.message })
      } catch (e) {
        results.push({ email, ok: false, note: (e as Error).message })
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('notify-admin-order error', e)
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
