import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { SvOrder } from "@kidztime/services";
import { model_utils } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { cart, product, crudscope } = req.extras!;
  const { quantity, accessory_id, gift_id } = req.body!;

  const order = await SvOrder.update_order_item({ order: cart, product, quantity, accessory_id, gift_id, crudscope }, { ip_address: req.attr?.ip });

  res.result = await model_utils.scope(Order, crudscope).findByPk(order.id);
});
