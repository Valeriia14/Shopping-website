import { controller, Request, Response } from "@kidztime/middlewares";
import { SvPayment } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;

  const payment_method = await SvPayment.find_payment_method(
    { account: self },
    { ip_address: req.attr?.ip }
  );

  res.result.model = payment_method
});
