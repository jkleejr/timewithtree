import { SiteLayout } from "@/components/SiteLayout";
import aboutBark from "@/assets/about-bark.jpg";

const About = () => (
  <SiteLayout>
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">잭큐몬티 자작나무</p>
      <h1 className="font-display text-4xl md:text-6xl max-w-3xl leading-[1.05]">
        Three generations of birch, raised in the Korean highlands.
      </h1>
    </section>

    <section className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 pb-20">
      <div className="md:col-span-5">
        <img
          src={aboutBark}
          alt="Detail of Korean white birch bark"
          loading="lazy"
          width={1280}
          height={1280}
          className="w-full aspect-square object-cover"
        />
      </div>
      <div className="md:col-span-6 md:col-start-7 flex flex-col gap-6 text-base leading-relaxed text-muted-foreground">
        <p>
          잭큐몬티 도랜보스(Jacquemontii Doorenbos)는 히말라야 자작나무의 변이종을 네덜란드에서 개량한, 자작나무 중 수피가 가장 하얗고 깨끗한 명품 조경수입니다. 성장 속도가 빠르고 9~15m까지 자라며, 줄기뿐만 아니라 가지까지 형광 백색을 띠는 것이 특징입니다. 전국 노지 월동이 가능하며, 3~4년생부터 뱀 껍질처럼 허물을 벗으며 백색 수피를 드러냅니다.
        </p>
        <p className="font-bold text-foreground mt-4">핵심 특징 및 관리</p>
        <p>
          특이 수피: 일반 자작나무보다 수피가 훨씬 더 하얗고 깔끔하며, 가을 단풍과 겨울 나목의 몽환적인 느낌이 강합니다.
        </p>
        <p>
          성장 및 형태: 도심지 내한성이 강하고 성장 속도가 빠르며, 수피가 형광에 가까운 하얀색을 띱니다.
        </p>
        <p>
          식재: 배수가 잘되는 곳을 선호하며, 독립수나 군식 재배로 인기입니다.
        </p>
        <p>
          주의사항: 조직배양이나 삽목으로 생산되어 가격이 비싼 편이며, 일반 잭큐몬티 실생 묘목과 구분하는 것이 중요합니다.
        </p>
        <p className="font-bold text-foreground mt-4">활용</p>
        <p>
          가을에는 노란 단풍이 들고, 겨울에는 하얀 껍질이 두드러져 조경 효과가 탁월합니다.
        </p>
        <p>
          수액은 웰빙 음료로 활용되기도 합니다.
        </p>
      </div>
    </section>
  </SiteLayout>
);

export default About;
