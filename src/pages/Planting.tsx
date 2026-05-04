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
            <p className="leading-relaxed text-primary text-base"></p>
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
