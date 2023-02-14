import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { cruder, QueryOptions, query_meta } from "@kidztime/middlewares";
import { Category, CategoryLink, transact, Webpage, WebpageItem, Asset } from "@kidztime/models";
import { slugify, format_path } from "@kidztime/utilities";
import { Op } from "sequelize";
import { SvLog } from "..";
import { GenericOpts } from "../types";

type SetCategoryLinksProps = {
  main_id: number;
  child_ids: number[];
  parent_ids: number[];
}
type CheckCategoryHandleProps = {
  handle?: string;

  category_id?: number;
  update?: boolean;
};

type CheckCategoryProps = {
  name: string;
  handle?: string;

  category_id?: number;
  update?: boolean;
};

export type CreateCategoryProps = {
  type: string;
  name: string;
  description?: string;
  handle?: string;
  meta_keywords?: string;
  meta_title?: string;
  extras?: string;
  published: boolean;
  published_at: Date | null;

  actor_id: number;
};

type UpdateCategoryProps = {
  category: Category;

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

  actor_id?: number;
};

type FindByCategoryLinkProps = {
  category_link_type_ids: any;
  options: QueryOptions;
  exists: boolean;
}

export const check_category_handle = async (props: CheckCategoryHandleProps, opts: GenericOpts = {}) => {
  const updated_handle = await transact(opts.transaction).run(async (transaction) => {
    const where = (props.update === true) ? {
      handle: props.handle,
      id: { [Op.ne]: props.category_id, },
    } : {
        handle: props.handle,
      };
    const product_handle_conflict = await Category.findOne({
      where,
      transaction,
    });
    if (product_handle_conflict)
      throw new BadRequestError("category with handle already exists");
  });
};

export const check_category = async (props: CheckCategoryProps, opts: GenericOpts = {}) => {
  const updated_props = await transact(opts.transaction).run(async (transaction) => {
    const where = (props.update === true) ? {
      name: props.name,
      id: { [Op.ne]: props.category_id, },
    } : {
        name: props.name,
      };

    const name_conflicted_product = await Category.findOne({
      where,
      transaction,
    });
    if (name_conflicted_product)
      throw new BadRequestError("category already created with name");

    if (props.handle === null || (props.handle === undefined && props.update !== true)) {
      props.handle = slugify(props.name)
    } else if (props.update === true) {

    } else {
      props.handle = slugify(props.handle!);
    }

    await check_category_handle({ ...props }, { transaction: opts.transaction });

    return props;
  });
  return updated_props;
};

export const  create_category = async (props: CreateCategoryProps, opts: GenericOpts = {}) => {
  const category = await transact(opts.transaction).run<Category>(async (transaction) => {

    const { handle } = await check_category({ name: props.name, handle: props.handle }, { transaction, });
    props.handle = handle;

    const category = await Category.create({
      ...props,
    }, { transaction });
    await category.reload({ transaction });

    await Webpage.update(
      {
        path: format_path(props.type, props.handle!),
        type: Webpage.Type.Category,
      },
      { where: { id: category.webpage_id }, transaction }
    );

    await WebpageItem.create(
      {
        webpage_id: category.webpage_id,
        type: WebpageItem.Type.FeatureCarousel,
        position: WebpageItem.Position.Fixed,
      },
      { transaction }
    );

    await SvLog.log_activity({
      category: Category.name,
      description: LogMessage.CreateCategory,
      owner: category,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return category;
  });
  return category;
};

export const update_category = async (props: UpdateCategoryProps, opts: GenericOpts = {}) => {
  const updated_category = await transact(opts.transaction).run<Category>(async (transaction) => {
    if (props.name) {
      const { handle } = await check_category({ name: props.name, handle: props.handle, category_id: props.category.id, update: true }, { transaction });
      props.handle = handle;
    } else if (props.handle !== null) {
      await check_category_handle({ handle: props.handle, category_id: props.category.id, update: true }, { transaction });
    }

    await cruder.processor(props.category, props, Category.crud.update);
    await props.category.save({ transaction });

    if (props.asset_id){
      await Asset.destroy({
        where: {
          id: { [Op.ne]: props.asset_id },
          owner_type: Category.name,
          owner_id: props.category.id,
          assoc_type: Category.TYPE.category,
        },
        transaction
      });

      await Asset.update({
        owner_type: Category.name,
        owner_id: props.category.id,
        assoc_type: Category.TYPE.category,
        deleted_at: null
      }, {
        where: {
          id: props.asset_id
        },
        transaction
      });
    }

    await SvLog.log_activity({
      category: Category.name,
      description: LogMessage.UpdateCategory,
      owner: props.category,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return props.category;
  });
  return updated_category;
};

export const find_by_category_link = async (props: FindByCategoryLinkProps, opts: GenericOpts = {}) => {
  const { models, meta } = await transact(opts.transaction).run(async (transaction) => {
    let models, meta, options = props.options;

    if (props.exists) {
      const category_link_ids = (props.category_link_type_ids).split`,`.map((x: any) => +x);
      options.where = {
        parent_id: category_link_ids,
      };
      options.include =
        [{
          model: Category,
          as: "child",
          where: {
            type: Category.TYPE.product_type,
          },
        }];

      models = await CategoryLink.findAll({
        ...options
      });

      const count_options = new QueryOptions;
      count_options.where = options.where;
      count_options.include = options.include;

      const all_category_link = await CategoryLink.findAll({
        ...options
      });
      const count = all_category_link.length;

      meta = query_meta(options, count);
    } else {
      options.where[`type`] = Category.TYPE.product_type;
      models = await Category.findAll({
        ...options,
        transaction,
      });
      const { primary_key = "id" } = CategoryLink;
      const count_col = options.include ? primary_key : `${CategoryLink.getTableName()}.${primary_key}`;
      const count = await CategoryLink.count({
        ...options,
        distinct: true,
        col: count_col,
      });
      meta = query_meta(options, count);
    }
    return { models, meta };
  });
  return { models, meta };
};

export const set_category_links = async (props: SetCategoryLinksProps, opts: GenericOpts = {}) =>{
  const { main_id, parent_ids, child_ids } = props
  let result = await transact(opts.transaction).run(async (transaction) =>{
    const res = await CategoryLink.destroy({
      where: {
        parent_id: main_id,
        id: { [Op.notIn]: child_ids }
      },
      transaction
    })
    let createdLinks = []
    for(let i=0; i < parent_ids.length; i++){
      const item = {
          parent_id: parent_ids[i],
          child_id: main_id,
      }
      const existing_link = await CategoryLink.findOne({
          where: item,
          transaction
        });
        if (!existing_link){
          const link = await CategoryLink.create({
            ...item,
            type: "category"
          }, {transaction})
          createdLinks.push(link)
        }
    }
    for(let i=0; i < child_ids.length; i++){
      const item = {
          parent_id: main_id,
          child_id: child_ids[i],
      }
      const existing_link = await CategoryLink.findOne({
          where: item, 
          transaction
        });
        if (!existing_link){
          const link = await CategoryLink.create({
            ...item,
            type: "category"
          }, {transaction})
          createdLinks.push(link)
        }
    }
    return createdLinks
  })
  return result
}
