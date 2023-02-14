import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { cruder, QueryOptions, query_meta } from "@kidztime/middlewares";
import { ProductType, transact, Webpage, WebpageItem, Asset } from "@kidztime/models";
import { slugify, format_path } from "@kidztime/utilities";
import { Op } from "sequelize";
import { SvLog } from "..";
import { GenericOpts } from "../types";

type SetProductTypeLinksProps = {
  main_id: number;
  child_ids: number[];
  parent_ids: number[];
}
type CheckProductTypeHandleProps = {
  handle?: string;

  product_type_id?: number;
  update?: boolean;
};

type CheckProductTypeProps = {
  name: string;
  handle?: string;

  product_type_id?: number;
  update?: boolean;
};

export type CreateProductTypeProps = {
  type: string;
  name: string;
  description?: string;
  handle?: string;
  meta_keywords?: string;
  meta_title?: string;
  extras?: string;
  published: boolean;
  published_at: Date | null;
  min_age?: number;
  max_age?: number;

  actor_id: number;
};

type UpdateProductTypeProps = {
  product_type: ProductType;

  type?: string;
  name?: string;
  description?: string;
  handle?: string;
  meta_keywords?: string;
  meta_title?: string;
  extras?: string;
  published?: boolean;
  published_at?: Date | null;
  asset_id?: number;
  min_age?: string;
  max_age?: string;

  actor_id?: number;
};

type FindByProductTypeLinkProps = {
  product_type_link_type_ids: any;
  options: QueryOptions;
  exists: boolean;
}

export const check_product_type_handle = async (props: CheckProductTypeHandleProps, opts: GenericOpts = {}) => {
  const updated_handle = await transact(opts.transaction).run(async (transaction) => {
    const where = (props.update === true) ? {
      handle: props.handle,
      id: { [Op.ne]: props.product_type_id, },
    } : {
        handle: props.handle,
      };
    const product_handle_conflict = await ProductType.findOne({
      where,
      transaction,
    });
    if (product_handle_conflict)
      throw new BadRequestError("product_type with handle already exists");
  });
};

export const check_product_type = async (props: CheckProductTypeProps, opts: GenericOpts = {}) => {
  const updated_props = await transact(opts.transaction).run(async (transaction) => {
    const where = (props.update === true) ? {
      name: props.name,
      id: { [Op.ne]: props.product_type_id, },
    } : {
        name: props.name,
      };

    const name_conflicted_product = await ProductType.findOne({
      where,
      transaction,
    });
    if (name_conflicted_product)
      throw new BadRequestError("product_type already created with name");

    if (props.handle === null || (props.handle === undefined && props.update !== true)) {
      props.handle = slugify(props.name)
    } else if (props.update === true) {

    } else {
      props.handle = slugify(props.handle!);
    }

    await check_product_type_handle({ ...props }, { transaction: opts.transaction });

    return props;
  });
  return updated_props;
};

export const  create_product_type = async (props: CreateProductTypeProps, opts: GenericOpts = {}) => {
  const product_type = await transact(opts.transaction).run<ProductType>(async (transaction) => {

    const { handle } = await check_product_type({ name: props.name, handle: props.handle }, { transaction, });
    props.handle = handle;
 
    const product_type = await ProductType.create({
      ...props,
    }, { transaction });

    await product_type.reload({ transaction });

    await Webpage.update(
      {
        path: format_path(props.type, props.handle!),
        type: Webpage.Type.ProductType,
      },
      { where: { id: product_type.webpage_id }, transaction }
    );

    await WebpageItem.create({
      webpage_id: product_type.webpage_id,
      type: WebpageItem.Type.ProductContent,
      position: WebpageItem.Position.Fixed
    }, { transaction })
    await WebpageItem.create({
      webpage_id: product_type.webpage_id,
      type: WebpageItem.Type.MediaAttributes,
      position: WebpageItem.Position.Fixed
    }, { transaction })
    await WebpageItem.create({
      webpage_id: product_type.webpage_id,
      type: WebpageItem.Type.FeatureCarousel,
      position: WebpageItem.Position.Fixed
    }, { transaction })

    await SvLog.log_activity({
      product_type: ProductType.name,
      description: LogMessage.CreateProductType,
      owner: product_type,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return product_type;
  });
  return product_type;
};

export const update_product_type= async (props: UpdateProductTypeProps, opts: GenericOpts = {}) => {
  const updated_category = await transact(opts.transaction).run<ProductType>(async (transaction) => {
    if (props.name) {
      const { handle } = await check_product_type({ name: props.name, handle: props.handle, product_type_id: props.product_type.id, update: true }, { transaction });
      props.handle = handle;
    } else if (props.handle !== null) {
      await check_product_type_handle({ handle: props.handle, product_type_id: props.product_type.id, update: true }, { transaction });
    }

    await cruder.processor(props.product_type, props, ProductType.crud.update);
    await props.product_type.save({ transaction });

    if (props.asset_id){
      await Asset.destroy({
        where: {
          id: { [Op.ne]: props.asset_id },
          owner_type: ProductType.name,
          owner_id: props.product_type.id,
          assoc_type: ProductType.TYPE,
        },
        transaction
      });

      await Asset.update({
        owner_type: ProductType.name,
        owner_id: props.product_type.id,
        assoc_type: ProductType.TYPE,
        deleted_at: null
      }, {
        where: {
          id: props.asset_id
        },
        transaction
      });
    }

    await SvLog.log_activity({
      category: ProductType.name,
      description: LogMessage.UpdateCategory,
      owner: props.product_type,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return props.product_type;
  });
  return updated_category;
};