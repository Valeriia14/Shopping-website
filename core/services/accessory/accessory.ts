import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { Product, transact } from "@kidztime/models";
import { slugify } from "@kidztime/utilities";
import SvLog from "../logger";
import { GenericOpts } from "../types";

export type CreateAccessoryProps = {
  handle: string;
  name: string;
  alt_name: string;
  sku: string;
  upc: string;
  material: string;
  stock: number;
  status: string;
  price: number;
  unit: number;
  actor_id: number;
};

export type UpdateAccessoryInfoProps = {
  accessory: any;

  handle: string;
  name: string;
  alt_name: string;
  sku: string;
  upc: string;
  material: string;
  stock: number;
  status: string;
  price: number;
  unit: number;
  actor_id: number;
};

export type UpdateAccessoryProps = {
  accessory: any;
  products: number[];
  actor_id: number;
};

export const update_product = async (props: UpdateAccessoryProps, opts: GenericOpts = {}) => {
  const { accessory, products: product_ids } = props;
  console.log({ props })
  await transact(opts.transaction).run(async (transaction) => {
    const products: Product[] = await Product.findAll({
      where: {
        id: product_ids,
      },
      transaction,
    });

    const valid_ids = products.map(item => item.id);
    const invalid_ids = product_ids.filter(category_id => !valid_ids.includes(category_id));
    if (invalid_ids.length)
      throw new BadRequestError(`invalid product`, { invalid_ids });

    await accessory.setProducts(products, { transaction });

  });
};