import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, ShoppingCart, Shield, User, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@/assets/logo.png";

type NavLinkItem = { to: string; label: string; hash?: string };

const NAV_LINKS: NavLinkItem[] = [
  { to: "/about", label: "자작나무 소개" },
  { to: "/", hash: "airpot", label: "에어포트 재배" },
  { to: "/", hash: "info", label: "나무 관련 정보" },
  { to: "/", hash: "shop", label: "구매하기" },
];

export const SiteHeader = () => {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleHashNav = (e: React.MouseEvent, hash: string) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      e.preventDefault();
      navigate(`/#${hash}`);
    }
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative inline-block text-sm tracking-wide text-foreground transition-colors hover:text-accent",
      "after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-full after:bg-accent after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
      isActive ? "after:scale-x-100 text-accent" : "after:scale-x-0",
    ].join(" ");

  const baseNavClass = "relative inline-block text-sm tracking-wide text-foreground transition-colors hover:text-accent after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-0.5 after:w-full after:bg-accent after:scale-x-0 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left";

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-16 md:h-22 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center min-w-0" aria-label="나무와 걷는 시간 — 홈">
          <img src={logo} alt="나무와 걷는 시간" className="h-10 md:h-16 w-auto -my-1 md:-my-2" />
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((l) =>
            l.hash ? (
              <a
                key={l.label}
                href={`/#${l.hash}`}
                onClick={(e) => handleHashNav(e, l.hash!)}
                className={baseNavClass}
              >
                {l.label}
              </a>
            ) : (
              <NavLink key={l.to} to={l.to} className={navClass}>
                {l.label}
              </NavLink>
            )
          )}
        </nav>
        <div className="flex items-center gap-3 sm:gap-5">
          {isAdmin && (
            <NavLink to="/admin" className={navClass} aria-label="관리자">
              <Shield className="h-5 w-5" />
            </NavLink>
          )}
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
              <span className="hidden md:inline">장바구니</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 md:static md:ml-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-medium">
                  {totalItems}
                </span>
              )}
            </span>
          </NavLink>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="md:hidden inline-flex items-center justify-center h-10 w-10 -mr-2"
              aria-label="메뉴 열기"
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] max-w-xs p-0">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <img src={logo} alt="" className="h-10 w-auto" />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="메뉴 닫기"
                  className="h-9 w-9 inline-flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex flex-col py-2">
                {NAV_LINKS.map((l) => {
                  const active = !l.hash && location.pathname === l.to;
                  return (
                    <Link
                      key={l.label}
                      to={l.hash ? `/#${l.hash}` : l.to}
                      onClick={(e) => {
                        setOpen(false);
                        if (l.hash) handleHashNav(e, l.hash);
                      }}
                      className={`px-5 py-4 text-base border-b border-border/60 ${
                        active ? "font-semibold bg-secondary/50" : ""
                      }`}
                    >
                      {l.label}
                    </Link>
                  );
                })}
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="px-5 py-4 text-base border-b border-border/60 flex items-center justify-between"
                >
                  <span>장바구니</span>
                  {totalItems > 0 && (
                    <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <Link
                  to={user ? "/account" : "/auth"}
                  onClick={() => setOpen(false)}
                  className="px-5 py-4 text-base border-b border-border/60"
                >
                  {user ? "내 계정" : "로그인"}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="px-5 py-4 text-base"
                  >
                    관리자
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
