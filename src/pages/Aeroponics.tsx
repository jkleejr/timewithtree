import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";

const benefits = [
  {
    label: "ROOT SYSTEM",
    title: "뿌리 회전 완전 방지",
    body: "옆면 통기 구멍으로 뿌리 끝이 공기와 만나 자연 건조되면서 뺑뺑이 현상 없이 방사형으로 발달합니다.",
  },
  {
    label: "ROOT SYSTEM",
    title: "잔뿌리 폭발적 증가",
    body: "뿌리 끝이 지속적으로 분지되어 양분·수분 흡수력이 크게 향상됩니다.",
  },
  {
    label: "HEALTH",
    title: "과습 & 뿌리썩음 예방",
    body: "옆면 전체가 통풍구 역할을 해 배수와 증발이 동시에 이루어집니다.",
  },
  {
    label: "HEALTH",
    title: "토양 산소 공급",
    body: "뿌리 호흡이 활발해져 건강한 뿌리 시스템을 형성합니다.",
  },
  {
    label: "TRANSPLANT",
    title: "이식 성공률 매우 높음",
    body: "잔뿌리가 풍부해 식재 후 활착이 빠르고 고사율이 현저히 낮습니다.",
  },
  {
    label: "GROWTH",
    title: "생육 속도 & 균일성 향상",
    body: "개체 간 편차가 줄고 동일 조건에서 성장 속도가 빨라집니다.",
  },
  {
    label: "FORM",
    title: "균일하고 우수한 수형 형성",
    body: "건강한 뿌리 시스템이 지상부에 영향을 미쳐 줄기와 가지가 균형 있게 발달합니다.",
  },
  {
    label: "TRANSPLANT",
    title: "이식 안정성 보장",
    body: "뿌리가 균일하게 퍼져 있어 이식 시 구조가 유지되며, 감긴 뿌리를 풀다가 손상될 위험이 없습니다.",
  },
];

const Aeroponics = () => {
  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <p className="text-xs md:text-sm font-sans font-semibold text-primary uppercase tracking-[0.25em] mb-4 opacity-70">
          AIR POT CULTIVATION
        </p>
        <h1 className="font-display leading-tight mb-6 font-sans text-3xl sm:text-4xl md:text-5xl font-bold">
          🌿 에어포트 (Air Pot) 재배 방식이란?
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-primary max-w-3xl">
          저희 자작나무는 일반 화분이 아닌 에어포트에서 재배됩니다. 에어포트란 옆면 전체에 통기 구멍이 있는 특수 용기로, 뿌리 품질을 근본적으로 높여주는 재배 방식입니다.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-20">
        <div className="border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {benefits.map((b, i) => {
              const num = String(i + 1).padStart(2, "0");
              const isLastRowLeft = i === benefits.length - 2;
              const isLastRowRight = i === benefits.length - 1;
              return (
                <article
                  key={i}
                  className={`relative p-8 md:p-10 ${
                    i % 2 === 0 ? "md:border-r border-border" : ""
                  } ${
                    !(isLastRowLeft || isLastRowRight) ? "border-b border-border" : "md:border-b-0 border-b"
                  }`}
                >
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="font-display text-4xl md:text-5xl font-bold tabular-nums text-[hsl(var(--primary))] opacity-90" style={{ color: "rgb(85, 138, 73)" }}>
                      {num}
                    </span>
                    <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                      {b.label}
                    </span>
                  </div>
                  <h2 className="font-display text-xl md:text-2xl font-bold font-sans mb-3 text-primary">
                    {b.title}
                  </h2>
                  <p className="leading-relaxed text-primary text-sm md:text-base">
                    {b.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-16">
          <div className="relative border border-border bg-secondary/40 p-8 md:p-10 pl-10 md:pl-12">
            <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: "rgb(85, 138, 73)" }} />
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4" style={{ color: "rgb(85, 138, 73)" }} />
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground">
                참고 / NOTES
              </p>
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold font-sans mb-4 text-primary">
              단점 및 관리 시 유의사항
            </h3>
            <ul className="space-y-2 text-primary leading-relaxed">
              <li className="flex gap-3">
                <span className="text-muted-foreground">·</span>
                <span>물이 빨리 마름 → 관수 관리가 중요합니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground">·</span>
                <span>가격이 일반 화분보다 비쌉니다.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground">·</span>
                <span>바람이 강하면 건조 스트레스가 발생할 수 있습니다.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center">
          <BackButton />
          <Button asChild size="lg" className="rounded-none">
            <Link to="/shop">
              구매하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Aeroponics;
