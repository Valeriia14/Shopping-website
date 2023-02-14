import { controller, Request, Response } from "@kidztime/middlewares";
import { SvPayment } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required(["stripe_token"], { trim: true }),
], async (req: Request, res: Response) => {
  const { self, stripe_profile } = req.extras!;
  const { stripe_token, set_default_payment } = req.body;
  console.log(typeof set_default_payment)

  const model = await SvPayment.create_stripe_source(stripe_profile, stripe_token, set_default_payment, self);
  res.result.profile = stripe_profile;
  res.result.model = model;
});