import { AlertCircle } from "lucide-react";

interface OrderPolicyNoticeProps {
  className?: string;
}

export const OrderPolicyNotice = ({ className = "" }: OrderPolicyNoticeProps) => {
  return (
    <div className={`bg-secondary/60 border border-border p-5 md:p-6 flex gap-4 md:gap-6 ${className}`}>
      <div className="shrink-0 flex flex-col items-center text-foreground">
        <AlertCircle className="h-16 w-16 md:h-20 md:w-20" strokeWidth={1.5} />
        <span className="mt-2 text-sm md:text-base tracking-wider">필독하세요!</span>
      </div>
      <ul className="text-xs md:text-sm leading-relaxed space-y-1.5 list-disc pl-4 marker:text-foreground text-foreground">
        <li>
          <strong className="font-bold">저희 나무와 걷는 시간의 자작나무 묘목은</strong>{" "}
          <span className="text-warning-red font-bold">차량(용달)배송만 가능합니다.</span>
        </li>
        <li className="text-warning-red font-bold">
          차량(용달)배송비는 착불로 진행되며 고객이 나무를 수령 후 직접 배송 기사에게 지급하시면 됩니다.
        </li>
        <li>제주도 등의 섬 (도서산간지역)으로는 배송이 불가합니다.</li>
        <li>주문하신 상품이 품절일 경우 고객님과 연락 후 환불 또는 대체 상품으로 진행됩니다.</li>
        <li>
          무통장 입금 방식으로 결제시 관리자가 입금을 확인한 후 배송이 진행됩니다. 입금자명을 정확히 입력해주세요.
        </li>
      </ul>
    </div>
  );
};
