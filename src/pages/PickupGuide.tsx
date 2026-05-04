import { SiteLayout } from "@/components/SiteLayout";

const PickupGuide = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24 text-primary">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-10">방문 수령시 안내</h1>

        <div className="space-y-10 text-base leading-relaxed text-primary">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary">네비 검색 안내</h2>
            <p className="text-primary">
              저희 나무와 걷는 시간 농장은 세종시 장군면과 공주시 정안면의 2개 지역에 농장이 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary">2개 농장의 주소</h2>
            <ul className="space-y-2 text-primary">
              <li>세종시 : 세종시 장군면 송문리 72-7</li>
              <li>공주시 : 공주시 정안면 대산리 397</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary">연락처</h2>
            <p className="text-primary">010-8925-6251</p>
            <p className="mt-3 text-primary">
              방문 전 2시간 전에 전화나 문자로 연락 후 방문해 주시면 수령 준비를 미리 해드릴 수 있어 대기 시간을 단축할 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary">상담 가능 시간</h2>
            <p className="text-primary">
              오전 9시 ~ 오후 5시<br />
              설, 추석 외 연중 무휴 오픈합니다.
            </p>
          </div>

          <div className="space-y-5 border-t pt-8 border-primary-foreground">
            <p className="text-primary">
              방문 수령 시 나무 상태를 직접 확인하신 후 선택하여 구매하실 수 있습니다.
            </p>
            <p className="text-primary">
              (상담 가능 시간 AM 9:00 ~ PM 5:00) 설, 추석 외 연중 무휴 주말오픈 합니다.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default PickupGuide;
