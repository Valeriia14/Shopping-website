import { usePageContext } from "./usePageContext";
interface CartState {
  cart?: any,
};

const state: CartState = {};

export const useCart = () => {
  const context = usePageContext();
  const preloadedCart = context.data.cart;

  const setter = (cart: any) => {
    context.updater({
      ...context,
      data: {
        ...context.data,
        cart,
      }
    });
  };

  return [state.cart ?? preloadedCart, setter];
};
