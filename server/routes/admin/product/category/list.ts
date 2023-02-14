import { controller, QueryOptions, query_meta, Request, Response } from "@kidztime/middlewares";
import { Category, CategoryProduct } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const { product } = req.extras!;

  const options = req.parse_query!();
  if (req.query.search)
    options.search(<string>req.query.search, Category.crud.search || []);
  options.include = [{
    model: CategoryProduct,
    where: {
      product_id: product.id,
    }
  }];
  const categories = await Category.findAll({
    ...options
  });

  const count_options = new QueryOptions;
  count_options.search(<string>req.query.search, Category.crud.search || []);
  count_options.include = options.include;
  const all_categories = await Category.findAll({
    ...count_options,
  });
  const count = all_categories.length;

  res.result.models = categories;
  res.result.meta = query_meta(options, count);
});
