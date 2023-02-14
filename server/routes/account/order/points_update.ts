import { controller, Request, Response } from "@kidztime/middlewares";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { order, self } = req.extras!;
  const { points } = req.body;

  const updated_order = await SvOrder.update_order_points_discount({ account: self, order, points }, { ip_address: req.attr?.ip });

  res.result = updated_order;
});
