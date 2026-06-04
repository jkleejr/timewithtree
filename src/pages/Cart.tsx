import { Link, useNavigate } from "react-router-dom";
import { Loader2, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { OrderPolicyNotice } from "@/components/OrderPolicyNotice";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

const Cart = () => {
  const { items, isLoading, isSyncing, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || 'KRW';

  const handleCheckout = () => {
    if (items.length === 0) return;
    navigate('/checkout');
  };

  return (
    <SiteLayout>
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 pb-24">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">장바구니</p>
        <h1 className="font-display text-4xl md:text-5xl mb-10 font-bold font-sans">
          {totalItems === 0 ? '장바구니가 비어 있습니다' : `${totalItems}개 상품`}
        </h1>

        {items.length === 0 ? (
          <div className="border border-dashed border-border py-20 text-center">
            <ShoppingCart className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-6">현재 장바구니에 담긴 상품이 없습니다.</p>
            <Button asChild className="rounded-none">
              <Link to="/shop">나무 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <>
          <OrderPolicyNotice className="mb-8" />
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
                        <Link to={`/product/${item.product.node.handle}`} className="font-display text-lg hover:text-accent font-sans">
                          {item.product.node.title}
                        </Link>
                        <span className="text-sm tabular-nums whitespace-nowrap font-sans">
                          {formatPrice(parseFloat(item.price.amount) * item.quantity, item.price.currencyCode)}
                        </span>
                      </div>
                      {item.selectedOptions.length > 0 && item.selectedOptions[0].value !== 'Default Title' && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.selectedOptions.map(o => o.value).join(' · ')}
                        </p>
                      )}
                      {item.product.node.descriptionHtml ? (
                        <div
                          className="text-sm text-muted-foreground prose prose-sm max-w-none mb-3 [&_p]:my-1 line-clamp-6"
                          dangerouslySetInnerHTML={{ __html: item.product.node.descriptionHtml }}
                        />
                      ) : item.product.node.description ? (
                        <p className="text-sm text-muted-foreground whitespace-pre-line mb-3 line-clamp-6">
                          {item.product.node.description}
                        </p>
                      ) : null}
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
                          <Trash2 className="h-3.5 w-3.5" /> 삭제
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="lg:col-span-1">
              <div className="bg-secondary p-6 md:p-8 sticky top-24">
                <h2 className="font-display text-xl mb-6 font-sans">주문 요약</h2>
                <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                  <div className="flex justify-between font-sans">
                    <span className="text-muted-foreground font-sans">소계</span>
                    <span className="tabular-nums font-sans">{formatPrice(subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="text-muted-foreground font-sans">배송비</span>
                    <span className="text-muted-foreground font-sans">결제 시 계산</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-base font-sans">합계</span>
                  <span className="font-display text-2xl tabular-nums font-sans">{formatPrice(subtotal, currency)}</span>
                </div>
                <Button
                  size="lg"
                  className="w-full rounded-none"
                  onClick={handleCheckout}
                  disabled={isLoading || isSyncing || items.length === 0}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>주문하기</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  계좌이체로 결제됩니다
                </p>
              </div>
            </aside>
          </div>
          </>
        )}
        <div className="mt-12">
          <BackButton />
        </div>
      </section>
    </SiteLayout>
  );
};

export default Cart;
