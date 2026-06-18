import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Check, Copy, Loader2, Search } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useDaumPostcode } from "@/hooks/useDaumPostcode";
import { OrderPolicyNotice } from "@/components/OrderPolicyNotice";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

const BANK_ACCOUNT = "NH농협은행 301-0327-2621-11";

type PartyForm = {
  name: string;
  phone: string;
  tel: string;
  postal: string;
  address1: string;
  address2: string;
  address_note: string;
};

const emptyParty: PartyForm = {
  name: "",
  phone: "",
  tel: "",
  postal: "",
  address1: "",
  address2: "",
  address_note: "",
};

const partySchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요").max(100),
  phone: z.string().trim().min(1, "핸드폰 번호를 입력해주세요").max(30),
  tel: z.string().trim().max(30).optional().or(z.literal("")),
  postal: z.string().trim().min(1, "우편번호를 입력해주세요").max(20),
  address1: z.string().trim().min(1, "주소를 입력해주세요").max(300),
  address2: z.string().trim().max(300).optional().or(z.literal("")),
  address_note: z.string().trim().max(200).optional().or(z.literal("")),
});

const ordererSchema = partySchema.extend({
  email: z.string().trim().email("올바른 이메일을 입력해주세요").max(255),
});

function composeAddress(p: PartyForm) {
  const parts = [`[${p.postal}]`, p.address1, p.address2].filter(Boolean);
  const base = parts.join(" ").trim();
  return p.address_note ? `${base} (참고: ${p.address_note})` : base;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, clearCart } = useCartStore();
  const { open: openPostcode } = useDaumPostcode();

  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "card">("bank");
  const [copied, setCopied] = useState(false);

  const [orderer, setOrderer] = useState<PartyForm & { email: string }>({
    ...emptyParty,
    email: "",
  });
  const [recipient, setRecipient] = useState<PartyForm>({ ...emptyParty });
  const [sameAsOrderer, setSameAsOrderer] = useState(true);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [depositorName, setDepositorName] = useState("");
  const [depositorSame, setDepositorSame] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, address, postal_code")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      setOrderer((o) => ({
        ...o,
        email: o.email || user.email || "",
        name: o.name || data?.full_name || "",
        phone: o.phone || data?.phone || "",
        postal: o.postal || data?.postal_code || "",
        address1: o.address1 || data?.address || "",
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (depositorSame) setDepositorName(orderer.name);
  }, [depositorSame, orderer.name]);

  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "KRW";

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText("301-0327-2621-11");
      setCopied(true);
      toast.success("계좌번호가 복사되었습니다");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  const searchOrdererAddress = () =>
    openPostcode(({ postalCode, address }) =>
      setOrderer((o) => ({ ...o, postal: postalCode, address1: address })),
    );

  const searchRecipientAddress = () =>
    openPostcode(({ postalCode, address }) =>
      setRecipient((r) => ({ ...r, postal: postalCode, address1: address })),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === "card") {
      toast.info("신용카드 결제는 준비 중입니다. 무통장입금으로 진행해주세요.");
      return;
    }

    const ordererParsed = ordererSchema.safeParse(orderer);
    if (!ordererParsed.success) {
      toast.error("주문자 정보: " + ordererParsed.error.errors[0].message);
      return;
    }

    const effectiveRecipient: PartyForm = sameAsOrderer
      ? { ...orderer, name: orderer.name, phone: orderer.phone }
      : recipient;

    if (!sameAsOrderer) {
      const recipParsed = partySchema.safeParse(recipient);
      if (!recipParsed.success) {
        toast.error("받으시는 분: " + recipParsed.error.errors[0].message);
        return;
      }
    }

    if (!depositorName.trim()) {
      toast.error("입금자명을 입력해주세요");
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

    const noteLines = [
      `[받는분] ${effectiveRecipient.name || orderer.name} / ${effectiveRecipient.phone || orderer.phone}`,
      deliveryDate ? `[배송일] ${deliveryDate}` : null,
      deliveryMessage.trim() ? `[전하시는 말씀] ${deliveryMessage.trim()}` : null,
      `[입금자명] ${depositorName.trim()}`,
      `[주문자 전화] ${orderer.phone}`,
    ].filter(Boolean);
    const customerNote = noteLines.join("\n");

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_name: orderer.name,
        customer_phone: orderer.phone,
        customer_tel: orderer.tel || null,
        customer_email: orderer.email,
        shipping_address: composeAddress(effectiveRecipient),
        postal_code: effectiveRecipient.postal || null,
        recipient_name: sameAsOrderer ? null : effectiveRecipient.name,
        recipient_phone: sameAsOrderer ? null : effectiveRecipient.phone,
        recipient_tel: sameAsOrderer ? null : (effectiveRecipient.tel || null),
        recipient_address: sameAsOrderer ? null : composeAddress(effectiveRecipient),
        recipient_postal_code: sameAsOrderer ? null : (effectiveRecipient.postal || null),
        delivery_message: deliveryMessage.trim() || null,
        payment_method: "bank_transfer",
        depositor_name: depositorName.trim(),
        bank_account: BANK_ACCOUNT,
        customer_note: customerNote,
        items: orderItems,
        subtotal,
        currency,
        status: "pending",
      })
      .select("id, order_number")
      .single();

    if (error || !data) {
      console.error("Order insert failed", error?.code);
      toast.error("주문 접수에 실패했습니다. 다시 시도해주세요.");
      setSubmitting(false);
      return;
    }

    // Admin notification is sent server-side via a database trigger
    // (notify_admin_on_new_order) when the order row is inserted.

    clearCart();
    try {
      sessionStorage.setItem(`order_email:${data.order_number}`, orderer.email);
    } catch {
      // ignore storage errors
    }

    // Save orderer info to profile for next time (logged-in users only)
    if (user) {
      const savedAddress = [orderer.address1, orderer.address2].filter(Boolean).join(" ").trim();
      await supabase
        .from("profiles")
        .update({
          full_name: orderer.name || null,
          phone: orderer.phone || null,
          address: savedAddress || null,
          postal_code: orderer.postal || null,
        })
        .eq("id", user.id);
    }

    navigate(`/order-success?n=${encodeURIComponent(data.order_number)}`);
  };

  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-24">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">결제</p>
        <h1 className="font-display text-4xl md:text-5xl mb-10 font-bold font-sans">주문 결제</h1>

        <OrderPolicyNotice className="mb-8" />

        <div className="grid lg:grid-cols-3 gap-12">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* 주문자 / 수령인 2-column */}
            <div className="grid md:grid-cols-2 gap-6">
              <PartyCard
                title="주문하시는 분"
                values={orderer}
                onChange={(patch) => setOrderer((o) => ({ ...o, ...patch }))}
                onSearchAddress={searchOrdererAddress}
                emailField
              />

              <div className="border border-border p-6 md:p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-sans">받으시는 분</h2>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={sameAsOrderer}
                      onCheckedChange={(c) => {
                        const v = c === true;
                        setSameAsOrderer(v);
                        if (v) setRecipient({ ...emptyParty });
                      }}
                    />
                    <span>주문자와 동일</span>
                  </label>
                </div>

                {sameAsOrderer ? (
                  <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border">
                    주문자 정보로 배송됩니다.
                  </p>
                ) : (
                  <PartyFields
                    values={recipient}
                    onChange={(patch) => setRecipient((r) => ({ ...r, ...patch }))}
                    onSearchAddress={searchRecipientAddress}
                  />
                )}

                <div className="space-y-2 pt-2">
                  <Label htmlFor="delivery_message" className="text-sm">전하시는 말씀</Label>
                  <Textarea
                    id="delivery_message"
                    rows={3}
                    value={deliveryMessage}
                    onChange={(e) => setDeliveryMessage(e.target.value)}
                    placeholder="배송 시 요청사항을 적어주세요 (선택)"
                  />
                </div>
              </div>
            </div>

            {/* 결제정보 */}
            <div className="border border-border p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-xl font-sans">결제정보</h2>
                <p className="text-sm text-muted-foreground mt-2">결제는 무통장입금만 가능합니다.</p>
              </div>

              <div className="bg-secondary p-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">주문총액</span>
                  <span className="tabular-nums">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">용달배송</span>
                  <span>별도</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <span className="font-medium">총주문금액</span>
                  <span className="font-display text-xl tabular-nums font-sans">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-sm text-muted-foreground">결제수단</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={cn(
                      "px-5 py-2 text-sm border transition-colors min-w-[100px]",
                      paymentMethod === "card"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary text-primary bg-background hover:bg-primary/5",
                    )}
                  >
                    신용카드
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={cn(
                      "px-5 py-2 text-sm border transition-colors min-w-[100px]",
                      paymentMethod === "bank"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary text-primary bg-background hover:bg-primary/5",
                    )}
                  >
                    무통장 입금
                  </button>
                </div>
              </div>

              {paymentMethod === "bank" && (
                <div className="space-y-5">
                  <div className="border border-border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">계좌번호</p>
                          <p className="font-medium tabular-nums">{BANK_ACCOUNT}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">계좌명</p>
                          <p className="font-medium text-foreground">고준서</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyAccount}
                        className="rounded-none shrink-0"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" /> 복사됨
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" /> 계좌복사
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="depositor_name">입금자명 *</Label>
                    <Input
                      id="depositor_name"
                      value={depositorName}
                      onChange={(e) => {
                        setDepositorSame(false);
                        setDepositorName(e.target.value);
                      }}
                      placeholder="입금자명"
                      required
                    />
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={depositorSame}
                        onCheckedChange={(c) => setDepositorSame(c === true)}
                      />
                      <span>주문자 이름과 동일</span>
                    </label>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    * 주문 접수 후 위 계좌로 입금해주시면 관리자가 확인 후 배송을 진행합니다.
                    용달 배송비는 별도로 화물차 기사님께 직접 지불해주세요.
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="bg-secondary p-5 text-sm text-muted-foreground">
                  신용카드 결제는 현재 준비 중입니다. 한국 PG사 연동 후 이용 가능하실 예정입니다.
                  지금은 무통장 입금으로 진행해주세요.
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-none"
              disabled={submitting || paymentMethod === "card"}
            >
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
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">주문총액</span>
                  <span className="tabular-nums">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">용달배송</span>
                  <span>별도</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <span className="text-base font-sans">총주문금액</span>
                  <span className="font-display text-2xl tabular-nums font-sans">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
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

// ─── helpers ──────────────────────────────────────────────────────────────

type PartyCardProps = {
  title: string;
  values: PartyForm & { email?: string };
  onChange: (patch: Partial<PartyForm & { email: string }>) => void;
  onSearchAddress: () => void;
  emailField?: boolean;
};

const PartyCard = ({ title, values, onChange, onSearchAddress, emailField }: PartyCardProps) => (
  <div className="border border-border p-6 md:p-7 space-y-5">
    <h2 className="font-display text-xl font-sans">{title}</h2>
    <PartyFields
      values={values}
      onChange={onChange}
      onSearchAddress={onSearchAddress}
      email={emailField ? values.email ?? "" : undefined}
      onEmailChange={emailField ? (v) => onChange({ email: v }) : undefined}
    />
  </div>
);

type PartyFieldsProps = {
  values: PartyForm;
  onChange: (patch: Partial<PartyForm>) => void;
  onSearchAddress: () => void;
  email?: string;
  onEmailChange?: (v: string) => void;
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid grid-cols-[68px_1fr] items-center gap-3">
    <Label className="text-sm text-muted-foreground">{label}</Label>
    <div className="min-w-0">{children}</div>
  </div>
);

const PartyFields = ({ values, onChange, onSearchAddress, email, onEmailChange }: PartyFieldsProps) => (
  <div className="space-y-3">
    <Row label="이름 *">
      <Input value={values.name} onChange={(e) => onChange({ name: e.target.value })} required />
    </Row>
    <Row label="핸드폰 *">
      <Input
        placeholder="010-0000-0000"
        value={values.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
        required
      />
    </Row>
    <Row label="전화번호">
      <Input value={values.tel} onChange={(e) => onChange({ tel: e.target.value })} />
    </Row>
    {onEmailChange !== undefined && (
      <Row label="이메일 *">
        <Input
          type="email"
          value={email ?? ""}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </Row>
    )}
    <Row label="주소 *">
      <div className="flex gap-2">
        <Input
          placeholder="우편번호"
          value={values.postal}
          onChange={(e) => onChange({ postal: e.target.value })}
          readOnly
          className="max-w-[140px] bg-secondary"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSearchAddress}
          className="rounded-none shrink-0"
        >
          <Search className="h-4 w-4" /> 주소 검색
        </Button>
      </div>
    </Row>
    <Row label="">
      <Input
        placeholder="기본주소"
        value={values.address1}
        onChange={(e) => onChange({ address1: e.target.value })}
        readOnly
        className="bg-secondary"
      />
    </Row>
    <Row label="">
      <Input
        placeholder="상세주소"
        value={values.address2}
        onChange={(e) => onChange({ address2: e.target.value })}
      />
    </Row>
    <Row label="">
      <Input
        placeholder="참고항목 (선택)"
        value={values.address_note}
        onChange={(e) => onChange({ address_note: e.target.value })}
      />
    </Row>
  </div>
);

export default Checkout;
