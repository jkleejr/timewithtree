import { createClient } from 'npm:@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ADMIN_EMAILS = [
  'timewithtree@gmail.com',
  'jklwjr@gmail.com',
  'arminko2023@gmail.com',
  'bj.euphoria@gmail.com',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // verify_jwt=true in config.toml means the gateway has already verified
    // the JWT signature. We additionally require the service_role claim so
    // only server-to-server callers (DB trigger / other edge functions) succeed.
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
                customerTel: order.customer_tel,
                customerEmail: order.customer_email,
                shippingAddress: order.shipping_address,
                postalCode: order.postal_code,
                recipientName: order.recipient_name,
                recipientPhone: order.recipient_phone,
                recipientTel: order.recipient_tel,
                recipientAddress: order.recipient_address,
                recipientPostalCode: order.recipient_postal_code,
                deliveryMessage: order.delivery_message,
                paymentMethod: order.payment_method,
                depositorName: order.depositor_name,
                bankAccount: order.bank_account,
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

    // Customer order confirmation (best-effort)
    let customerResult: { email: string; ok: boolean; note?: string } | null = null
    if (order.customer_email) {
      // Parse delivery date from customer_note if present (stored as "[배송일] YYYY-MM-DD")
      let deliveryDate: string | null = null
      if (typeof order.customer_note === 'string') {
        const m = order.customer_note.match(/\[배송일\]\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/)
        if (m) deliveryDate = m[1]
      }
      try {
        const { error: invokeErr } = await supabase.functions.invoke(
          'send-transactional-email',
          {
            body: {
              templateName: 'customer-order-confirmation',
              recipientEmail: order.customer_email,
              idempotencyKey: `customer-confirm-${order.id}`,
              templateData: {
                orderNumber: order.order_number,
                customerName: order.customer_name,
                customerPhone: order.customer_phone,
                customerEmail: order.customer_email,
                shippingAddress: order.shipping_address,
                postalCode: order.postal_code,
                recipientName: order.recipient_name,
                recipientPhone: order.recipient_phone,
                recipientAddress: order.recipient_address,
                recipientPostalCode: order.recipient_postal_code,
                deliveryDate,
                deliveryMessage: order.delivery_message,
                paymentMethod: order.payment_method,
                depositorName: order.depositor_name,
                bankAccount: order.bank_account,
                items: order.items,
                subtotal: order.subtotal,
                currency: order.currency,
                createdAt: order.created_at,
              },
            },
          },
        )
        customerResult = { email: order.customer_email, ok: !invokeErr, note: invokeErr?.message }
      } catch (e) {
        customerResult = { email: order.customer_email, ok: false, note: (e as Error).message }
      }
    }

    return new Response(JSON.stringify({ ok: true, results, customer: customerResult }), {
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
