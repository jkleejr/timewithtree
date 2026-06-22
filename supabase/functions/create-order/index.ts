import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Server-side authoritative price catalog. Keep in sync with src/data/products.ts.
const PRICE_CATALOG: Record<string, { unit_price: number; title: string }> = {
  "jacq-r3": { unit_price: 100000, title: "R3, 잭큐몬티 자작나무" },
  "jacq-r4": { unit_price: 120000, title: "R4, 잭큐몬티 자작나무" },
  "jacq-r5": { unit_price: 150000, title: "R5, 잭큐몬티 자작나무" },
  "jacq-dagan": { unit_price: 150000, title: "다간형, 잭큐몬티 자작나무" },
};

const ItemSchema = z.object({
  product_title: z.string().max(300),
  product_handle: z.string().max(200),
  variant_id: z.string().max(200),
  variant_title: z.string().max(300),
  options: z.any().optional(),
  quantity: z.number().int().positive().max(1000),
});

const BodySchema = z.object({
  user_id: z.string().uuid().nullable().optional(),
  customer_name: z.string().trim().min(1).max(100),
  customer_phone: z.string().trim().min(1).max(30),
  customer_tel: z.string().trim().max(30).nullable().optional(),
  customer_email: z.string().trim().email().max(255),
  shipping_address: z.string().trim().min(1).max(1000),
  postal_code: z.string().trim().max(20).nullable().optional(),
  recipient_name: z.string().trim().max(100).nullable().optional(),
  recipient_phone: z.string().trim().max(30).nullable().optional(),
  recipient_tel: z.string().trim().max(30).nullable().optional(),
  recipient_address: z.string().trim().max(1000).nullable().optional(),
  recipient_postal_code: z.string().trim().max(20).nullable().optional(),
  delivery_message: z.string().trim().max(1000).nullable().optional(),
  depositor_name: z.string().trim().min(1).max(100),
  bank_account: z.string().trim().max(200),
  customer_note: z.string().trim().max(4000).nullable().optional(),
  currency: z.literal("KRW").optional(),
  items: z.array(ItemSchema).min(1).max(50),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Resolve auth user if a JWT was supplied (optional — guests allowed).
    let authUserId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data } = await userClient.auth.getUser();
      authUserId = data.user?.id ?? null;
    }

    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request", details: parsed.error.flatten() }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const body = parsed.data;

    // Re-price every item from the server-side catalog. Reject unknown variants.
    let subtotal = 0;
    const orderItems = body.items.map((i) => {
      const catalog = PRICE_CATALOG[i.variant_id];
      if (!catalog) {
        throw new Error(`Unknown variant: ${i.variant_id}`);
      }
      const unit_price = catalog.unit_price;
      const line_total = unit_price * i.quantity;
      subtotal += line_total;
      return {
        product_title: i.product_title,
        product_handle: i.product_handle,
        variant_id: i.variant_id,
        variant_title: catalog.title,
        options: i.options ?? [],
        quantity: i.quantity,
        unit_price,
        line_total,
      };
    });

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await admin
      .from("orders")
      .insert({
        user_id: authUserId,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_tel: body.customer_tel ?? null,
        customer_email: body.customer_email,
        shipping_address: body.shipping_address,
        postal_code: body.postal_code ?? null,
        recipient_name: body.recipient_name ?? null,
        recipient_phone: body.recipient_phone ?? null,
        recipient_tel: body.recipient_tel ?? null,
        recipient_address: body.recipient_address ?? null,
        recipient_postal_code: body.recipient_postal_code ?? null,
        delivery_message: body.delivery_message ?? null,
        payment_method: "bank_transfer",
        depositor_name: body.depositor_name,
        bank_account: body.bank_account,
        customer_note: body.customer_note ?? null,
        items: orderItems,
        subtotal,
        currency: body.currency ?? "KRW",
        status: "pending",
      })
      .select("id, order_number")
      .single();

    if (error || !data) {
      console.error("create-order insert failed", error?.code);
      return new Response(
        JSON.stringify({ error: "Order creation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ id: data.id, order_number: data.order_number }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-order error", (e as Error).message);
    return new Response(
      JSON.stringify({ error: (e as Error).message || "Internal error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
