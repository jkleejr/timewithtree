import { Link } from "react-router-dom";
import { FarmContact } from "./FarmContact";
import logo from "@/assets/logo.png";

export const SiteFooter = () => (
  <footer className="border-t border-border mt-24">
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-10 grid gap-10 md:grid-cols-12 text-sm">
      <div className="md:col-span-4">
        <img src={logo} alt="나무와 걷는 시간 로고" className="h-20 md:h-24 w-auto mb-4 -ml-2" />
        <p className="text-muted-foreground max-w-xs">
          ​
        </p>
        <div className="flex flex-col items-start gap-2 mt-6">
          <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1">목차</span>
          {[
            { to: "/shop", label: "​구매하기" },
            { to: "/about", label: "잭큐몬티 도랜보스" },
            { to: "/planting", label: "식재방법" },
            { to: "/aeroponics", label: "에어포트" },
            { to: "/cart", label: "장바구니" },
            { to: "/returns", label: "교환 / 환불 규정" },
            { to: "/pickup-guide", label: "방문 수령시 안내" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative inline-block transition-colors hover:text-accent after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-0.5 after:w-full after:bg-accent after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {label}
            </Link>
          ))}
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
