import { SiteLayout } from "@/components/SiteLayout";

const Privacy = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h1 className="font-display text-4xl md:text-5xl font-bold font-sans tracking-tight mb-10">
          개인정보처리방침
        </h1>

        <div className="space-y-6 text-base md:text-lg leading-relaxed text-foreground/90">
          <p>
            나무와 걷는 시간(이하 "회사")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하기 위해 노력하고 있습니다. 회사는 본 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          </p>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">1. 수집하는 개인정보 항목</h2>
            <p>
              회사는 회원가입, 주문, 배송, 고객 상담 등을 위해 아래와 같은 최소한의 개인정보를 수집합니다.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>필수항목: 이름, 이메일 주소, 휴대전화번호, 배송지 주소, 주문 정보</li>
              <li>선택항목: 배송 시 요청사항</li>
              <li>자동수집: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">2. 개인정보의 수집 및 이용 목적</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>회원 식별 및 본인 확인, 회원 관리</li>
              <li>상품 주문, 결제, 배송 및 환불 처리</li>
              <li>고객 문의 응대 및 공지사항 전달</li>
              <li>서비스 이용 통계 분석 및 서비스 개선</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">3. 개인정보의 보유 및 이용 기간</h2>
            <p>
              원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령의 규정에 따라 보존할 필요가 있는 경우 아래와 같이 보관합니다.
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
              <li>접속에 관한 기록: 3개월 (통신비밀보호법)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">4. 개인정보의 제3자 제공</h2>
            <p>
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 배송 업무 수행을 위해 배송업체에 수령인 이름, 주소, 연락처를 제공하며, 법령에 따라 요구되는 경우에는 예외로 합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">5. 이용자의 권리</h2>
            <p>
              이용자는 언제든지 본인의 개인정보를 조회, 수정, 삭제, 처리정지를 요청할 수 있으며, 회원 탈퇴를 통해 개인정보 이용 동의를 철회할 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">6. 개인정보의 안전성 확보 조치</h2>
            <p>
              회사는 개인정보의 안전성 확보를 위하여 접근 권한 관리, 암호화된 통신(HTTPS) 사용, 접속기록 보관 등의 기술적·관리적 보호조치를 시행하고 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-3">7. 개인정보 보호책임자 및 문의</h2>
            <p>개인정보 관련 문의사항은 아래 연락처로 연락주시기 바랍니다.</p>
            <ul className="list-none pl-0 mt-2 space-y-1">
              <li>상호: 나무와 걷는 시간</li>
              <li>연락처: 010-8925-6251</li>
              <li>이메일: timewithtree@gmail.com</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground mt-10">
            본 방침은 관련 법령 및 회사 정책의 변경에 따라 개정될 수 있으며, 변경 시 홈페이지를 통해 공지합니다.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Privacy;
