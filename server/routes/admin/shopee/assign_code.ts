import { controller, Request, Response } from "@kidztime/middlewares";
import { SvShoppe } from "@kidztime/services";
import SvUGC from "@kidztime/services/ugc";

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const body = req.body
  const { code, shop_id } = body
  const token = await SvShoppe.assign_shopee_seller_code(code, shop_id)
  res.result.token = token
});
