import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const orderNumber = params.get("n");

  return (
    <SiteLayout>
      <section className="max-w-2xl mx-auto px-6 md:px-10 pt-20 pb-24 text-center">
        <CheckCircle2 className="h-14 w-14 mx-auto text-accent mb-6" />
        <h1 className="font-display text-3xl md:text-4xl mb-4 font-bold font-sans">
          주문이 접수되었습니다
        </h1>
        {orderNumber && (
          <p className="text-sm text-muted-foreground mb-2">
            주문번호: <span className="font-mono">{orderNumber}</span>
          </p>
        )}
        <p className="text-muted-foreground mt-6 mb-8 leading-relaxed">
          안내된 계좌로 입금해주시면 관리자가 확인 후 배송을 진행합니다.
          <br />
          입금 계좌 정보가 표시되지 않았다면, 곧 입력하신 이메일로 안내가 발송됩니다.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild className="rounded-none">
            <Link to="/shop">계속 쇼핑하기</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <Link to="/account">내 주문 보기</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default OrderSuccess;
