import { controller, Request, Response } from "@kidztime/middlewares";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { order, self } = req.extras!;
  const { save, stripe_token, payment_method_id, points } = req.body;

  const updated_order = await SvOrder.checkout({
    order,
    account: self,
    save,
    stripe_token,
    payment_method_id,
    points,
  }, { ip_address: req.attr?.ip });

  res.result = updated_order;
});
