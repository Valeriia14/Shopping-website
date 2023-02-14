import {
  controller,
  Request,
  Response,
} from "@kidztime/middlewares";
import { QuestionAnswer, Review } from "@kidztime/models/ugc";
import {
  Product,
  Category,
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
  const { category_id } = req.params;
  const { gender, price, age, sortby, producttypeid, limit } = req.query!;
  const opts: GenericOpts = {};
  const { transaction } = opts;

  if (category_id) {
    let options: any = {};
    if (producttypeid) {
      options.productQuery = {
        product_type_id: producttypeid,
      };
    } else {
      options.productQuery = {
        category_id: category_id,
      };
    }
    if (age) {
      options.productTypeQuery = {
        min_age: {
          [Op.gte]: age?.split("-")[0],
          [Op.lte]: age?.split("-")[1],
        },
        max_age: {
          [Op.gte]: age?.split("-")[0],
          [Op.lte]: age?.split("-")[1],
        },
      };
    } else {
      options.productTypeQuery = {};
    }

    const categorys = await Category.findAll({
      where: {
        type: "category",
      },
      transaction,
    });
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
          where: {
            ...options?.productTypeQuery,
          },
        },
      ],
      where: {
        ...options?.productQuery,
        price: {
          [Op.gte]: price?.split(",")[0],
          [Op.lte]: price?.split(",")[1],
        },
      },
      order: [[sortby?.split(":")[0], sortby?.split(":")[1]]],
      transaction,
    });

    const producttypes = await ProductType.findAll({
      where: {
        category_id: category_id,
      },
      transaction,
    });

    res.result.models = {
      categorysTab: categorys.map((category) => ({
        category: category?.handle,
        productTypeTab:
          category?.id === parseInt(category_id)
            ? producttypes
            : [],
      })),
      products: products,
    };
    res.result.meta = {
      count : products?.length,
    };
  }
});
