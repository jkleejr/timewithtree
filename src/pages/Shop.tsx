import { SiteLayout } from "@/components/SiteLayout";
import { ShopBrowser } from "@/components/ShopBrowser";
import { Seo } from "@/components/Seo";

const Shop = () => {
  return (
    <SiteLayout>
      <Seo
        title="잭큐몬티 자작나무 구매 — 나무와 걷는 시간"
        description="세종·공주 농장에서 에어포트로 재배한 잭큐몬티 자작나무 묘목을 사이즈별로 구매하실 수 있습니다. 연중 식재 가능, 활착률 우수."
        path="/shop"
      />
      <div className="pb-16">
        <ShopBrowser showBackButton={false} title="잭큐몬티 자작나무 구매" />
      </div>
    </SiteLayout>
  );
};

export default Shop;

