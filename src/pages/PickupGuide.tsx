import { SiteLayout } from "@/components/SiteLayout";
import { Seo } from "@/components/Seo";

const PickupGuide = () => {
  return (
    <SiteLayout>
      <Seo
        title="농장 방문·직접 수령 안내 — 나무와 걷는 시간"
        description="세종시 장군면 송문리·공주시 정안면 대산리 농장의 방문 구입과 직접 나무 수령 절차, 연락처와 영업 시간을 안내합니다."
        path="/pickup-guide"
      />
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-8 md:pt-24 md:pb-12 text-primary">
        <h1 className="font-display text-4xl md:text-5xl font-bold font-sans tracking-tight mb-10">방문 구입 또는 직접 나무 수령시 안내</h1>


        <div className="space-y-10 text-base md:text-lg leading-relaxed text-primary">
          <div>
            <p className="text-primary">
              저희 나무와 걷는 시간 농장은 세종시 장군면 송문리와 공주시 정안면 대산리의 2개 지역에 농장이 있습니다.
            </p>
          </div>

          <div>
            <p className="text-primary">
              농장 방문을 통해 구입을 원하시거나 온라인 주문 후 직접 나무를 가져가실 경우 아래의 번호로 전화 주시면 상세 안내 드리겠습니다.
            </p>
          </div>

          <div>
            <p className="text-primary">
              방문 수령 시 나무 상태를 직접 확인하신 후 선택하여 구매하실 수 있습니다.
            </p>
            <p className="mt-4 text-primary font-semibold">
              연락처 : 010-8925-6251
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary">영업 시간</h2>
            <ul className="space-y-2 text-primary">
              <li>
                평일 : 오전 9시 ~ 오후 6시{" "}
                <span className="text-muted-foreground">(방문 전 2시간 전에 전화 연락 후 방문 부탁드립니다.)</span>
              </li>
              <li>
                주말 : 방문 1일 전 전화 연락 후 방문{" "}
                <span className="text-muted-foreground">(개인 사정으로 방문이 어려울 수도 있습니다.)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default PickupGuide;
