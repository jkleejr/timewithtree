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
  { src: aboutBark, alt: "에어포트에서 자라는 구매하기" },
  { src: aboutBark2, alt: "구매하기의 하얀 수피 클로즈업" },
  { src: aboutBark3, alt: "에어포트에서 줄지어 자라는 구매하기" },
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
        <h1 className="font-display max-w-3xl leading-[1.1] font-bold font-sans text-5xl sm:text-5xl md:text-5xl">
          구매하기
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-12 gap-10 pb-12 md:pb-16">
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
        <div className="md:col-span-6 md:col-start-7 flex-col gap-6 text-base leading-relaxed text-muted-foreground flex items-start justify-start">
          <div className="text-primary text-base font-bold font-sans">
            <p className="font-sans">학명 : Betula Jacquemontii</p>
            <p className="font-sans">월동 : 내한성 높음</p>
            <p className="font-sans">햇빛 : 양지</p>
            <p className="font-sans">물 : 겉흙이 마르면(과습주의)</p>
          </div>
          <p className="font-bold text-foreground mt-4 text-3xl">핵심 특징 및 관리</p>
          <p className="text-primary text-base">
            히말라야 서부지역에 자생하는 자작나무 중에서 발견된, 수피가 유난히 밝고 흰색인 변종을 유럽에서 원예용으로 개량하여 탄생시킨 품종으로 프랑스 자연주의자의 이름을 따서 '잭큐몬티'라는 이름이 붙여졌다.
          </p>
          <p className="text-primary text-base">
            일반 자작나무 품종은 추운지역에서만 자작나무 고유의 아름다운 수피 색상을 발현시키고 생육이 양호한 특성이 있어서 국내에서는 일부지역에서만 자작나무 고유의 수피감상이 가능한 반면, 이품종의 경우엔 유럽의 기후에 맞게 개량되어 국내 모든 지역에서 품종 고유의 수피 매력을 발현시키는 장점을 가지고 있다.
          </p>
          <p className="text-primary text-base">
            자작나무 중 가장 밝은 백색을 띠며 성장속도가 빠르다. 수피는 줄기뿐만 아니라 가지까지도 형광성을 지닌 특이한 흰색이라서 여러그루를 식재시 가을 단풍과 겨울나목이 다른 품종과 달리 매우 몽환적인 느낌을 주는 매력이 있어 1993년 영국 왕립현회로부터 최고의 권위있는 훈장을 수상하였다고 한다.
          </p>
          <p className="text-primary text-base whitespace-pre-line">
            전국 노지월동이 가능하고, 성장속도가 빠른 속성수이다.
            나무높이는 9~15m까지 성장하며, 뿌리는 땅속깊이 직근으로 파고들지 않고, 사방으로 퍼지는 특성이 있다.
            유럽과 미국뿐만 아니라 호주, 일본 등에서 인기조경수로 자리매김되고 있으며, 그 수액은 자일리톨 성분 등 이로운 성분이 많이 함유되어 있어서 국내의 고로쇠 수액처럼 웰빙음료 등에 활용이 가는 추세이다.
          </p>
        </div>
        <div className="md:col-span-12 flex justify-between items-center w-full">
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
