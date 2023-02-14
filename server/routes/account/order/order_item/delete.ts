import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { self, order_item } = req.extras!;

  await SvOrder.delete_orderitem({ order: self!.order, orderItem: order_item }, { ip_address: req.attr?.ip });

  const updated_order = await Order.findByPk(self!.order.id);

  res.result = updated_order;
});
