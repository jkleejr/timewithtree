import { SiteLayout } from "@/components/SiteLayout";

const paragraphs = [
  "생물이다 보니 사진과 실제 상품이 다를 수 있으며, 같은 품종이더라도 개체에 따라 수형이나 크기에 다소 차이가 있을 수 있습니다. 또한 나무의 특성에 따라 잔뿌리의 양이 많거나 적을 수 있습니다.",
  "배송되는 나무는 철저히 검수 후 발송되지만, 수령 후 뿌리가 손상되었거나 줄기가 마른 경우 규정상 수령 후 2일 이내에 반품, 교환, 환불이 가능합니다. (식재한 경우 어떠한 사유로도 교환 및 환불이 불가합니다.)",
  "차량 배송 특성상 일부 가지가 부러지거나 흙이 흘러내리는 경우가 있을 수 있습니다. 생육에 지장이 없는 경미한 손상의 경우 반품, 교환, 환불 사유가 될 수 없음을 안내드립니다.",
  "나무는 공산품과 다르게 생물 특성상 주문 시에도 품절되거나 품질 상태 문제로 주문취소 될 수 있습니다.",
  "배송준비중 단계에서는 교환, 반품, 주문 변경 및 취소가 불가합니다.",
  "차량배송 품목의 경우 운반비 및 배송지, 시기 확인 후 문의 바랍니다. (별도운반비)",
  "전화번호, 배송지 등 정보 기입 실수로 인한 반송 시 추가 운임료가 발생할 수 있습니다. 나무의 크기와 무게에 따라 추가 배송비가 발생할 수 있습니다. (제주, 산간지역 및 도서 지역은 생물 특성상 공휴일과 주말이 끼었는 경우 휴일 이후 발송되며, 해운료 및 도서 배송비가 추가 발생할 수 있습니다.)",
];

const exchangeReturn = [
  "반품은 상품이 불량이거나 파손되는 등 문제가 있을 경우만 가능하며, 반품 시 반송비용을 별도로 지불하지 않으셔도 됩니다. 상품의 교환은 100% 가능합니다. 단, 반품 시에는 상품 수령 시와 동일한 상태로 보존하셔야 합니다. 배송 파손으로 인한 교환 시 재배송은 수령 후 3~4일 정도 소요됩니다.",
  "식재 후 나무가 고사한 경우 반품 및 환불이 불가능합니다. 반드시 수령 즉시 상태를 확인하시고, 이상이 있으신 경우 바로 연락을 주셔야 반품, 교환, 환불이 가능합니다.",
  "고객의 단순 변심에 의한 교환 및 반품은 생물의 특성상 불가능합니다.",
  "수령한 나무의 품종이 다른 경우, 수령 후 일정 기간 내 잎, 수형 등 외형으로 품종 착오가 객관적으로 확인된 경우에 한해 동일 품종으로 재공급해드립니다.",
  "당사의 귀책사유가 확인된 경우 해당 나무로 재공급합니다.",
  "교환, 취소, 반품의 경우 반드시 아래 연락처로 사전 통화 후 진행하셔야 합니다.",
  "기타 문의사항이 있으시면 언제든지 연락 주십시오. 고객님의 불편을 최소화하도록 노력하겠습니다.",
];

const refunds = [
  "신용카드 결제 : 상품 회수 확인 후 해당 카드사로 청구취소 요청 (약 7일 정도 소요)",
  "무통장 입금 : 상품 회수 확인 후 3일 이내에 환불 처리",
  "인터넷 안전결제 ISP 결제 : 상품 회수 확인 후 매달 1, 8, 15, 22일 해당 카드사로 청구취소 요청",
];

const Returns = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-10">교환 및 반품안내</h1>

        <div className="space-y-5 text-base leading-relaxed text-foreground/90">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-5">【교환 및 반품안내】</h2>
        <div className="space-y-5 text-base leading-relaxed text-foreground/90">
          {exchangeReturn.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mt-12 mb-5">【환불안내】</h2>
        <div className="space-y-3 text-base leading-relaxed text-foreground/90">
          {refunds.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Returns;
