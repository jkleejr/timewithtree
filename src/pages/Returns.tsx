import { SiteLayout } from "@/components/SiteLayout";

const Returns = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">교환 및 반품안내</h1>
        <div className="space-y-10 text-base leading-relaxed text-foreground/90">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">교환 및 반품 가능 기간</h2>
            <p className="text-muted-foreground">
              상품 수령 후 7일 이내에 교환 및 반품 신청이 가능합니다. 단, 묘목의 특성상 식재 후에는 교환 및 반품이 어려울 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">교환 및 반품이 가능한 경우</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>배송 중 파손 또는 훼손된 경우</li>
              <li>주문하신 상품과 다른 상품이 배송된 경우</li>
              <li>상품의 하자가 있는 경우</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">교환 및 반품이 불가능한 경우</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>고객님의 책임 있는 사유로 상품이 훼손된 경우</li>
              <li>식재가 진행된 묘목</li>
              <li>수령 후 7일이 경과한 경우</li>
              <li>고객님의 관리 부주의로 인해 묘목이 고사한 경우</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">교환 및 반품 절차</h2>
            <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
              <li>아래 연락처로 교환/반품 신청 (사진 첨부 권장)</li>
              <li>상품 회수 및 검수</li>
              <li>교환 상품 재발송 또는 환불 처리</li>
            </ol>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-3">문의처</h2>
            <p className="text-muted-foreground">
              연락처: 010-8925-6251<br />
              상담시간: 오전 9시 – 오후 5시 (설·추석 외 연중무휴, 주말 오픈)
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Returns;
