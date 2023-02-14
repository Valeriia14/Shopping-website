import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { SvOrder } from "@kidztime/services";
import { model_utils } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { cart, product, crudscope } = req.extras!;

  const order = await SvOrder.add_order_item({ order: cart, product, quantity: 1, crudscope }, { ip_address: req.attr?.ip });

  res.result = await model_utils.scope(Order, crudscope).findByPk(order.id);
});
