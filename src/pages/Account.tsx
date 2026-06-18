import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Package } from "lucide-react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDaumPostcode } from "@/hooks/useDaumPostcode";
import { formatPrice } from "@/lib/utils";

const profileSchema = z.object({
  full_name: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
  postal_code: z.string().trim().max(20).optional().or(z.literal("")),
});

type OrderItem = {
  product_title: string;
  variant_title?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type OrderRow = {
  id: string;
  order_number: string;
  items: OrderItem[];
  subtotal: number;
  currency: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  created_at: string;
};

const STATUS_LABEL: Record<OrderRow["status"], string> = {
  pending: "주문접수",
  paid: "입금완료",
  shipped: "배송중",
  cancelled: "취소됨",
};

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { open: openPostcode } = useDaumPostcode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", postal_code: "" });

  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone, address, postal_code")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error("Profile load failed", error?.code);
        if (data) {
          setForm({
            full_name: data.full_name ?? "",
            phone: data.phone ?? "",
            address: data.address ?? "",
            postal_code: data.postal_code ?? "",
          });
        }
        setLoading(false);
      });

    supabase
      .from("orders")
      .select("id, order_number, items, subtotal, currency, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("Orders load failed", error?.code);
        if (data) setOrders(data as unknown as OrderRow[]);
        setOrdersLoading(false);
      });
  }, [user]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const searchAddress = () =>
    openPostcode(({ postalCode, address }) =>
      setForm((f) => ({ ...f, postal_code: postalCode, address })),
    );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = profileSchema.parse(form);
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: validated.full_name || null,
          phone: validated.phone || null,
          address: validated.address || null,
          postal_code: validated.postal_code || null,
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("프로필이 저장되었습니다");
    } catch (err) {
      const msg = err instanceof z.ZodError
        ? err.errors[0].message
        : err instanceof Error
          ? err.message
          : "오류가 발생했습니다";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("로그아웃되었습니다");
    navigate("/");
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

  return (
    <SiteLayout>
      <section className="max-w-3xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-20">
        <h1 className="font-display text-4xl md:text-5xl mb-2 font-bold font-sans">내 계정</h1>
        <p className="text-primary mb-10">{user.email}</p>

        <h2 className="font-display text-2xl mb-4 font-sans font-bold">내 정보</h2>
        <p className="text-sm text-muted-foreground mb-6">
          입력하신 정보는 다음 주문 시 자동으로 채워집니다.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="full_name">이름</Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                maxLength={100}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" value={user.email ?? ""} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                maxLength={30}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="postal_code">우편번호</Label>
              <div className="flex gap-2">
                <Input
                  id="postal_code"
                  value={form.postal_code}
                  onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                  maxLength={20}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none shrink-0"
                  onClick={searchAddress}
                >
                  주소 검색
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">배송 주소</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                maxLength={500}
              />
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <Button type="button" variant="outline" className="rounded-none" onClick={handleSignOut}>
                로그아웃
              </Button>
              <Button type="submit" size="lg" className="rounded-none" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "저장"}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-16">
          <h2 className="font-display text-2xl mb-6 font-sans font-bold">주문 내역</h2>

          {ordersLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-dashed border-border py-12 flex flex-col items-center gap-3 text-muted-foreground">
              <Package className="h-8 w-8" />
              <p className="text-sm">아직 주문 내역이 없습니다.</p>
              <Link to="/shop" className="underline text-sm text-foreground">
                쇼핑 시작하기
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {orders.map((order) => {
                const totalQty = (order.items ?? []).reduce(
                  (s, it) => s + (it.quantity ?? 0),
                  0,
                );
                return (
                  <li key={order.id} className="border border-border p-5">
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div>
                        <Link
                          to={`/orders/${encodeURIComponent(order.order_number)}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {order.order_number}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <span
                        className={
                          order.status === "pending"
                            ? "text-xs px-2 py-1 bg-accent text-accent-foreground font-medium border border-transparent"
                            : "text-xs px-2 py-1 border border-border bg-secondary"
                        }
                      >
                        {STATUS_LABEL[order.status]}
                      </span>
                    </div>

                    <ul className="text-sm space-y-1 mb-3">
                      {(order.items ?? []).map((it, idx) => (
                        <li key={idx} className="flex justify-between gap-3">
                          <span className="flex-1">
                            {it.product_title}
                            {it.variant_title ? (
                              <span className="text-muted-foreground"> · {it.variant_title}</span>
                            ) : null}
                            <span className="text-muted-foreground"> × {it.quantity}</span>
                          </span>
                          <span className="tabular-nums whitespace-nowrap">
                            {formatPrice(it.line_total, order.currency)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-border pt-3 flex justify-between items-baseline text-sm">
                      <span className="text-muted-foreground">총 {totalQty}개</span>
                      <span className="font-display tabular-nums font-sans text-base">
                        {formatPrice(order.subtotal, order.currency)}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Account;
