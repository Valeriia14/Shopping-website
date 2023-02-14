import { controller, Request, Response } from "@kidztime/middlewares";
import { SvPayment } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";
import { OrderItem } from "@kidztime/models";

export default controller([
  validator.id_array("order_items")
],async (req: Request, res: Response) => {
  const { order, self } = req.extras!;
  const { reason, order_items: ids } = req.body;
  const order_items = await model_utils.scope(OrderItem, "admin").findAll({
    where: {
      id: ids,
    }
  });
  const refunded_order = await SvPayment.request_refund_order_items({
    order,
    order_items,
    account: self,
    reason
  }, { ip_address: req.attr?.ip });

  res.result = refunded_order;
});
