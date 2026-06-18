# Plan to Change the "주문접수" Box Background to Light Green

We will style the "주문접수" (Order Received) status badge to have a light green background and border, making it stand out as a fresh, active order status.

## Steps

1. **Update `src/pages/Account.tsx`**
   - Modify the order status badge styling in the order list.
   - For `order.status === "pending"` ("주문접수"), change the Tailwind classes from standard secondary styles (`border-border bg-secondary`) to soft green classes (such as `border-emerald-200 bg-emerald-50 text-emerald-800`).
   - Leave other statuses (paid, shipped, cancelled) with their existing styling, or style them consistently if appropriate.

## Technical Details

- **Target File**: `src/pages/Account.tsx`
- **Proposed Tailwind Classes for Light Green**: `border-emerald-200 bg-emerald-50 text-emerald-800 font-medium`
