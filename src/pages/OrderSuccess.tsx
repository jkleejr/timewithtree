import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/utils";
import { Seo } from "@/components/Seo";


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
  status: string;
  created_at: string;
};

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const orderNumber = params.get("n");
  const orderId = params.get("id");
  const detailHref = orderNumber ? `/orders/${encodeURIComponent(orderNumber)}` : null;

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(orderNumber || orderId));

  useEffect(() => {
    if (!orderNumber && !orderId) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setLoading(true);

      // Authenticated user — RLS-scoped direct read by order_number or id
      if (user) {
        const query = supabase
          .from("orders")
          .select(
            "id, order_number, customer_name, customer_phone, customer_email, shipping_address, postal_code, items, subtotal, currency, status, customer_note, created_at",
          );
        const { data } = orderNumber
          ? await query.eq("order_number", orderNumber).maybeSingle()
          : await query.eq("id", orderId!).maybeSingle();
        if (!cancelled && data) {
          setOrder(data as unknown as OrderRow);
          setLoading(false);
          return;
        }
      }

      // Guest path — needs email stored in session at checkout time
      let email = "";
      try {
        email =
          (orderNumber && sessionStorage.getItem(`order_email:${orderNumber}`)) ||
          (orderId && sessionStorage.getItem(`order_email:${orderId}`)) ||
          "";
      } catch {
        email = "";
      }

      if (email && orderNumber) {
        const { data } = await supabase.rpc("lookup_order", {
          p_order_number: orderNumber,
          p_email: email,
        });
        const row = Array.isArray(data) ? data[0] : null;
        if (!cancelled && row) {
          setOrder(row as unknown as OrderRow);
          setLoading(false);
          return;
        }
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [orderNumber, orderId, user?.id]);

  const orderDateStr = useMemo(() => {
    if (!order) return "";
    const d = new Date(order.created_at);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }, [order]);

  return (
    <SiteLayout>
      <Seo
        title="주문 완료 — 나무와 걷는 시간"
        description="잭큐몬티 자작나무 주문이 정상적으로 접수되었습니다. 입금 안내와 주문번호를 확인하세요."
        path="/order-success"
        noindex
      />

      <section className="max-w-3xl mx-auto px-6 md:px-10 pt-16 pb-24">
        <div className="text-center">
          <CheckCircle2 className="h-14 w-14 mx-auto text-accent mb-6" />
          <h1 className="font-display text-3xl md:text-4xl mb-4 font-bold font-sans">
            감사합니다! 주문이 정상적으로 접수되었습니다.
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-2">
            최대한 빠르게 배송 준비를 진행하겠습니다.
            <br />
            품절일 경우 전화로 안내드리겠습니다.
          </p>
          {orderNumber && (
            <p className="text-sm text-muted-foreground mt-4">
              주문번호: <span className="font-mono">{orderNumber}</span>
              {orderDateStr && <span className="ml-3">{orderDateStr}</span>}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : order ? (
          <div className="mt-10 space-y-6">
            {/* Guest signup CTA — only shown to unauthenticated buyers */}
            {!user && order.customer_email && (
              <div className="border border-accent/40 bg-accent/5 p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex items-start gap-3 flex-1">
                  <UserPlus className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-1">계정을 만들고 주문을 관리하세요</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      방금 주문하신 이메일({order.customer_email})로 가입하면, 이 주문이 자동으로 회원 주문 내역에 연결됩니다.
                    </p>
                  </div>
                </div>
                <Button asChild className="rounded-none shrink-0">
                  <Link
                    to={`/auth?mode=signup&email=${encodeURIComponent(
                      order.customer_email,
                    )}&redirect=${encodeURIComponent(
                      `/orders/${order.order_number}`,
                    )}`}
                  >
                    회원가입하기
                  </Link>
                </Button>
              </div>
            )}

            {/* 주문 상품 */}
            <div className="border border-border">
              <h2 className="font-display text-lg font-bold px-5 md:px-6 py-4 border-b border-border bg-secondary/40 font-sans">
                주문 상품
              </h2>
              <ul className="divide-y divide-border">
                {order.items.map((item, idx) => {
                  const optionStr = item.options
                    ?.filter((o) => o.value && o.value !== "Default Title")
                    .map((o) => `${o.name}: ${o.value}`)
                    .join(" · ");
                  return (
                    <li
                      key={idx}
                      className="px-5 md:px-6 py-4 flex justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{item.product_title}</p>
                        {optionStr && (
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {optionStr}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                          수량 × {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm md:text-base font-semibold tabular-nums whitespace-nowrap">
                        {formatPrice(item.line_total, order.currency)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="px-5 md:px-6 py-4 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품 합계</span>
                  <span className="tabular-nums">
                    {formatPrice(order.subtotal, order.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">용달 배송비</span>
                  <span className="text-muted-foreground">기사님께 직접 지불</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <span className="font-medium">총 주문 금액</span>
                  <span className="font-display text-xl tabular-nums font-sans">
                    {formatPrice(order.subtotal, order.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* 주문자 / 배송 정보 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4 font-sans">주문자 정보</h2>
                <dl className="space-y-3 text-sm">
                  <Row k="이름" v={order.customer_name} />
                  <Row k="전화번호" v={order.customer_phone} />
                  <Row k="이메일" v={order.customer_email} />
                </dl>
              </div>
              <div className="border border-border p-6">
                <h2 className="font-display text-lg font-bold mb-4 font-sans">배송지 정보</h2>
                <dl className="space-y-3 text-sm">
                  <Row k="주소" v={order.shipping_address} />
                </dl>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground mt-10">
            주문 상세 정보를 불러올 수 없습니다. 아래 "주문 상세 보기"에서 확인해주세요.
          </p>
        )}

        <div className="flex justify-between items-center w-full mt-10">
          {detailHref ? (
            <Button asChild className="rounded-none">
              <Link to={detailHref}>주문 상세 보기</Link>
            </Button>
          ) : (
            <div />
          )}
          <Button asChild variant="outline" className="rounded-none">
            <Link to="/shop">계속 쇼핑하기</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="grid grid-cols-[88px_1fr] gap-3">
    <dt className="text-muted-foreground">{k}</dt>
    <dd className="break-words">{v}</dd>
  </div>
);

export default OrderSuccess;
