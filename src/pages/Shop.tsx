import { SiteLayout } from "@/components/SiteLayout";
import { ShopBrowser } from "@/components/ShopBrowser";

const Shop = () => {
  return (
    <SiteLayout>
      <div className="pb-16">
        <ShopBrowser />
      </div>
    </SiteLayout>
  );
};

export default Shop;
