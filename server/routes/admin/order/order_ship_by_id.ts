import { BadRequestError } from "@kidztime/errors";
import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { SvOrder } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required(["tracking_id", "weight"]),
  validator.number(["weight"]),
], async (req: Request, res: Response) => {
  const { tracking_id, weight } = req.body!;
  const { order } = req.extras!;
  if (!order) throw new BadRequestError("no found order!");
  if (order.status !== Order.STATUS.processed) throw new BadRequestError("this order can not be shipped!");
  await order.update({
    tracking_id,
    weight: Number(weight).toFixed(2)
  });
  await SvOrder.update_order_status({ status: Order.STATUS.shipped, order }, {});
  
  res.result = order;
});
