import { Op } from "sequelize";
import moment, { Moment } from "moment";
import { Group, GroupProduct, Product, ProductGroup, transact } from "@kidztime/models";
import { GenericOpts } from "../types";
import { BadRequestError } from "@kidztime/errors";
import { slugify } from "@kidztime/utilities";
import { SvLog } from "..";
import { LogMessage } from "@kidztime/constants";

type CreateGroupProps = {
  type: string;
  description?: string;
  name: string;
  handle?: string;
  discount_value?: number;
  discount_type?: string;
  start_at: Moment;
  end_at: Moment;

  actor_id: number;
};

type UpdateGroupProps = {
  group: Group;
  description?: string;
  name?: string;
  discount_value?: number;
  discount_type?: string;
  start_at?: Moment;
  end_at?: Moment;
  published?: boolean;

  actor_id: number;
};

type DeleteGroupProps = {
  group: Group;
  actor_id: number;
};
type CheckGroupProps = {
  name: string;
  handle?: string;

  group_id?: number;
  update?: boolean;
};

type CheckGroupHandleProps = {
  handle?: string;

  group_id?: number;
  update?: boolean;
};

type ProductsToGroupProps = {
  group: Group;
  products: number[];
  actor_id: number;
}

type ProductsOfGroupProps = {
  group: Group;
  actor_id: number;
}

type SetGroupToProductProps = {
  groups: number[];
  product: Product;
  actor_id: number;
}
export const check_group = async (props: CheckGroupProps, opts: GenericOpts = {}) => {
  const updated_props = await transact(opts.transaction).run(async (transaction) => {
    const where = (props.update === true) ? {
      name: props.name,
      id: { [Op.ne]: props.group_id, },
    } : {
        type: props.name,
      };

    const name_conflicted_group = await Group.findOne({
      where,
      transaction,
    });
    if (name_conflicted_group)
      throw new BadRequestError("group already created with name");

    if (props.handle === null || (props.handle === undefined && props.update !== true)) {
      props.handle = slugify(props.name)
    } else if (props.update === true) {

    } else {
      props.handle = slugify(props.handle!);
    }

    await check_group_handle({ ...props }, { transaction: opts.transaction });

    return props;
  });
  return updated_props;
};

export const check_group_handle = async (props: CheckGroupHandleProps, opts: GenericOpts = {}) => {
  await transact(opts.transaction).run(async (transaction) => {
    const where = (props.update === true) ? {
      handle: props.handle,
      id: { [Op.ne]: props.group_id, },
    } : {
        handle: props.handle,
      };
    const handle_conflict = await Group.findOne({
      where,
      transaction,
    });
    if (handle_conflict)
      throw new BadRequestError("group with handle already exists");
  });
};
export const create_group = async (props: CreateGroupProps, opts: GenericOpts = {}) => {
  const { start_at, end_at } = props;
  const group = await transact(opts.transaction).run<Group>(async (transaction) => {

    const { handle } = await check_group({ name: props.name, handle: props.handle }, { transaction });
    props.handle = handle;
    props.start_at = moment(start_at, "YYYY-MM-DD");
    props.end_at = moment(end_at, "YYYY-MM-DD");

    const group = await Group.create({
      ...props,
    }, { transaction });

    await SvLog.log_activity({
      category: Group.name,
      description: LogMessage.CreateGroup,
      owner: group,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return group;
  });
  return group;
};

export const update_group = async (props: UpdateGroupProps, opts: GenericOpts = {}) => {
  const { group, start_at, end_at } = props;
  const updated_group = await transact(opts.transaction).run<Group>(async (transaction) => {
    if (start_at) props.start_at = moment(start_at, "YYYY-MM-DD");
    if (end_at) props.end_at = moment(end_at, "YYYY-MM-DD");
    await group.update(props, { transaction });

    await SvLog.log_activity({
      category: Group.name,
      description: LogMessage.UpdateGroup,
      owner: group,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return group;
  });
  return updated_group;
};

export const delete_group = async (props: DeleteGroupProps, opts: GenericOpts = {}) => {
  const { group } = props;
  await transact(opts.transaction).run(async (transaction) => {
    if (!group) throw new BadRequestError("invalid group");
    await GroupProduct.destroy({ where: { group_id: group.id }});
    await ProductGroup.destroy({ where: { group_id: group.id }});
    await group.destroy({ transaction });

    await SvLog.log_activity({
      category: Group.name,
      description: LogMessage.DeleteGroup,
      owner: group,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });
  });
};
export const set_products_to_group = async (props: ProductsToGroupProps, opts: GenericOpts = {}) => {
  const { group, products: product_ids } = props;
  await transact(opts.transaction).run(async (transaction) => {

    const products: Product[] = await Product.findAll({
      where: {
        id: product_ids,
      },
      include: [{
        model: Group,
        as: "groups"
      },
      {
        model: GroupProduct,
        as: "group_has_product",
        include:[
          {
            model: Group,
            as: 'group'
          }
        ]
      }
      ],
      transaction,
    });

    const valid_ids = products.map(item => item.id);
    const invalid_ids = product_ids.filter(product_id => !valid_ids.includes(product_id));
    if (invalid_ids.length)
      throw new BadRequestError(`invalid product`, { invalid_ids });

    // // check if product already belonged to any discount group.
    // let discount_products = [];
    // for (let p of products) {
    //   const group_products = await GroupProduct.findAll({
    //     where: { product_id: p.id },
    //     include: [Group]
    //   });
    //   for (let group_product of group_products) {
    //     // check if this product already linked to discount group or same type group
    //     if (group_product?.group.type === Group.TYPE.discount) {
    //       discount_products.push(p.id);
    //     }
    //   }
    // }
    // if (discount_products.length) throw new BadRequestError(`products already added to discount group`, { discount_products });

    // check if product already has groups with same type because product with accessory/gift group can not be added to accessroy/gift group
    let conflict_ids = [];
    for (let p of products) {
      const group_of_product = p?.group_has_product?.group.type;
      if (group.type === group_of_product) {
        conflict_ids.push(group.id);
      }
    }
    if (conflict_ids.length) throw new BadRequestError(`can not add groups because product already belonged to same type group`, { conflict_ids });

    await GroupProduct.destroy({ where: { group_id: group.id }});
    for (let p of products) {
      await GroupProduct.create({
        product_id: p.id, group_id: group.id
      }, { transaction })
    }
  })
  return group;
};

export const get_products_of_group = async (props: ProductsOfGroupProps, opts: GenericOpts = {}) => {
  const products = await transact(opts.transaction).run<Product[]>(async (transaction) => {
    const { group } = props;
    const group_has_products = await GroupProduct.findAll({
      where: { group_id: group.id },
      include: [Group, Product],
      transaction
    });

    let products: Product[] = [];

    const promises = group_has_products.map(async (item: GroupProduct) => {
      products.push(item.product)
    })
    await Promise.all(promises);

    return products
  })
  return products;
};

export const set_group_to_product = async (props: SetGroupToProductProps, opts: GenericOpts = {}) => {
  const groups = await transact(opts.transaction).run<Group[]>(async (transaction) => {
    const { product, groups: group_ids } = props;
    const groups: Group[] = await Group.findAll({
      where: {
        id: group_ids
      },
      transaction,
    });

    const valid_ids = groups.map(item => item.id);
    const invalid_ids = group_ids.filter(group_id => !valid_ids.includes(group_id));
    if (invalid_ids.length) throw new BadRequestError(`invalid group`, { invalid_ids });

    // check if there is discount group in groups. we can not add discount group here. It should be done in set_products_to_group.
    // let discount_group = [];
    // for (let group of groups) {
    //   if (group.type === Group.TYPE.discount) {
    //     discount_group.push(group.id);
    //   }
    // };
    // if (discount_group.length) throw new BadRequestError(`can not add discount groups`, { discount_group });
    
    // check if there is group with doubled type
    let doubled_group = [];
    const types = groups.map(g => g.type);
    const removed_double = [...new Set(types)];
    if (types.length !== removed_double.length) throw new BadRequestError(`can not add groups with same type`);

    // check if there is group with same type of the group that product belongs to. we can not add accessory or gift group to the product added as accessory or gift.
    let conflict_ids = [];
    const group_of_product = product?.group_has_product?.group.type;
    for (let group of groups) {
      if (group.type === group_of_product) {
        conflict_ids.push(group.id);
      }
    }
    if (conflict_ids.length) throw new BadRequestError(`can not add groups because product already belonged to same type group`, { conflict_ids });

    await ProductGroup.destroy({ where: { product_id: product.id }});
    await product.setGroups(groups, { transaction });

    await SvLog.log_activity({
      category: GroupProduct.name,
      description: LogMessage.GroupToProduct,
      owner: product,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return groups
  })
  return groups;
};