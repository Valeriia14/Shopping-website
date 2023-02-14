import { controller, Request, Response } from "@kidztime/middlewares";
import { Asset, Category, CategoryLink, CategoryProduct, Product, ProductType, Webpage, WebpageItem } from "@kidztime/models";
import { Op } from "sequelize";

export default controller(async (req: Request, res: Response) => {
  const category = req.extras![Category.name];
  const webpage_id = category?.webpage_id;

  const webpage_items : WebpageItem[] = await WebpageItem.findAll({
    where: {
      webpage_id: webpage_id
    }
  })
  const products: Product[] = await Product.findAll({
    where: {
      category_id: category.id,
    },
  });

  const product_types: ProductType[] = await ProductType.findAll({
    where: {
      category_id: category.id,
    },
  });
  const webpage_items_id = webpage_items.map((item) =>item.id) || [];
  const products_id = products.map((item) => item.id) || [];
  const product_types_id = product_types.map((item) => item.id) || [];
  const RESULTS = await Promise.all([
    Product.update(
      {
        category_id: null,
      },
      {
        where: {
          id: { [Op.in]: products_id },
        },
      }
    ),
    ProductType.update(
      {
        category_id: null,
      },
      {
        where: {
          id: { [Op.in]: product_types_id },
        },
      }
    ),
    Asset.destroy({
      where: {
        owner_id : {[Op.in]: [category.id,...webpage_items_id] }
      },
    }),
    WebpageItem.destroy({
      where: {
        webpage_id: webpage_id
      }
    }),
    Webpage.destroy({
      where: {
        id: webpage_id
      }
    }),
    category.destroy()
  ])
});
