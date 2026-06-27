import { createClient } from 'npm:@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const jwt = authHeader.replace('Bearer ', '').trim()

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify caller is an authenticated admin
    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: `Bearer ${jwt}` } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const admin = createClient(supabaseUrl, serviceKey)
    const { data: isAdmin } = await admin.rpc('has_role', {
      _user_id: userData.user.id,
      _role: 'admin',
    })
    if (!isAdmin) {
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

    const { data: order, error: orderErr } = await admin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (order.shipped_email_sent_at) {
      return new Response(
        JSON.stringify({ ok: true, alreadySent: true, sentAt: order.shipped_email_sent_at }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (!order.customer_email) {
      return new Response(JSON.stringify({ error: '주문에 이메일이 없습니다' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Respect store-level toggle for shipped notifications.
    const { data: settings } = await admin
      .from('store_settings')
      .select('notify_customer_shipped')
      .limit(1)
      .maybeSingle()
    if (settings?.notify_customer_shipped === false) {
      return new Response(
        JSON.stringify({ error: '관리자 설정에서 배송중 알림이 비활성화되어 있습니다' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const { error: invokeErr } = await admin.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'customer-order-shipped',
        recipientEmail: order.customer_email,
        idempotencyKey: `shipped-${order.id}`,
        templateData: {
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          shippingAddress: order.shipping_address,
          postalCode: order.postal_code,
          items: order.items,
          subtotal: order.subtotal,
          currency: order.currency,
        },
      },
    })

    if (invokeErr) {
      console.error('send-shipped-notification: send failed', invokeErr)
      return new Response(JSON.stringify({ error: invokeErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const sentAt = new Date().toISOString()
    await admin
      .from('orders')
      .update({ status: 'shipped', shipped_email_sent_at: sentAt })
      .eq('id', order_id)

    return new Response(JSON.stringify({ ok: true, sentAt }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('send-shipped-notification error', e)
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
