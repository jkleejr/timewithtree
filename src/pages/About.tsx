import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/BackButton";
import aboutBark from "@/assets/about-doorenbos.jpg";
import aboutBark2 from "@/assets/about-doorenbos-2.jpg";
import aboutBark3 from "@/assets/about-doorenbos-3.jpg";

const aboutImages = [
  { src: aboutBark, alt: "에어포트에서 자라는 잭큐몬티 도랜보스 자작나무" },
  { src: aboutBark2, alt: "잭큐몬티 도랜보스 자작나무의 하얀 수피 클로즈업" },
  { src: aboutBark3, alt: "에어포트에서 줄지어 자라는 잭큐몬티 도랜보스 자작나무" },
];

const About = () => {
  const [index, setIndex] = useState(0);
  const len = aboutImages.length;

  useEffect(() => {
    if (len <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % len);
    }, 10000);
    return () => clearInterval(id);
  }, [len]);

  return (
    <SiteLayout>
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4"></p>
        <h1 className="font-display md:text-6xl max-w-3xl leading-[1.05] font-bold font-sans text-5xl">
          잭큐몬티 도랜보스 자작나무
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 pb-20">
        <div className="md:col-span-6">
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-secondary">
            {aboutImages.map((img, i) => (
              <img
                key={i}
                src={img.src}
                alt={img.alt}
                loading={i === 0 ? "eager" : "lazy"}
                width={1280}
                height={1280}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {len > 1 && (
              <>
                <button
                  onClick={() => setIndex((i) => (i - 1 + len) % len)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background p-1.5 rounded-full shadow z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIndex((i) => (i + 1) % len)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background p-1.5 rounded-full shadow z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {aboutImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition-all ${
                        i === index ? "bg-white w-6" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8 flex-col gap-6 text-base leading-relaxed text-muted-foreground flex items-start justify-start">
          <p className="text-primary text-base">
            잭큐몬티 도랜보스(Jacquemontii Doorenbos)는 히말라야 자작나무의 변이종을 네덜란드에서 개량한, 자작나무 중 수피가 가장 하얗고 깨끗한 명품 조경수입니다. 성장 속도가 빠르고 9~15m까지 자라며, 줄기뿐만 아니라 가지까지 형광 백색을 띠는 것이 특징입니다. 전국 노지 월동이 가능하며, 3~4년생부터 뱀 껍질처럼 허물을 벗으며 백색 수피를 드러냅니다.
          </p>
          <p className="font-bold text-foreground mt-4 text-3xl">핵심 특징 및 관리</p>
          <p className="text-primary text-base">
            특이 수피: 일반 자작나무보다 수피가 훨씬 더 하얗고 깔끔하며, 가을 단풍과 겨울 나목의 몽환적인 느낌이 강합니다.
          </p>
          <p className="text-primary text-base">
            성장 및 형태: 도심지 내한성이 강하고 성장 속도가 빠르며, 수피가 형광에 가까운 하얀색을 띱니다.
          </p>
          <p className="text-primary text-base">
            식재: 배수가 잘되는 곳을 선호하며, 독립수나 군식 재배로 인기입니다.
          </p>
          <p className="text-primary text-base">
            주의사항: 조직배양이나 삽목으로 생산되어 가격이 비싼 편이며, 일반 잭큐몬티 실생 묘목과 구분하는 것이 중요합니다.
          </p>
          <p className="font-bold text-foreground mt-4 text-3xl">활용</p>
          <p className="text-primary text-base">
            가을에는 노란 단풍이 들고, 겨울에는 하얀 껍질이 두드러져 조경 효과가 탁월합니다.
          </p>
          <p className="text-primary">
            ​
          </p>
        </div>
        <div className="md:col-span-12 mt-10 flex justify-between items-center w-full">
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

export default About;
