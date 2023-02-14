import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { cruder } from "@kidztime/middlewares";
import {
  Category,
  Group,
  GroupProduct,
  Order,
  OrderItem,
  Product,
  ProductInfo,
  transact,
} from "@kidztime/models";
import { slugify } from "@kidztime/utilities";
import SvLog from "../logger";
import { GenericOpts } from "../types";

const MAX_HANDLE_GEN_ATTEMPT = 100;

export type CreateProductProps = {
  parent_id?: number;
  handle: string;
  name: string;
  alt_name: string;
  sku: string;
  upc: string;
  material: string;
  stock: number;
  status: string;
  price: number;

  description: string;
  actor_id: number;
};

export type UpdateProductInfoProps = {
  product: Product;

  parent_id?: number;
  handle: string;
  name: string;
  alt_name: string;
  sku: string;
  upc: string;
  material: string;
  stock: number;
  status: string;
  price: number;

  description: string;
  actor_id: number;
};

export type UpdateStockProps = {
  order: Order;
};

export type UpdateCategoryProps = {
  product: Product;
  categories: number[];
  actor_id: number;
};

export type GetProductDetailProps = {
  product: Product;
  actor_id: number;
  is_admin: boolean;
};

export type GroupResponseType = {
  items: Product[];
  discount_value: number;
  discount_type: string;
  id?: number | null;
  name?: string | null;
  published?: boolean | null;
};

export type ModifyProductProps = {
  product: Product;
  is_admin: boolean;
};

const generate_next_handle = (handle: string) => {
  const numeric_ending = handle.match(/[0-9]+$/);
  let numeric_suffix = 1;
  if (numeric_ending) {
    numeric_suffix = parseInt(numeric_ending[0]) + 1;
  }
  return handle.replace(/[-0-9]*$/, `-${numeric_suffix}`);
};

export const create_product = async (props: CreateProductProps, opts: GenericOpts = {}) => {
  const { description } = props;

  const product = await transact(opts.transaction).run(async (transaction) => {
    if (props.handle === undefined) {
      props.handle = slugify(props.name)
    } else {
      props.handle = slugify(props.handle);
    }

    let product_handle_conflict: Product | null = null;
    let handle_generation_attempt = 0;
    while (handle_generation_attempt < MAX_HANDLE_GEN_ATTEMPT) {
      product_handle_conflict = await Product.findOne({
        where: {
          handle: props.handle,
        },
        transaction,
      });

      // exit loop if no conflict
      if (!product_handle_conflict) break;

      props.handle = generate_next_handle(props.handle);
    }
    if (product_handle_conflict)
      throw new BadRequestError("product with handle already exists");

    const product = await Product.create({
      ...props,
    }, { transaction });


    await SvLog.log_activity({
      category: Product.name,
      description: LogMessage.CreateProduct,
      owner: product,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return product;
  });
  return product;
};

export const update_product = async (props: UpdateProductInfoProps, opts: GenericOpts = {}) => {
  const { product, actor_id } = props;
  let { handle } = props;
  console.log({ props })

  const updated_product = await transact(opts.transaction).run(async (transaction) => {
    let meta;
    if (handle !== undefined) {
      handle = slugify(handle);

      props.handle = handle;
    }
    await cruder.processor(product, props, Product.crud.update);
    await product.save({ transaction });

    await SvLog.log_activity({
      category: Product.name,
      actor_id,
      description: LogMessage.UpdateProduct,
      owner: product,
      ip_address: opts.ip_address,
    }, { transaction });
    return product;
  });

  return updated_product;
};

export const update_stock = async (props: UpdateStockProps, opts: GenericOpts = {}) => {
  const { order } = props;

  await transact(opts.transaction).run(async (transaction) => {
    const order_items = await OrderItem.findAll({
      where: { order_id: order.id, },
      transaction,
    });

    const products = [];
    for (const item of order_items) {
      const product = await Product.findByPk(item.product_id, { transaction });
      products.push(product!);
    }

    for (let i = 0; i < products.length; i++) {
      const new_quantity = products[i].stock! - order_items[i].quantity!;
      if (new_quantity < 0) new BadRequestError("insufficient quantity");
      await products[i].update({
        stock: new_quantity,
      }, { transaction });
    }
  });
};

export const update_category = async (props: UpdateCategoryProps, opts: GenericOpts = {}) => {
  const { product, categories: category_ids } = props;
  await transact(opts.transaction).run(async (transaction) => {
    const categories: Category[] = await Category.findAll({
      where: {
        id: category_ids,
      },
      transaction,
    });

    const valid_ids = categories.map(item => item.id);
    const invalid_ids = category_ids.filter(category_id => !valid_ids.includes(category_id));
    if (invalid_ids.length)
      throw new BadRequestError(`invalid category`, { invalid_ids });

    await product.setCategories(categories, { transaction });

    await SvLog.log_activity({
      category: Category.name,
      description: LogMessage.UpdateAdminPrivilege,
      owner: product,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });
  });
};

export const modify_product_response = async (props: ModifyProductProps) => {
  let { product, is_admin } = props;

  const detail: any = product.toJSON();

  let accessory: GroupResponseType = {
    id: null,
    name: null,
    discount_type: "",
    discount_value: 0,
    published: null,
    items: []
  } ;
  let gift: GroupResponseType = {
    id: null,
    name: null,
    discount_type: "",
    discount_value: 0,
    published: null,
    items: []
  } ;
  if (detail.groups) {
    detail.groups.map((group: Group) => {
      // if (!group.published && !is_admin) return;
      if (group.type === Group.TYPE.accessory) {
        accessory.id = group.id;
        accessory.name = group.name;
        accessory.discount_value = group.discount_value;
        accessory.discount_type = group.discount_type;
        accessory.published = group.published;
        accessory.items = group.products_of_group.map((item: GroupProduct) => item.product);
      }
      if (group.type === Group.TYPE.gift) {
        gift.id = group.id;
        gift.name = group.name;
        gift.discount_value = group.discount_value;
        gift.discount_type = group.discount_type;
        gift.published = group.published;
        gift.items = group.products_of_group.map((item: GroupProduct) => item.product);
      }
    });
  }
  detail.accessory = accessory;
  detail.gift = gift;
  // if (!detail?.group?.published && !is_admin) detail.group = null;

  // delete detail.groups;
  
  return detail;
}

export const get_product_detail = async (props: GetProductDetailProps, opts: GenericOpts = {}) => {
  let { product, actor_id, is_admin } = props;
  const detail = await modify_product_response({ product, is_admin });
  
  await SvLog.log_activity({
    category: Product.name,
    actor_id,
    description: LogMessage.GetProduct,
    owner: product,
    ip_address: opts.ip_address,
  }, { transaction: opts.transaction });
  return detail;
};

export const get_product_info = async (props: GetProductDetailProps,opts: GenericOpts = {}) => {
  let { product } = props;
  const res = await transact(opts.transaction).run(async (transaction) => {
    const getInfo = async (type) => {
      return await ProductInfo.findAll({
        transaction,
        where: {
          product_type_id: 1,
          component_type: type,
          deleted_at: null
        },
      });
    }
    const getDescription =  async (product_id) => {
      return await ProductInfo.findOne({
        transaction,
        where: {
          product_id,
          deleted_at: null
        },
      });
    }
    const result = await Promise.all( [await getInfo(ProductInfo.ComponentType.MaterialIngredientCare),await getInfo(ProductInfo.ComponentType.Features),await getInfo(ProductInfo.ComponentType.Certificate),await getDescription(product.id)])
    return {
      "material_ingredient_care": result[0],
      "features": result[1],
      'certificate': result[2],
      'description': result[3]?.description || null 
    };
  });
  return res
}