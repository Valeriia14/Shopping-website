import { controller, Request, Response } from "@kidztime/middlewares";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { self, crudscope } = req.extras!;
  const { cart, stripeToken, shippingAddress, billingAddress, note } = req.body;

  const updated_order = await SvOrder.checkout({
    cart,
    stripeToken,
    account: self,
    crudscope,
    shippingAddress,
    billingAddress,
    note
  }, { ip_address: req.attr?.ip });

  res.result = updated_order;
});
