export function calSubtotal(cart_items) {
  let total = 0;
  total = cart_items?.reduce((acc, item) => {
    acc = acc + (item?.product?.promo_price || item?.product?.price);
    return acc;
  }, 0);
  return total;
}
