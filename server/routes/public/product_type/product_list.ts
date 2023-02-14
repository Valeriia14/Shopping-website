import {
  controller,
  Request,
  Response,
} from "@kidztime/middlewares";
import { Review } from "@kidztime/models/ugc";
import {
  Product,
  Asset,
  ProductType,
  Character,
} from "@kidztime/models";
import { Transaction } from "sequelize/types";
import { Op } from "sequelize";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default controller(async (req: Request, res: Response) => {
  const { product_type_id } = req.params;
  const { gender, price, sortby } = req.query!;
  const opts: GenericOpts = {};
  const { transaction } = opts;

  if (product_type_id) {
    let options: any = {};
   
    const products = await Product.findAll({
      include: [
        { 
          model: Review
        },
        {
          model: Asset,
          as: "PreviewImage"
        },
        {
          model: Character,
          where: {
            [Op.or]: [
              { if_boy: gender?.split(",")[0] },
              { if_girl: gender?.split(",")[1] },
            ],
          },
        },
        {
          model: ProductType,
        },
      ],
      where: {
        product_type_id,
        price: {
          [Op.gte]: price?.split(",")[0],
          [Op.lte]: price?.split(",")[1],
        },
      },
      order: [[sortby?.split(":")[0], sortby?.split(":")[1]]],
      transaction,
    });

    res.result.models = {
      products: products,
    };
    res.result.meta = {
      count : products?.length,
    };
  }
});
