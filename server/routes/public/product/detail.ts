import { controller, Request, Response } from "@kidztime/middlewares";
import SvProduct from "@kidztime/services/product";

export default controller(async (req: Request, res: Response) => {
  const { self, product } = req.extras!;

  const product_detail = await SvProduct.get_product_detail({ product, actor_id: self?.id, is_admin: false }, { ip_address: req.attr?.ip });

  res.result.model = product_detail;
});
