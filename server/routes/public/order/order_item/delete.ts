import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { cart, order_item } = req.extras!;

  await SvOrder.delete_orderitem({ order: cart, orderItem: order_item }, { ip_address: req.attr?.ip });

  const updated_order = await Order.findByPk(cart.id);

  res.result = updated_order;
});