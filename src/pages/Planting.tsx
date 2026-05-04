import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";

const Planting = () => {
  return (
    <SiteLayout>
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <h1 className="font-display leading-tight mb-6 font-sans text-5xl">
          🌱 식재방법
        </h1>
        <p className="text-lg md:text-xl leading-relaxed text-primary">
          아래의 식재 방법을 참고하여 건강하게 키워보세요.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 pb-20">
        <div className="border-t border-border pt-12 grid gap-12 font-sans">
          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">🌱식재방법</h2>
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
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">구덩이 준비</h2>
            <p className="leading-relaxed text-primary text-base">
              뿌리 분의 1.5~2배 크기의 구덩이를 파고, 배수가 잘되도록 바닥을 충분히 정리합니다. 점토질 토양이라면 마사토나 퇴비를 섞어 배수성을 개선합니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">식재</h2>
            <p className="leading-relaxed text-primary text-base">
              에어포트를 조심스럽게 제거한 뒤 뿌리 분을 그대로 구덩이 중앙에 안착시킵니다. 뿌리 분 윗면이 지면과 같거나 살짝 위로 오도록 깊이를 맞춥니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">흙 채우기 & 물 주기</h2>
            <p className="leading-relaxed text-primary text-base">
              파낸 흙으로 빈 공간을 채우며 가볍게 눌러줍니다. 식재 직후 충분한 양의 물을 주어 뿌리와 흙이 밀착되도록 합니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">지주대 설치</h2>
            <p className="leading-relaxed text-primary text-base">
              바람에 흔들리지 않도록 지주대를 세워 고정합니다. 활착이 안정되는 1~2년 후 제거합니다.
            </p>
          </article>

          <article>
            <h2 className="font-display text-2xl md:text-3xl mb-3 font-sans font-semibold">사후 관리</h2>
            <p className="leading-relaxed text-primary text-base">
              식재 후 첫 해는 토양이 마르지 않도록 정기적으로 관수해 주세요. 멀칭재(왕겨, 우드칩 등)를 덮어주면 수분 보존과 잡초 억제에 효과적입니다.
            </p>
          </article>

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
