import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check, Copy, Loader2, Printer } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderPolicyNotice } from "@/components/OrderPolicyNotice";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const BANK_ACCOUNT = "NH농협은행 301-0327-2621-11";

type OrderItem = {
  product_title: string;
  product_handle?: string;
  variant_title?: string;
  options?: Array<{ name: string; value: string }>;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  postal_code: string | null;
  customer_note: string | null;
  items: OrderItem[];
  subtotal: number;
  currency: string;
  status: "pending" | "paid" | "shipped" | "cancelled";
  created_at: string;
};

// Status flow shown as 4 steps; cancelled is a separate state.
const STATUS_STEPS: Array<{ key: OrderRow["status"]; label: string }> = [
  { key: "pending", label: "주문접수" },
  { key: "paid", label: "입금완료" },
  { key: "shipped", label: "배송중" },
  { key: "shipped", label: "배송완료" },
];

function parseNote(note: string | null) {
  if (!note) return {} as Record<string, string>;
  const out: Record<string, string> = {};
  for (const line of note.split("\n")) {
    const m = line.match(/^\[([^\]]+)\]\s*(.*)$/);
    if (m) out[m[1].trim()] = m[2].trim();
  }
  return out;
}

const OrderDetail = () => {
  const { orderNumber = "" } = useParams();
  const [params] = useSearchParams();
  const { user } = useAuth();

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsLookup, setNeedsLookup] = useState(false);
  const [lookupEmail, setLookupEmail] = useState(params.get("email") ?? "");
  const [lookingUp, setLookingUp] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchOrder = async (email?: string) => {
    setLoading(true);

    // Authenticated user — try direct read first (RLS will scope).
    if (user) {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, user_id, customer_name, customer_phone, customer_email, shipping_address, postal_code, items, subtotal, currency, status, customer_note, created_at, updated_at")
        .eq("order_number", orderNumber)
        .maybeSingle();
      if (!error && data) {
        setOrder(data as unknown as OrderRow);
        setNeedsLookup(false);
        setLoading(false);
        return;
      }
    }

    // Guest path — needs email
    if (email) {
      setLookingUp(true);
      const { data, error } = await supabase.rpc("lookup_order", {
        p_order_number: orderNumber,
        p_email: email,
      });
      setLookingUp(false);
      const row = Array.isArray(data) ? data[0] : null;
      if (!error && row) {
        setOrder(row as unknown as OrderRow);
        setNeedsLookup(false);
        setLoading(false);
        return;
      }
      toast.error("주문 정보를 찾을 수 없습니다. 주문번호와 이메일을 확인해주세요.");
    }

    setNeedsLookup(true);
    setLoading(false);
  };

  useEffect(() => {
    const initialEmail = params.get("email") ?? undefined;
    fetchOrder(initialEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, user?.id]);

  const note = useMemo(() => parseNote(order?.customer_note ?? null), [order]);

  const currentStepIndex = useMemo(() => {
    if (!order) return -1;
    if (order.status === "cancelled") return -1;
    if (order.status === "pending") return 0;
    if (order.status === "paid") return 1;
    if (order.status === "shipped") return 3;
    return 0;
  }, [order]);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(BANK_ACCOUNT);
      setCopied(true);
      toast.success("계좌번호가 복사되었습니다");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="max-w-5xl mx-auto px-6 md:px-10 pt-20 pb-24 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SiteLayout>
    );
  }

  if (needsLookup || !order) {
    return (
      <SiteLayout>
        <section className="max-w-md mx-auto px-6 md:px-10 pt-20 pb-24">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">비회원 주문조회</p>
          <h1 className="font-display text-3xl mb-6 font-bold font-sans">주문 조회</h1>
          <p className="text-sm text-muted-foreground mb-6">
            주문 시 입력하신 이메일을 입력해주세요.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (lookupEmail.trim()) fetchOrder(lookupEmail.trim());
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="lookup_order">주문번호</Label>
              <Input id="lookup_order" value={orderNumber} readOnly className="bg-secondary" />
            </div>
            <div>
              <Label htmlFor="lookup_email">이메일</Label>
              <Input
                id="lookup_email"
                type="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full rounded-none" disabled={lookingUp}>
              {lookingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : "조회하기"}
            </Button>
          </form>
          <div className="mt-12">
            <BackButton />
          </div>
        </section>
      </SiteLayout>
    );
  }

  const orderDate = new Date(order.created_at);
  const orderDateStr = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}-${String(orderDate.getDate()).padStart(2, "0")} ${String(orderDate.getHours()).padStart(2, "0")}:${String(orderDate.getMinutes()).padStart(2, "0")}`;

  const isUnpaid = order.status === "pending";
  const isCancelled = order.status === "cancelled";

  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-12 pb-24 print:pt-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">주문상세내역</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold font-sans">주문 상세</h1>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none print:hidden"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" /> 주문내역서 출력
          </Button>
        </div>

        <OrderPolicyNotice className="mb-8" />

        {/* Order header + items */}
        <div className="border border-border mb-6">
          <div className="flex items-center justify-between gap-4 px-5 md:px-6 py-4 border-b border-border bg-secondary/40">
            <div className="text-sm">
              <span className="text-muted-foreground mr-3">주문번호</span>
              <span className="font-mono font-semibold tabular-nums">{order.order_number}</span>
            </div>
            <div className="text-sm text-muted-foreground">{orderDateStr}</div>
          </div>

          <div className="divide-y divide-border">
            {order.items.map((item, idx) => {
              const optionStr = item.options
                ?.filter((o) => o.value && o.value !== "Default Title")
                .map((o) => `${o.name}: ${o.value}`)
                .join(" · ");
              return (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_auto_auto_auto] md:grid-cols-[1fr_80px_60px_120px_120px] items-center gap-4 px-5 md:px-6 py-4"
                >
                  <div className="min-w-0">
                    <Link
                      to={item.product_handle ? `/product/${item.product_handle}` : "#"}
                      className="font-semibold hover:text-accent truncate block"
                    >
                      {item.product_title}
                    </Link>
                    {optionStr && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{optionStr}</p>
                    )}
                  </div>
                  <span className="hidden md:inline-flex items-center justify-center border border-destructive text-destructive text-[10px] font-semibold px-1.5 py-0.5 leading-none whitespace-nowrap">
                    용달배송
                  </span>
                  <span className="text-sm tabular-nums text-muted-foreground whitespace-nowrap">
                    × {item.quantity}
                  </span>
                  <span className="hidden md:block text-sm tabular-nums text-muted-foreground whitespace-nowrap text-right">
                    {formatPrice(item.unit_price, order.currency)}
                  </span>
                  <span className="text-sm md:text-base tabular-nums font-semibold whitespace-nowrap text-right">
                    {formatPrice(item.line_total, order.currency)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Status flow */}
          <div className="px-5 md:px-6 py-4 border-t border-border bg-secondary/20">
            {isCancelled ? (
              <div className="text-center text-sm text-destructive font-medium py-2">
                주문이 취소되었습니다
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                {STATUS_STEPS.map((step, i) => {
                  const active = i <= currentStepIndex;
                  return (
                    <div key={i} className="flex items-center gap-2 md:gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-3 py-1.5 text-xs md:text-sm border tabular-nums",
                          active
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border text-muted-foreground",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")} · {step.label}
                      </span>
                      {i < STATUS_STEPS.length - 1 && (
                        <span className="hidden sm:inline text-muted-foreground">→</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 주문정보 / 결제정보 */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border border-border p-6">
            <h2 className="font-display text-lg font-bold mb-4 font-sans">주문정보</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상품 합계</dt>
                <dd className="tabular-nums">{formatPrice(order.subtotal, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">포장 + 택배비</dt>
                <dd className="text-muted-foreground">별도</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">용달 배송비</dt>
                <dd className="text-muted-foreground">기사님께 직접 지불</dd>
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-baseline">
                <dt className="font-medium">총 주문 금액</dt>
                <dd className="font-display text-xl tabular-nums font-sans">
                  {formatPrice(order.subtotal, order.currency)}
                </dd>
              </div>
              {isUnpaid && (
                <div className="flex justify-between items-baseline">
                  <dt className="text-destructive">미결제액</dt>
                  <dd className="text-destructive font-display text-lg tabular-nums font-sans">
                    {formatPrice(order.subtotal, order.currency)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="border border-border p-6">
            <h2 className="font-display text-lg font-bold mb-4 font-sans">결제정보</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">주문번호</dt>
                <dd className="font-mono tabular-nums">{order.order_number}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">주문일시</dt>
                <dd className="tabular-nums">{orderDateStr}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">결제방식</dt>
                <dd>무통장 입금</dd>
              </div>
              {note["입금자명"] && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">입금자명</dt>
                  <dd>{note["입금자명"]}</dd>
                </div>
              )}
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">입금계좌</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium tabular-nums">{BANK_ACCOUNT}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyAccount}
                    className="rounded-none shrink-0 print:hidden"
                  >
                    {copied ? <><Check className="h-4 w-4" /> 복사됨</> : <><Copy className="h-4 w-4" /> 복사</>}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">예금주: 농업회사법인 나무와걷는시간</p>
              </div>
            </dl>
          </div>
        </div>

        {/* 주문하시는 분 / 받으시는 분 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border p-6">
            <h2 className="font-display text-lg font-bold mb-4 font-sans">주문하시는 분</h2>
            <PartyRows
              rows={[
                ["이름", order.customer_name],
                ["핸드폰", order.customer_phone],
                ["전화번호", note["주문자 전화"] ?? "—"],
                ["이메일", order.customer_email],
              ]}
            />
          </div>

          <div className="border border-border p-6">
            <h2 className="font-display text-lg font-bold mb-4 font-sans">받으시는 분</h2>
            <PartyRows
              rows={[
                ["이름", note["받는분"]?.split(" / ")[0] ?? order.customer_name],
                ["핸드폰", note["받는분"]?.split(" / ")[1] ?? order.customer_phone],
                ["주소", order.shipping_address],
                ["전하시는 말씀", note["전하시는 말씀"] ?? "—"],
              ]}
            />
          </div>
        </div>

        <div className="mt-12 print:hidden">
          <BackButton />
        </div>
      </section>
    </SiteLayout>
  );
};

const PartyRows = ({ rows }: { rows: Array<[string, string]> }) => (
  <dl className="space-y-3 text-sm">
    {rows.map(([k, v]) => (
      <div key={k} className="grid grid-cols-[88px_1fr] gap-3">
        <dt className="text-muted-foreground">{k}</dt>
        <dd className="break-words">{v}</dd>
      </div>
    ))}
  </dl>
);

export default OrderDetail;
