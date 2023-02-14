import { controller, Request, Response } from "@kidztime/middlewares";
import {
  Asset,
  Product,
  ProductType,
  Webpage,
  WebpageItem,
} from "@kidztime/models";
import { Op } from "sequelize";

export default controller(async (req: Request, res: Response) => {
  const product_type = req.extras![ProductType.name];
  const webpage_id = product_type?.webpage_id;

  const webpage_items: WebpageItem[] = await WebpageItem.findAll({
    where: {
      webpage_id: webpage_id,
    },
  });
  const products: Product[] = await Product.findAll({
    where: {
      product_type_id: product_type.id,
    },
  });
  const webpage_items_id = webpage_items.map((item) => item.id) || [];
  const products_id = products.map((item) => item.id) || [];
  const RESULTS = await Promise.all([
    Product.update(
      {
        product_type_id: null,
      },
      {
        where: {
          id: { [Op.in]: products_id },
        },
      }
    ),
    Asset.destroy({
      where: {
        owner_id: { [Op.in]: [product_type.id, ...webpage_items_id] },
      },
    }),
    WebpageItem.destroy({
      where: {
        webpage_id: webpage_id,
      },
    }),
    Webpage.destroy({
      where: {
        id: webpage_id,
      },
    }),
    product_type.destroy(),
  ]);
});
