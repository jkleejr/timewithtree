import { SiteLayout } from "@/components/SiteLayout";
import { ReactNode } from "react";

const Bullet = ({ children }: { children: ReactNode }) => (
  <li className="flex items-start gap-3">
    <span aria-hidden className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
    <div className="flex-1">{children}</div>
  </li>
);

const Privacy = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <h1 className="font-display text-4xl md:text-5xl font-bold font-sans tracking-tight mb-10">
          개인정보처리방침
        </h1>

        <div className="space-y-10 text-base md:text-lg leading-relaxed text-foreground/90">
          <div className="space-y-4">
            <p>
              &apos;나무와 걷는 시간&apos;은 (이하 &apos;회사&apos;는) 고객님의 개인정보를 중요시하며, &quot;정보통신망 이용촉진 및 정보보호&quot;에 관한 법률을 준수하고 있습니다.
            </p>
            <p>
              회사는 개인정보취급방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>
            <p>
              회사는 개인정보취급방침을 개정하는 경우 웹사이트 공지사항(또는 개별공지)을 통하여 공지할 것입니다.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">수집하는 개인정보 항목</h2>
            <p>회사는 나무 묘목 판매를 위해 아래의 개인정보를 수집하고 있습니다.</p>
            <ul className="space-y-2 pl-1">
              <Bullet>
                <span className="font-semibold text-foreground">수집항목 :</span> 로그인ID, 비밀번호, 이름, 이메일, 주소, 휴대폰번호, 서비스 이용기록, 접속 로그, 접속 IP 정보, 결제기록
              </Bullet>
              <Bullet>
                <span className="font-semibold text-foreground">개인정보 수집방법 :</span> 홈페이지
              </Bullet>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">개인정보의 수집 및 이용목적</h2>
            <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
            <ul className="space-y-2 pl-1">
              <Bullet>
                <span className="font-semibold text-foreground">서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 구매 및 요금 결제 :</span> 물품배송 또는 청구지 등 발송
              </Bullet>
              <Bullet>
                <span className="font-semibold text-foreground">회원 관리 :</span> 회원제 서비스 이용에 따른 본인확인, 개인 식별, 연령확인, 만14세 미만 아동 개인정보 수집 시 법정 대리인 동의여부 확인, 고지사항 전달
              </Bullet>
              <Bullet>
                <span className="font-semibold text-foreground">마케팅 및 광고에 활용 :</span> 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계
              </Bullet>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">개인정보의 보유 및 이용기간</h2>
            <p>회사는 개인정보 수집 및 이용목적이 달성된 후에는 예외 없이 해당 정보를 지체 없이 파기합니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">개인정보의 파기절차 및 방법</h2>
            <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.</p>
            <ul className="space-y-4 pl-1">
              <Bullet>
                <p className="font-semibold text-foreground mb-1">파기절차</p>
                <p>
                  회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기되어집니다.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 보유되어지는 이외의 다른 목적으로 이용되지 않습니다.
                </p>
              </Bullet>
              <Bullet>
                <p className="font-semibold text-foreground mb-1">파기방법</p>
                <p>전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</p>
              </Bullet>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">개인정보 제공</h2>
            <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.</p>
            <ul className="space-y-2 pl-1">
              <Bullet>이용자들이 사전에 동의한 경우</Bullet>
              <Bullet>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</Bullet>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">수집한 개인정보의 위탁</h2>
            <p>회사는 고객님의 동의없이 고객님의 정보를 외부 업체에 위탁하지 않습니다. 향후 그러한 필요가 생길 경우, 위탁 대상자와 위탁 업무 내용에 대해 고객님에게 통지하고 필요한 경우 사전 동의를 받도록 하겠습니다.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">이용자 및 법정대리인의 권리와 그 행사방법</h2>
            <div className="space-y-3">
              <p>이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.</p>
              <p>
                이용자 혹은 만 14세 미만 아동의 개인정보 조회 및 수정을 위해서는 개인정보변경(또는 회원정보수정 등)을 가입해지(동의철회)를 위해서는 &ldquo;회원탈퇴&rdquo;를 클릭 하여 본인 확인 절차를 거치신 후 직접 열람, 정정 또는 탈퇴가 가능합니다. 혹은 개인정보관리책임자에게 서면, 전화 또는 이메일로 연락하시면 지체없이 조치하겠습니다.
              </p>
              <p>
                귀하가 개인정보의 오류에 대한 정정을 요청하신 경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체없이 통지하여 정정이 이루어지도록 하겠습니다.
              </p>
              <p>
                나무와 걷는 시간은 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된 개인정보는 &ldquo;회사가 수집하는 개인정보의 보유 및 이용기간&rdquo;에 명시된 바에 따라 처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">개인정보에 관한 민원서비스</h2>
            <p>회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 개인정보관리책임자를 지정하고 있습니다.</p>

            <div className="bg-muted p-5 rounded-lg border border-border space-y-2 text-base">
              <p><span className="font-semibold text-foreground">고객서비스담당 부서 :</span> 나무와 걷는 시간</p>
              <p><span className="font-semibold text-foreground">휴대전화 :</span> 010-8925-6251</p>
              <p><span className="font-semibold text-foreground">이메일 :</span> timewithtree@gmail.com</p>
              <p><span className="font-semibold text-foreground">개인정보관리책임자 성명 :</span> 고준서</p>
            </div>

            <p>귀하께서는 회사의 서비스를 이용하시며 발생하는 모든 개인정보보호 관련 민원을 개인정보관리책임자에게 신고하실 수 있습니다. 회사는 이용자들의 신고사항에 대해 신속하게 충분한 답변을 드릴 것입니다.</p>

            <div className="space-y-2 pt-2">
              <p className="font-medium text-foreground">기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.</p>
              <ul className="space-y-2 pl-1 text-sm text-muted-foreground">
                <Bullet>
                  개인분쟁조정위원회 (
                  <a href="https://www.1336.or.kr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">www.1336.or.kr</a>
                  {" "}/ 1336)
                </Bullet>
                <Bullet>
                  정보보호마크인증위원회 (
                  <a href="https://www.eprivacy.or.kr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">www.eprivacy.or.kr</a>
                  {" "}/ 02-580-0533~4)
                </Bullet>
                <Bullet>
                  대검찰청 인터넷범죄수사센터 (
                  <a href="http://icic.sppo.go.kr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">http://icic.sppo.go.kr</a>
                  {" "}/ 02-3480-3600)
                </Bullet>
                <Bullet>
                  경찰청 사이버테러대응센터 (
                  <a href="https://www.ctrc.go.kr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">www.ctrc.go.kr</a>
                  {" "}/ 02-392-0330)
                </Bullet>
              </ul>
            </div>
          </section>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Privacy;
