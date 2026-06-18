import { createClient } from 'npm:@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Status = 'pending' | 'paid' | 'shipped' | 'cancelled'

// Decide which customer template to send for a status transition.
// Returns null when no notification should fire.
function pickTemplate(oldStatus: Status | null, newStatus: Status): string | null {
  if (newStatus === 'cancelled') return 'customer-order-cancelled'
  if (newStatus === 'shipped' && (oldStatus === 'paid' || oldStatus === 'pending')) {
    return 'customer-order-shipped'
  }
  if (newStatus === 'paid' && oldStatus === 'pending') return 'customer-order-paid'
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Service-role auth: accept either a JWT with role=service_role OR a bearer
    // token matching SUPABASE_SERVICE_ROLE_KEY (new opaque keys aren't JWTs).
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
      console.error('notify-order-status-change: forbidden')
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { order_id, old_status, new_status } = await req.json()
    if (!order_id || typeof order_id !== 'string' || !new_status) {
      return new Response(JSON.stringify({ error: 'order_id and new_status required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const templateName = pickTemplate((old_status ?? null) as Status | null, new_status as Status)
    if (!templateName) {
      console.log('notify-order-status-change: no email for transition', { old_status, new_status })
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
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

    if (!order.customer_email) {
      console.log('notify-order-status-change: order has no customer email, skipping')
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: 'no_email' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error: invokeErr } = await supabase.functions.invoke(
      'send-transactional-email',
      {
        body: {
          templateName,
          recipientEmail: order.customer_email,
          idempotencyKey: `status-${order.id}-${new_status}`,
          templateData: {
            orderNumber: order.order_number,
            customerName: order.customer_name,
            customerPhone: order.customer_phone,
            shippingAddress: order.shipping_address,
            postalCode: order.postal_code,
            recipientName: order.recipient_name,
            recipientPhone: order.recipient_phone,
            recipientAddress: order.recipient_address,
            recipientPostalCode: order.recipient_postal_code,
            items: order.items,
            subtotal: order.subtotal,
            currency: order.currency,
          },
        },
      },
    )

    if (invokeErr) {
      console.error('notify-order-status-change: send failed', invokeErr)
      return new Response(JSON.stringify({ error: invokeErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true, templateName }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('notify-order-status-change error', e)
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
