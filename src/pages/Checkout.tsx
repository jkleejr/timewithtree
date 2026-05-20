import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

const orderSchema = z.object({
  customer_name: z.string().trim().min(1, "이름을 입력해주세요").max(100),
  customer_phone: z.string().trim().min(1, "연락처를 입력해주세요").max(30),
  customer_email: z.string().trim().email("올바른 이메일을 입력해주세요").max(255),
  shipping_address: z.string().trim().min(1, "배송지를 입력해주세요").max(500),
  postal_code: z.string().trim().max(20).optional().or(z.literal("")),
  customer_note: z.string().trim().max(1000).optional().or(z.literal("")),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearCart } = useCartStore();
  const [bankInfo, setBankInfo] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    shipping_address: "",
    postal_code: "",
    customer_note: "",
  });

  useEffect(() => {
    supabase
      .from("store_settings")
      .select("bank_info")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setBankInfo(data?.bank_info || ""));
  }, []);

  useEffect(() => {
    if (user?.email && !form.customer_email) {
      setForm((f) => ({ ...f, customer_email: user.email || "" }));
    }
  }, [user, form.customer_email]);

  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "KRW";

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);

    const orderItems = items.map((i) => ({
      product_title: i.product.node.title,
      product_handle: i.product.node.handle,
      variant_id: i.variantId,
      variant_title: i.variantTitle,
      options: i.selectedOptions,
      quantity: i.quantity,
      unit_price: parseFloat(i.price.amount),
      line_total: parseFloat(i.price.amount) * i.quantity,
    }));

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_name: parsed.data.customer_name,
        customer_phone: parsed.data.customer_phone,
        customer_email: parsed.data.customer_email,
        shipping_address: parsed.data.shipping_address,
        postal_code: parsed.data.postal_code || null,
        customer_note: parsed.data.customer_note || null,
        items: orderItems,
        subtotal,
        currency,
        status: "pending",
      })
      .select("id, order_number")
      .single();

    if (error || !data) {
      console.error(error);
      toast.error("주문 접수에 실패했습니다. 다시 시도해주세요.");
      setSubmitting(false);
      return;
    }

    // Fire-and-forget admin notification (works once email infra is set up)
    void supabase.functions.invoke("notify-admin-order", {
      body: { order_id: data.id },
    });

    clearCart();
    navigate(`/order-success?n=${encodeURIComponent(data.order_number)}`);
  };

  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-24">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">결제</p>
        <h1 className="font-display text-4xl md:text-5xl mb-10 font-bold font-sans">계좌이체 주문</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="border border-border p-6 md:p-8 space-y-5">
              <h2 className="font-display text-xl font-sans mb-2">주문자 정보</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">이름 *</Label>
                  <Input
                    id="customer_name"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer_phone">연락처 *</Label>
                  <Input
                    id="customer_phone"
                    placeholder="010-0000-0000"
                    value={form.customer_phone}
                    onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">이메일 *</Label>
                <Input
                  id="customer_email"
                  type="email"
                  value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="border border-border p-6 md:p-8 space-y-5">
              <h2 className="font-display text-xl font-sans mb-2">배송지</h2>
              <div className="space-y-2">
                <Label htmlFor="postal_code">우편번호</Label>
                <Input
                  id="postal_code"
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shipping_address">주소 *</Label>
                <Textarea
                  id="shipping_address"
                  rows={3}
                  value={form.shipping_address}
                  onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_note">배송 메모 (선택)</Label>
                <Textarea
                  id="customer_note"
                  rows={2}
                  value={form.customer_note}
                  onChange={(e) => setForm({ ...form, customer_note: e.target.value })}
                />
              </div>
            </div>

            <div className="border border-border p-6 md:p-8">
              <h2 className="font-display text-xl font-sans mb-3">입금 계좌 안내</h2>
              {bankInfo ? (
                <pre className="whitespace-pre-wrap font-sans text-sm bg-secondary p-4">{bankInfo}</pre>
              ) : (
                <div className="bg-secondary p-4 text-sm text-muted-foreground">
                  입금 계좌 정보는 곧 안내됩니다. 주문 접수 후 관리자가 이메일/연락처로 계좌 정보를 안내드립니다.
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                * 주문 접수 후 위 계좌로 입금해주시면 관리자가 확인 후 배송을 진행합니다.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-none" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "주문 접수하기"}
            </Button>
          </form>

          <aside className="lg:col-span-1">
            <div className="bg-secondary p-6 md:p-8 sticky top-24">
              <h2 className="font-display text-xl mb-6 font-sans">주문 요약</h2>
              <div className="space-y-3 mb-4">
                {items.map((i) => (
                  <div key={i.variantId} className="flex justify-between text-sm gap-3">
                    <span className="flex-1">
                      {i.product.node.title}
                      <span className="text-muted-foreground"> × {i.quantity}</span>
                    </span>
                    <span className="tabular-nums whitespace-nowrap">
                      {formatPrice(parseFloat(i.price.amount) * i.quantity, i.price.currencyCode)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex justify-between items-baseline">
                <span className="text-base font-sans">합계</span>
                <span className="font-display text-2xl tabular-nums font-sans">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                <Link to="/cart" className="underline">장바구니로 돌아가기</Link>
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <BackButton />
        </div>
      </section>
    </SiteLayout>
  );
};

export default Checkout;
