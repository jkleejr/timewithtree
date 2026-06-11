import { AlertCircle } from "lucide-react";

interface OrderPolicyNoticeProps {
  className?: string;
}

export const OrderPolicyNotice = ({ className = "" }: OrderPolicyNoticeProps) => {
  return (
    <div className={`bg-secondary/60 border border-border p-5 md:p-6 flex gap-4 md:gap-6 ${className}`}>
      <div className="shrink-0 flex flex-col items-center text-muted-foreground">
        <AlertCircle className="h-16 w-16 md:h-20 md:w-20" strokeWidth={1.5} />
        <span className="mt-2 text-sm md:text-base tracking-wider">필독하세요!</span>
      </div>
      <ul className="text-xs md:text-sm leading-relaxed space-y-1.5 list-disc pl-4 marker:text-muted-foreground">
        <li>택배비 또는 용달비는 고객님이 부담합니다.</li>
        <li>제주도, 섬, 도서산간지역의 배송비는 결제금액과 관계없이 고객 부담입니다.</li>
        <li>품절 또는 삭제된 옵션의 상품이 있을 경우 주문이 되지 않습니다. 해당 항목을 삭제 후 다시 주문해주세요.</li>
        <li className="text-destructive">
          용달 배송 상품의 경우 용달 배송비는 상품 금액과 별도이며, 화물차 기사님께 직접 지불해주셔야 합니다.
        </li>
        <li className="text-destructive">
          무통장 입금 후 관리자가 입금을 확인한 뒤 배송이 진행됩니다. 입금자명을 정확히 입력해주세요.
        </li>
      </ul>
    </div>
  );
};
