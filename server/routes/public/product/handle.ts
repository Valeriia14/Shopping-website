import { controller, Request, Response } from "@kidztime/middlewares";
import { model_utils } from "@kidztime/utilities";
import { Product } from "@kidztime/models";
import { SvProduct } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const handle = req.path.replace("/", "").replace("/", "");

  const product = await model_utils.scope(Product, "public_detail").findOne({ where: { handle, } });
  const modified_product_response = await SvProduct.modify_product_response({ product: product!, is_admin: false });
  res.result.path = modified_product_response;
});