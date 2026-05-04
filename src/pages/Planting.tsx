import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import treeMeasurements from "@/assets/tree-measurements.png";
import plantingMistakes from "@/assets/planting-mistakes.png";

const Planting = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <h1 className="font-display leading-tight mb-6 font-sans text-5xl">
          🌱 식재방법
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-primary">
          아래의 식재 방법을 참고하여 건강하게 키워보세요.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 pb-20">
        <div className="border-t border-border pt-12 grid gap-12 font-sans">
          <article>
            <h2 className="font-display md:text-3xl mb-3 font-sans font-semibold text-4xl">식재방법</h2>
            <p className="font-claude-response-body break-words whitespace-pre-wrap leading-[1.7] font-sans text-primary text-base">
              {`1️⃣ 식재할 장소를 정리를 해줍니다.

2️⃣ 필요이상으로 긴 가지나 뿌리는 정리해줍니다.

3️⃣ 뿌리분 뿌리보다 1.5배 크기로 구덩이를 팝니다.

4️⃣ 뿌리가 휘거나 구부러지지 않게 곧게 펴서 구덩이에 넣어주고 흙을 2/3 정도 채워줍니다.

5️⃣ 뿌리 사이에 흙이 잘 채워지도록 묘목을 흔들어 준 후 곧게 세워줍니다.

6️⃣ 나머지 흙으로 지면보다 약간 높게 흙을 덮어줍니다.

7️⃣ 식재후 물을 충분히 주고 뿌리가 활착될 때까지 지속적으로 물 관리를 해줍니다.

🌿 멀칭: 잡초방지, 수분 증발을 막기 위해 제초매트, 부직포 낙엽 또는 짚으로 잘 덮어줍니다.`}
            </p>
          </article>

          <article>
            <h2 className="font-display md:text-3xl mb-3 font-sans font-semibold text-4xl">묘목 식재전 상식</h2>
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
              <div className="grid gap-2 text-primary text-base leading-relaxed">
                <p>(H) - 수고 지면으로 부터 수목의 맨 윗부분 (상순의 끝) 까지의 길이, 수목의 키. (단위 m)</p>
                <p>(W) - 수관폭 가지의 끝과 반대쪽 가지의 끝까지의 너비. (단위 m)</p>
                <p>(R) - 근원직경 줄기의 지면에 닿는 부분의 지름, 둘레를 π (3.14)로 나눈 값. (단위 cm)</p>
                <p>(B) - 흉고직경 지면으로부터 1m20cm 높이의 줄기 지름, 둘레를 π (3.14)로 나눈 값, 보통 가슴높이를 잰 값. (단위 cm)</p>
              </div>
              <img
                src={treeMeasurements}
                alt="수목 측정 기준 (H, W, R, B) 도식"
                className="w-40 md:w-48 h-auto justify-self-end"
              />
            </div>
            <div className="mt-8 grid gap-3">
              <img src={plantingMistakes} alt="잘못된 식재 예시" className="w-48 md:w-64 h-auto" />
              <p className="text-primary text-base leading-relaxed">❌ 묘목이 기울어져 있거나 뿌리가 뭉쳐있다</p>
              <p className="text-primary text-base leading-relaxed">❌ 구덩이가 얕아서 뿌리가 밖으로 나온다</p>
            </div>
          </article>

          {/* Content removed per user request */}

          <div className="flex justify-between items-center">
            <BackButton />
            <Button asChild size="lg" className="rounded-none">
              <Link to="/shop">
                구매하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Planting;
