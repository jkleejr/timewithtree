import { Link, NavLink } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import logo from "@/assets/logo.png";

export const SiteHeader = () => {
  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`;

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="나무와 걷는 시간 — 홈">
          <img src={logo} alt="나무와 걷는 시간" className="h-20 md:h-24 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <NavLink to="/shop" className={navClass}>Shop</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
        </nav>
        <Link to="/cart" className="relative flex items-center gap-2 text-sm">
          <ShoppingBag className="h-5 w-5" />
          <span className="hidden sm:inline">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 sm:static sm:ml-1 inline-flex items-center justify-center h-5 min-w-[20px] px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-medium">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
