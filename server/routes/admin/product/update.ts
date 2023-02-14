import { controller, Request, Response } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import SvProduct from "@kidztime/services/product";
import { model_utils } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { self, product } = req.extras!;
  const { handle, name, alt_name, sku, upc, material, stock, status, price, description, parent_id } = req.body;

  const updated_product = await SvProduct.update_product({ product, handle, name, alt_name, sku, upc, material, stock, status, price, description, parent_id, actor_id: self.id }, { ip_address: req.attr?.ip });

  res.result.model = await model_utils.scope(Product, "admin_detail").findByPk(updated_product.id);
});
