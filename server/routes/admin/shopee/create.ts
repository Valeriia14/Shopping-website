import { controller, Request, Response } from "@kidztime/middlewares";
import { SvShoppe } from "@kidztime/services";
import SvUGC from "@kidztime/services/ugc";

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const body = req.body
  const authorize_url = await SvShoppe.create_shopee_seller({
    ...body,
    account_id: self.id
  })
  res.result.url = authorize_url
});
