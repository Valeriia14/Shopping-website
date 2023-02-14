import { controller, Request, Response } from "@kidztime/middlewares";
import { SvPayment } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";
import { OrderItem, Payment } from "@kidztime/models";
import { NewOrderItemRequest } from "@kidztime/services/payment/payment";
import { Op } from "sequelize";

export default controller([
  validator.id_array("order_items_old"),
],async (req: Request, res: Response) => {
  const { order } = req.extras!;
  const payment = order.payments.find((item: Payment) => item.type === Payment.TYPES.main);
  const account = order.account;
  const { order_items_old: ids_old, order_items_new : ids_new, additional_shipping } = req.body;
  const order_items_old = await model_utils.scope(OrderItem, "admin").findAll({
    where: {
      id: ids_old,
      quantity:{
        [Op.gte]: 1
      }
    }
  });
  const exchanged_order = await SvPayment.exchange_order_items({
    order,  
    order_items_old,
    order_items_new: ids_new as NewOrderItemRequest[],
    payment,
    account,
    additional_shipping
  }, { ip_address: req.attr?.ip });
  res.result = exchanged_order;
});
