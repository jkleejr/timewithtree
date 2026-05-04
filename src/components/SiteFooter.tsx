import { Link } from "react-router-dom";
import { FarmContact } from "./FarmContact";
import logo from "@/assets/logo.png";

export const SiteFooter = () => (
  <footer className="border-t border-border mt-24">
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-10 grid gap-10 md:grid-cols-12 text-sm">
      <div className="md:col-span-4">
        <img src={logo} alt="나무와 걷는 시간 로고" className="h-16 md:h-20 w-auto mb-4 -ml-2" />
        <p className="text-muted-foreground max-w-xs">
          ​
        </p>
        <div className="flex flex-col gap-2 mt-6">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1">목차</span>
          <Link to="/shop" className="hover:text-accent transition-colors">쇼핑</Link>
          <Link to="/about" className="hover:text-accent transition-colors">잭큐몬티 도랜보스</Link>
          <Link to="/aeroponics" className="hover:text-accent transition-colors">에어포트</Link>
          <Link to="/cart" className="hover:text-accent transition-colors">장바구니</Link>
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
