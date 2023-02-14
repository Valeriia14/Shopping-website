import { controller, Request, Response } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import { SvProduct } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";

export default controller([
  validator.id_array(["categories"]),
], async (req: Request, res: Response) => {
  const { crudscope, product, self } = req.extras!;
  const { categories } = req.body;

  await SvProduct.update_category({
    categories,
    product,
    actor_id: self.id,
  }, { ip_address: req.attr?.ip });

  res.result.model = await model_utils.scope(Product, crudscope).findByPk(product.id);
});
