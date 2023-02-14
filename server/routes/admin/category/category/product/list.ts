import { controller, QueryOptions, query_meta, Request, Response } from "@kidztime/middlewares";
import { Category, CategoryProduct, Product } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const { category } = req.extras!;
  const options = req.parse_query!();
  if (req.query.search)
    options.search(<string>req.query.search, Product.crud.search || []);
  options.include = [{
    model: CategoryProduct,
    include: [{
      model: Category,
      where: {
        id: category.id,
      },
    }],
  }, {
    model: Category
  }];
  const products = await Product.findAll({
    ...options
  });

  const count = products.length;
  res.result.models = products;
  res.result.meta = query_meta(options, count);
});
