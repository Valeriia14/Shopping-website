import { controller, Request, Response } from "@kidztime/middlewares";
import { SvOrder } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required("account_id"),
], async (req: Request, res: Response) => {
  const { account_id } = req.body;

  const order = await SvOrder.create_order({ account_id }, { ip_address: req.attr?.ip });

  res.result.model = order;
});