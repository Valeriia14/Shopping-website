import { Paths } from "@kidztime/constants";
import { PageRequest, PageResponse, render_page } from "@kidztime/middlewares";

export default render_page(Paths.Views.Cart,
  async (req: PageRequest, res: PageResponse) => {
    const cart = req.extras!.cart;

    return {
      cart,
    };
  },
);
