import { Link } from "react-router-dom";
import { FarmContact } from "./FarmContact";

export const SiteFooter = () => (
  <footer className="border-t border-border mt-24">
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid gap-10 md:grid-cols-12 text-sm">
      <div className="md:col-span-4">
        <div className="font-display text-lg mb-2">나무와 걷는 시간</div>
        <p className="text-muted-foreground max-w-xs">
          저희 묘목장에서 정성껏 키운 한국산 자작나무입니다.
        </p>
        <div className="flex flex-col gap-2 mt-6">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Explore</span>
          <Link to="/shop" className="hover:text-accent transition-colors">쇼핑</Link>
          <Link to="/about" className="hover:text-accent transition-colors">잭큐몬티 도랜보스</Link>
          <Link to="/cart" className="hover:text-accent transition-colors">Cart</Link>
        </div>
      </div>
      <div className="md:col-span-8">
        <FarmContact variant="footer" />
      </div>
    </div>
    <div className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-xs text-muted-foreground flex justify-between">
        <span>© {new Date().getFullYear()} 나무와 걷는 시간</span>
        <span>Secure checkout by Shopify</span>
      </div>
    </div>
  </footer>
);
