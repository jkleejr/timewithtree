## Korean Birch Tree Storefront

A minimal, modern e-commerce site for selling Korean birch trees, powered by a new Shopify store for products, cart, and checkout.

### Visual style
- Black/white base with one accent color (soft moss green) for buttons and highlights
- Large, gallery-style product photography with generous whitespace
- Clean sans-serif typography, light hairline dividers
- Subtle hover states and smooth page transitions

### Pages

**Home (`/`)**
- Sticky top nav: logo, links (Shop, About, Cart with item count)
- Hero: full-width image of a birch grove, brand tagline, "Shop trees" CTA
- Featured trees: 3-up grid pulled from Shopify
- Brand story snippet with link to About
- Footer: contact, social, legal

**Shop (`/shop`)**
- Product grid of all birch trees from Shopify
- Filters: size (sapling / mid / mature), price range
- Sort: newest, price low→high, price high→low

**Product detail (`/products/:handle`)**
- Large image gallery (thumbnails + main)
- Title, price, description, care notes
- Size / variant selector, quantity stepper
- "Add to cart" button → confirmation toast
- Shipping & care info accordion

**About (`/about`)**
- Story of the Korean nursery, sourcing, and the birch species
- Imagery of the trees and origin

**Cart (`/cart`)**
- Dedicated page listing line items (image, name, variant, qty, price, remove)
- Quantity adjust + line subtotal
- Order summary (subtotal, shipping note, total)
- "Checkout" button → secure Shopify-hosted checkout

### Cart & ordering
- Cart state persists in localStorage so items survive refresh
- Cart icon in nav shows live item count
- Checkout hands off to Shopify (handles payment, shipping, taxes, order management)
- Orders, inventory, and fulfillment are managed from the Shopify admin

### Setup steps
1. Enable Shopify and create a new development store (free while you build; 30-day trial starts only when you "Claim Store" to go live)
2. Seed the catalog with your birch tree products (you'll provide names, photos, prices, sizes)
3. Build the pages above wired to your Shopify catalog
4. Connect cart → Shopify checkout

### Technical notes
- React + Vite + Tailwind, design tokens in `index.css`
- Shopify Storefront API for product data and checkout creation
- Cart state via React context + localStorage
- Routes added to `App.tsx`: `/`, `/shop`, `/products/:handle`, `/about`, `/cart`

### Not included (can add later)
- Customer accounts / order history
- Reviews, wishlists, blog
- Multi-currency or multi-language
