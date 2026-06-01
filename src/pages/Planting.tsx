import { Link } from "react-router-dom";
import { Leaf, AlertTriangle, Shovel, Scissors, Sprout, Layers, Mountain, Droplets, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import treeMeasurements from "@/assets/tree-measurements.png";
import plantingMistakes from "@/assets/planting-mistakes.png";
import plantingCorrectVsWrong from "@/assets/planting-correct-vs-wrong.png";

const steps = [
  { icon: MapPin, title: "장소 정리", body: "식재할 장소를 정리해줍니다." },
  { icon: Scissors, title: "가지·뿌리 정리", body: "필요 이상으로 긴 가지나 뿌리는 정리해줍니다." },
  { icon: Shovel, title: "구덩이 파기", body: "뿌리분 뿌리보다 1.5배 크기로 구덩이를 팝니다." },
  { icon: Sprout, title: "묘목 식재", body: "뿌리가 휘거나 구부러지지 않게 곧게 펴서 구덩이에 넣고 흙을 2/3 정도 채워줍니다." },
  { icon: Layers, title: "흙 채우기", body: "뿌리 사이에 흙이 잘 채워지도록 묘목을 흔들어 준 후 곧게 세워줍니다." },
  { icon: Mountain, title: "마무리 복토", body: "나머지 흙으로 지면보다 약간 높게 흙을 덮어줍니다." },
  { icon: Droplets, title: "물 관리", body: "식재 후 물을 충분히 주고 뿌리가 활착될 때까지 지속적으로 물 관리를 해줍니다." },
];

const measurements = [
  { code: "H", name: "수고", body: "지면으로부터 수목의 맨 윗부분(상순의 끝)까지의 길이, 수목의 키. (단위 m)" },
  { code: "W", name: "수관폭", body: "가지의 끝과 반대쪽 가지의 끝까지의 너비. (단위 m)" },
  { code: "R", name: "근원직경", body: "줄기의 지면에 닿는 부분의 지름, 둘레를 π(3.14)로 나눈 값. (단위 cm)" },
  { code: "B", name: "흉고직경", body: "지면으로부터 1m 20cm 높이의 줄기 지름, 둘레를 π(3.14)로 나눈 값. (단위 cm)" },
];

const cautions = [
  { icon: "❌", text: "묘목이 기울어져 있거나 뿌리가 뭉쳐 있다." },
  { icon: "❌", text: "구덩이가 얕아서 뿌리가 밖으로 나온다." },
  { icon: "⚠️", text: "비탈진 경사면에 심을 때는 흙을 수평으로 하고 상단 경사면에 이어서 심지 않는다." },
  { icon: "⚠️", text: "식재 시 비료나 완숙되지 않은 거름을 넣고 심을 경우 가스 발생으로 흙과 뿌리 밀어냄 현상이 일어날 수 있어 주의가 필요합니다. 뿌리 활착이 끝나더라도 첫해는 소량만 주는 것이 적절합니다." },
];

const Planting = () => {
  return (
    <SiteLayout>
      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <p className="text-xs md:text-sm font-sans font-semibold text-primary uppercase tracking-[0.25em] mb-4 opacity-70">
          PLANTING GUIDE
        </p>
        <h1 className="font-display leading-tight mb-6 font-sans text-4xl sm:text-5xl font-bold">
          구매하기
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-primary max-w-3xl">
          에어포트에서 자란 자작나무는 연중 식재가 가능하며 활착이 매우 빠릅니다. 아래의 식재 방법을 참고하여 건강하게 키워보세요.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-10 pb-20 space-y-20">
        {/* STEPS */}
        <div>
          <div className="flex items-baseline justify-between mb-6">
            <p className="text-xs md:text-sm font-sans font-semibold text-primary uppercase tracking-[0.25em] opacity-70">
              식 재 &nbsp; 가 이 드
            </p>
            <p className="text-xs md:text-sm text-muted-foreground tracking-wider">
              07 단계 + 01 멀칭
            </p>
          </div>
          <div className="border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const num = String(i + 1).padStart(2, "0");
                const row = Math.floor(i / 4); // 0 or 1
                const col = i % 4;
                return (
                  <article
                    key={i}
                    className={`relative p-6 md:p-8 min-h-[220px] flex flex-col border-b border-border ${
                      col < 3 ? "md:border-r" : ""
                    } ${row === 1 ? "md:border-b-0" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-10">
                      <Icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                      <span className="font-display text-sm font-semibold tabular-nums text-muted-foreground tracking-wider">
                        {num}
                      </span>
                    </div>
                    <div className="mt-auto">
                      <h3 className="font-display text-lg md:text-xl font-bold font-sans mb-2 text-primary">
                        {s.title}
                      </h3>
                      <p className="leading-relaxed text-muted-foreground text-sm">
                        {s.body}
                      </p>
                    </div>
                  </article>
                );
              })}
              {/* 멀칭 — highlighted */}
              <article className="relative p-6 md:p-8 min-h-[220px] flex flex-col border-b border-border md:border-b-0 bg-accent/10">
                <div className="flex items-start justify-between mb-10">
                  <Leaf className="h-6 w-6 text-accent" strokeWidth={1.5} />
                  <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                    멀 칭
                  </span>
                </div>
                <div className="mt-auto">
                  <h3 className="font-display text-lg md:text-xl font-bold font-sans mb-2 text-primary">
                    멀칭 마감
                  </h3>
                  <p className="leading-relaxed text-muted-foreground text-sm">
                    잡초 방지와 수분 증발을 막기 위해 제초매트, 부직포, 낙엽 또는 짚으로 잘 덮어줍니다.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>


        {/* 묘목 식재 전 상식 */}
        <div>
          <p className="text-xs md:text-sm font-sans font-semibold text-primary uppercase tracking-[0.25em] mb-3 opacity-70">
            BEFORE PLANTING
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold font-sans mb-8">묘목 식재 전 상식</h2>

          <div className="grid md:grid-cols-[320px_1fr] gap-8 md:gap-12 items-start">
            <img
              src={treeMeasurements}
              alt="수목 측정 기준 (H, W, R, B) 도식"
              className="w-56 md:w-full h-auto"
            />
            <dl className="divide-y divide-border border-t border-b border-border">
              {measurements.map((m) => (
                <div key={m.code} className="grid grid-cols-[60px_1fr] md:grid-cols-[80px_140px_1fr] gap-4 py-4 items-baseline">
                  <dt className="font-display text-3xl md:text-4xl font-bold text-accent tabular-nums">{m.code}</dt>
                  <dd className="text-primary font-semibold hidden md:block">{m.name}</dd>
                  <dd className="text-primary text-sm md:text-base leading-relaxed">
                    <span className="md:hidden font-semibold block mb-1">{m.name}</span>
                    {m.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 비교 이미지 */}
          <div className="mt-12 grid md:grid-cols-2 gap-6 md:gap-10 items-end">
            <figure>
              <img src={plantingMistakes} alt="잘못된 식재 예시" className="w-full h-auto" />
              <figcaption className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                잘못된 식재 예시
              </figcaption>
            </figure>
            <figure>
              <img src={plantingCorrectVsWrong} alt="올바른 식재와 잘못된 식재 비교" className="w-full h-auto" />
              <figcaption className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                올바른 식재 vs 잘못된 식재
              </figcaption>
            </figure>
          </div>

          {/* 주의사항 */}
          <div className="relative mt-10 border border-border bg-secondary/40 p-8 md:p-10 pl-10 md:pl-12">
            <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground">
                주의사항 / CAUTIONS
              </p>
            </div>
            <ul className="space-y-3">
              {cautions.map((c, i) => (
                <li key={i} className="flex gap-3 text-primary leading-relaxed">
                  <span className="shrink-0">{c.icon}</span>
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <BackButton />
          <Button asChild size="lg" className="rounded-none">
            <Link to="/shop">
              구매하기
            </Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Planting;
