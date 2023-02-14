import { controller, Request, Response } from "@kidztime/middlewares";
import { SvPayment } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required(["amount","stripe_token"], { trim: true }),
], async (req: Request, res: Response) => {
  const { amount, stripe_token, currency } = req.body;

  const model = await SvPayment.create_charges(amount, stripe_token, currency);
  res.result.model = model;
});