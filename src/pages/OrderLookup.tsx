import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/SiteLayout";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const orderNumberSchema = z
  .string()
  .trim()
  .min(1, { message: "주문번호를 입력해 주세요" })
  .max(64);
const emailSchema = z
  .string()
  .trim()
  .email({ message: "올바른 이메일을 입력해 주세요" })
  .max(255);

const OrderLookup = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validNumber = orderNumberSchema.parse(orderNumber);
      const validEmail = emailSchema.parse(email);

      setLoading(true);
      const { data, error } = await supabase.rpc("lookup_order", {
        p_order_number: validNumber,
        p_email: validEmail,
      });
      setLoading(false);

      const row = Array.isArray(data) ? data[0] : null;
      if (error || !row) {
        toast.error("주문 정보를 찾을 수 없습니다. 주문번호와 이메일을 확인해주세요.");
        return;
      }

      try {
        sessionStorage.setItem(`order_email:${validNumber}`, validEmail);
      } catch {
        // ignore
      }
      navigate(`/orders/${encodeURIComponent(validNumber)}`);
    } catch (err) {
      setLoading(false);
      const msg =
        err instanceof z.ZodError ? err.errors[0].message : "오류가 발생했습니다";
      toast.error(msg);
    }
  };

  return (
    <SiteLayout>
      <Seo
        title="비회원 주문조회 — 나무와 걷는 시간"
        description="주문번호와 이메일을 입력해 비회원으로 진행한 잭큐몬티 자작나무 주문 내역과 상태를 조회하세요."
        path="/order-lookup"
      />

      <section className="max-w-md mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-24">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
          비회원 주문조회
        </p>
        <h1 className="font-display text-4xl md:text-5xl mb-3 font-bold font-sans">
          주문 조회
        </h1>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          비회원으로 주문하신 경우, 주문번호와 주문 시 입력하신 이메일을 입력하면
          주문 내역과 배송 상태를 확인하실 수 있습니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="order_number">주문번호</Label>
            <Input
              id="order_number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="예: ORD-262600-0001"
              required
              maxLength={64}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lookup_email">이메일</Label>
            <Input
              id="lookup_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
            />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-none" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "조회하기"}
          </Button>
        </form>

        <div className="mt-12">
          <BackButton />
        </div>
      </section>
    </SiteLayout>
  );
};

export default OrderLookup;
