import { orderSummaryProps, SET_ORDER_SUMMARY } from "./actions";
import { PropAction } from "../props";

const initialOrderState = {
  subtotal: 0,
  promoCodeDiscount: 0,
  pointsDiscount: 0,
  shippingFee: 0,
}

export type orderSummaryState = {
  subtotal: number,
  promoCodeDiscount?: number,
  pointsDiscount?: number,
  shippingFee: number,
};

export default (state: orderSummaryState = initialOrderState, actions: PropAction) => {
  switch (actions.type) {
    case SET_ORDER_SUMMARY:
      const updateProps: orderSummaryProps = actions.props;
      return {
        ...state,
        [updateProps.key]: updateProps.value
      };
    default:
      return state;
  }
}