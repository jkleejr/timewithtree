import { MapPin, Phone, Clock } from "lucide-react";

type Variant = "section" | "footer";

const InfoRow = ({ label, children }: { label: string; children?: React.ReactNode }) => (
  <p className="leading-relaxed">
    <span className="text-muted-foreground">{label} :</span> {children}
  </p>
);

export const FarmContact = ({ variant = "section" }: { variant?: Variant }) => {
  if (variant === "footer") {
    return (
      <div className="text-sm space-y-4">
        <div className="font-display text-xl md:text-2xl">나무와 걷는 시간</div>
        <div className="space-y-1">
          <InfoRow label="상호">나무와 걷는 시간</InfoRow>
          <InfoRow label="사업자등록번호">302-93-11822</InfoRow>
          <InfoRow label="통신판매신고"> </InfoRow>
          <InfoRow label="문의전화">
            <a href="tel:01089256251" className="hover:text-accent transition-colors">
              010-8925-6251
            </a>
          </InfoRow>
          <InfoRow label="이메일">
            <a href="mailto:timewithtree@gmail.com" className="hover:text-accent transition-colors">
              timewithtree@gmail.com
            </a>
          </InfoRow>
          <InfoRow label="제1농장">세종시 장군면 송문리</InfoRow>
          <InfoRow label="제2농장">충청남도 공주시 정안면 대산리</InfoRow>
        </div>
      </div>
    );
  }

  return (
    <section className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Visit & Contact</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight font-sans">
            나무와 걷는 시간 농장
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            저희 농장은 세종시 장군면과 공주시 정안면, 두 곳에 위치하고 있습니다.
          </p>
        </div>
        <div className="md:col-span-7 md:col-start-6 grid sm:grid-cols-2 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
              <MapPin className="h-3.5 w-3.5" /> 농장 주소
            </div>
            <p className="leading-relaxed">
              <span className="text-muted-foreground">세종시 :</span>
              <br />
              세종시 장군면 송문리 72-7
            </p>
            <p className="leading-relaxed mt-3">
              <span className="text-muted-foreground">공주시 :</span>
              <br />
              공주시 정안면 대산리 397
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
              <Phone className="h-3.5 w-3.5" /> 연락처
            </div>
            <a href="tel:+821089256251" className="hover:text-accent transition-colors">
              010-8925-6251
            </a>
            <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
              방문 2시간 전 전화 또는 문자로 연락 후 방문해 주시면 수령시간을 단축할 수 있습니다.
            </p>

            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mt-6 mb-3">
              <Clock className="h-3.5 w-3.5" /> 상담 가능 시간
            </div>
            <p className="leading-relaxed">
              오전 9시 – 오후 5시
              <br />
              <span className="text-muted-foreground text-xs">설·추석 외 연중무휴 · 주말 오픈</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
