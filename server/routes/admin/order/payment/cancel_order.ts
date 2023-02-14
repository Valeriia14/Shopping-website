import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { SvPayment } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { order } = req.extras!;

  const canceled_order = await SvPayment.approve_cancel_order(order, { ip_address: req.attr?.ip });

  res.result = canceled_order;
});
