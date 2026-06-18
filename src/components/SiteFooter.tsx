import { Link } from "react-router-dom";
import { FarmContact } from "./FarmContact";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/#about", label: "자작나무 소개" },
  { to: "/#airpot", label: "에어포트 재배" },
  { to: "/#shop", label: "구매하기" },
  { to: "/#info", label: "나무 관련 정보" },
  { to: "/auth", label: "로그인" },
  { to: "/cart", label: "장바구니" },
  { to: "/returns", label: "교환 / 환불 규정" },
  { to: "/pickup-guide", label: "방문 수령시 안내" },
  { to: "/privacy", label: "개인정보처리방침" },
];

export const SiteFooter = () => (
  <footer className="border-t border-border mt-12">
    <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-12 grid gap-12 md:gap-16 md:grid-cols-12 text-sm">
      <div className="md:col-span-7 flex flex-col">
        <Link to="/" className="inline-flex items-center mb-8 -ml-1">
          <img src={logo} alt="나무와 걷는 시간 로고" className="h-20 w-auto object-contain" />
        </Link>
        <FarmContact variant="footer" />
      </div>
      <div className="md:col-span-5 md:pt-6">
        <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">목차</span>
        <nav className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative inline-block w-fit transition-colors hover:text-accent after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-0.5 after:w-full after:bg-accent after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:justify-between">
        <span>© {new Date().getFullYear()} 나무와 걷는 시간. All rights reserved.</span>
        <span>주문 문의: <a href="mailto:timewithtree@gmail.com" className="hover:text-accent transition-colors">timewithtree@gmail.com</a></span>
      </div>
    </div>
  </footer>
);
