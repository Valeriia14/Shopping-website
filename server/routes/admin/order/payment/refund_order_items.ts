import { controller, Request, Response } from "@kidztime/middlewares";
import { SvPayment } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";
import { OrderItem, Payment } from "@kidztime/models";

export default controller([
  validator.id_array("order_items"),
],async (req: Request, res: Response) => {
  const { order } = req.extras!;
  const payment = order.payments.find((item: Payment) => item.type === Payment.TYPES.main);
  const account = order.account;
  const { order_items: ids } = req.body;
  const order_items = await model_utils.scope(OrderItem, "admin").findAll({
    where: {
      id: ids,
    }
  });

  const refunded_order = await SvPayment.approve_refund_order_items({
    order,
    order_items,
    payment,
    account,
  }, { ip_address: req.attr?.ip });

  res.result = refunded_order;
});
