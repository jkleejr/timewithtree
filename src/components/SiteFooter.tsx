import { Link } from "react-router-dom";

export const SiteFooter = () => (
  <footer className="border-t border-border mt-24">
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid gap-8 md:grid-cols-3 text-sm">
      <div>
        <div className="font-display text-lg mb-2">Seoul Birch</div>
        <p className="text-muted-foreground max-w-xs">
          Korean white birch trees, grown with care and shipped from our nursery.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Explore</span>
        <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
        <Link to="/about" className="hover:text-accent transition-colors">About</Link>
        <Link to="/cart" className="hover:text-accent transition-colors">Cart</Link>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Contact</span>
        <a href="mailto:hello@seoulbirch.co" className="hover:text-accent transition-colors">hello@seoulbirch.co</a>
        <span className="text-muted-foreground">Seoul, South Korea</span>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-xs text-muted-foreground flex justify-between">
        <span>© {new Date().getFullYear()} Seoul Birch</span>
        <span>Secure checkout by Shopify</span>
      </div>
    </div>
  </footer>
);
