import { controller, Request, Response } from "@kidztime/middlewares";
import { SvPayment } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { token, save, stripe_token, payment_method_id, email } = req.body;
  const resolved_order = await SvPayment.pay_exchange_diff({
    token,
    save,
    stripe_token,
    payment_method_id,
    email,
    account: self
  }, { ip_address: req.attr?.ip });

  res.result = resolved_order;
});
