import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { model_utils, validator } from "@kidztime/utilities";
import { SvOrder } from "@kidztime/services";

export default controller([
  validator.id_array("orders"),
], async (req: Request, res: Response) => {

  const { orders: ids } = req.body;
  const { self } = req.extras!;
  const orders = await model_utils.scope(Order, "admin").findAll({
    where: {
      id: ids,
      status: Order.STATUS.unprocessed
    }
  });

  const wbout = await SvOrder.order_process({ orders, actor_id: self.id }, { ip_address: req.attr?.ip });
  res.file = wbout;
});
