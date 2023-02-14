import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { model_utils, validator } from "@kidztime/utilities";
import { SvOrder } from "@kidztime/services";

export default controller([
  validator.id_array("orders"),
], async (req: Request, res: Response) => {

  const { orders: ids } = req.body;
  const orders = await model_utils.scope(Order, "admin").findAll({
    where: {
      id: ids,
      status: Order.STATUS.shipped
    }
  });
  const valid_ids = orders.map(item => item.id);
  const invalid_ids = ids.filter((order_id: number) => !valid_ids.includes(order_id));

  for (let order of orders) {
    await SvOrder.update_order_status({ status: Order.STATUS.completed, order }, {});
  }

  res.result.completed_orders = valid_ids;
  res.result.invalid_orders = invalid_ids;
});
