import { controller, query_meta, Request, Response } from "@kidztime/middlewares";
import { Category, CategoryProduct, InventoryItem, Product } from "@kidztime/models";
import { SvProduct } from "@kidztime/services";
import { model_utils } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { categories, inventory } = req.query!;

  const options = req.parse_query!();
  let count;
  if (categories) {
    const category_ids = categories!.toString().split(`,`).map((x: any) => +x);
    options.include = [{
      model: CategoryProduct,
      include: [{
        model: Category,
        where: {
          id: category_ids,
        },
      }],
    }];
    const all_products = await Product.findAll({
      include: [{
        model: CategoryProduct,
        include: [{
          model: Category,
          where: {
            id: category_ids,
          },
        }],
        required: true,
      }],
    });
    count = all_products.length;
  } else if(inventory) {
    const inventory_ids = inventory!.toString().split(`,`).map((x: any) => +x);
    options.include = [{
      model: Category,
    }, { 
      model: InventoryItem,
      where: {
        inventory_id: inventory_ids,
      },
      required: false,
    }];
    options.order = [["id", 'ASC']];
    options.where = {
      $parent_id$: null
    }
    const { primary_key = "id" } = Product;
    const count_col = options.include ? primary_key : `${Product.getTableName()}.${primary_key}`;
    count = await Product.count({
      ...options,
      distinct: true,
      col: count_col,
    });
  } else  {
    options.include = [{
      model: Category,
    }];
    const { primary_key = "id" } = Product;
    const count_col = options.include ? primary_key : `${Product.getTableName()}.${primary_key}`;
    count = await Product.count({
      ...options,
      distinct: true,
      col: count_col,
    });
  }

  const products = await model_utils.scope(Product, "public").findAll({
    ...options,
  });

  let _products: any[] = [];
  const promises = products.map(async (product: Product) => {
    const product_detail = await SvProduct.modify_product_response({ product, is_admin: false });
    _products.push(product_detail);
  });

  await Promise.all(promises);

  res.result.models = _products;
  res.result.meta = query_meta(options, count);
});
