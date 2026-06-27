import { createClient } from 'npm:@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ADMIN_EMAILS = [
  'timewithtree@gmail.com',
  'jklwjr@gmail.com',
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Require service-role credentials. Accept either a JWT with role=service_role
    // (legacy) OR a bearer token matching SUPABASE_SERVICE_ROLE_KEY (new opaque keys).
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const bearer = authHeader.replace('Bearer ', '').trim()
    const serviceRoleEnv = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    let isServiceRole = serviceRoleEnv !== '' && bearer === serviceRoleEnv
    if (!isServiceRole) {
      try {
        const payload = JSON.parse(atob(bearer.split('.')[1]))
        isServiceRole = payload?.role === 'service_role'
      } catch {
        // not a JWT
      }
    }
    if (!isServiceRole) {
      console.error('notify-admin-order: forbidden (non-service-role caller)')
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
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

    // Load toggles (best-effort; default to enabled if missing).
    const { data: settings } = await supabase
      .from('store_settings')
      .select('notify_admin_new_order, notify_customer_order_confirmation')
      .limit(1)
      .maybeSingle()
    const adminEnabled = settings?.notify_admin_new_order !== false
    const customerConfirmEnabled = settings?.notify_customer_order_confirmation !== false

    // Best-effort admin notification.
    const results: Array<{ email: string; ok: boolean; note?: string }> = []
    for (const email of adminEnabled ? ADMIN_EMAILS : []) {
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

    // Customer order confirmation (best-effort, respects toggle)
    let customerResult: { email: string; ok: boolean; note?: string } | null = null
    if (customerConfirmEnabled && order.customer_email) {
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
