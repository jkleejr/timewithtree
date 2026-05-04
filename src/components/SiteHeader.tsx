import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

export const SiteHeader = () => {
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const { user } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative inline-block text-sm tracking-wide text-foreground",
      "after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-full after:bg-foreground after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
      isActive ? "after:scale-x-100" : "after:scale-x-0",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 md:h-22 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="나무와 걷는 시간 — 홈">
          <img src={logo} alt="나무와 걷는 시간" className="h-[72px] md:h-[88px] w-auto -my-3" />
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <NavLink to="/about" className={navClass}>잭큐몬티 도랜보스</NavLink>
          <NavLink to="/planting" className={navClass}>식재방법</NavLink>
          <NavLink to="/aeroponics" className={navClass}>에어포트</NavLink>
          <NavLink to="/shop" className={navClass}>구매하기</NavLink>
        </nav>
        <div className="flex items-center gap-5">
          <NavLink
            to={user ? "/account" : "/auth"}
            className={navClass}
            aria-label={user ? "내 계정" : "로그인"}
          >
            <User className="h-5 w-5" />
          </NavLink>
          <NavLink to="/cart" className={navClass} aria-label="장바구니">
            <span className="relative flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">장바구니</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 sm:static sm:ml-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-medium">
                  {totalItems}
                </span>
              )}
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};
