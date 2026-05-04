import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Minus, Plus, Trash2, ExternalLink, ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { CheckoutDialog } from "@/components/CheckoutDialog";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/contexts/AuthContext";

const Cart = () => {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl } = useCartStore();
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || 'USD';

  const openCheckout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, '_blank');
  };

  const handleCheckout = () => {
    if (!getCheckoutUrl()) return;
    if (user) {
      openCheckout();
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-24">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">Your cart</p>
        <h1 className="font-display text-4xl md:text-5xl mb-10 font-serif font-bold">
          {totalItems === 0 ? 'Cart is empty' : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        </h1>

        {items.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center">
            <ShoppingBag className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-6">Your cart is currently empty.</p>
            <Button asChild className="rounded-none">
              <Link to="/shop">Browse trees</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 divide-y divide-border border-y border-border">
              {items.map((item) => {
                const img = item.product.node.images?.edges?.[0]?.node;
                return (
                  <div key={item.variantId} className="py-6 flex gap-4 md:gap-6">
                    <div className="w-24 h-32 md:w-28 md:h-36 bg-secondary flex-shrink-0 overflow-hidden">
                      {img && <img src={img.url} alt={img.altText || item.product.node.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between gap-4 mb-1">
                        <Link to={`/product/${item.product.node.handle}`} className="font-display text-lg hover:text-accent">
                          {item.product.node.title}
                        </Link>
                        <span className="text-sm tabular-nums whitespace-nowrap">
                          {item.price.currencyCode} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      {item.selectedOptions.length > 0 && item.selectedOptions[0].value !== 'Default Title' && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {item.selectedOptions.map(o => o.value).join(' · ')}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="inline-flex items-center border border-border">
                          <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="px-2 py-1.5 hover:bg-secondary">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-9 text-center text-sm tabular-nums">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="px-2 py-1.5 hover:bg-secondary">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.variantId)} className="text-sm text-muted-foreground hover:text-destructive inline-flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-secondary p-6 md:p-8 sticky top-24">
                <h2 className="font-display text-xl mb-6">Order summary</h2>
                <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">{currency} {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-base">Total</span>
                  <span className="font-display text-2xl tabular-nums">{currency} {subtotal.toFixed(2)}</span>
                </div>
                <Button
                  size="lg"
                  className="w-full rounded-none"
                  onClick={handleCheckout}
                  disabled={isLoading || isSyncing || !getCheckoutUrl()}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Checkout <ExternalLink className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure checkout powered by Shopify
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

export default Cart;
