export const SET_ORDER_SUMMARY = "SET_ORDER_SUMMARY";

export enum orderSummaryKeys {
  subtotal = "subtotal",
  promoCodeDiscount = "promoCodeDiscount",
  pointsDiscount = "pointsDiscount",
  shippingFee = "shippingFee",
  total = 'total'
}

export type orderSummaryProps = {
  key: orderSummaryKeys,
  value: any;
}

export function setOrderSummary(props: orderSummaryProps) {
  return {
    type: SET_ORDER_SUMMARY,
    props,
  }
}