import { controller, Request, Response } from "@kidztime/middlewares";
import { Product } from "@kidztime/models";
import { SvProduct } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";

export default controller([], async (req: Request, res: Response) => {
  const { crudscope, product, self } = req.extras!;
  const { category_id, character_id, product_type_id } = req.body;

  await product.update({
    category_id,
    character_id,
    product_type_id,
  });
  product.reload();

  // res.result.model = await model_utils
  //   .scope(Product, crudscope)
  //   .findByPk(product.id);
  res.result.model = product;
});
