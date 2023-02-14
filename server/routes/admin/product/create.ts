import { controller, Request, Response } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import SvProduct from "@kidztime/services/product";
import { model_utils, validator } from "@kidztime/utilities";

export default controller([
  validator.required(["name", "status", "stock"]),
  validator.trim("handle", { clean: true }),
], async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { handle, name, alt_name, sku, upc, material, stock, status, price, description, parent_id } = req.body;

  const product = await SvProduct.create_product({ handle, name, alt_name, sku, upc, material, stock, status, price, description, parent_id, actor_id: self.id }, { ip_address: req.attr?.ip });

  res.result.model = await model_utils.scope(Product, "admin_detail").findByPk(product.id);
});
