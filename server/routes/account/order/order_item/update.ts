import { controller, Request, Response } from "@kidztime/middlewares";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { self, order_item } = req.extras!;
  const { quantity } = req.body;

  // const updated_order = await SvOrder.update_order_item({ order: self!.order, orderItem: order_item, quantity }, { ip_address: req.attr?.ip });

  // res.result = updated_order;
});
