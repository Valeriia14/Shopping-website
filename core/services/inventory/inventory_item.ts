import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { cruder } from "@kidztime/middlewares";
import { model_utils } from "@kidztime/utilities";
import { Inventory, InventoryItem, Order, OrderItem, Product, transact } from "@kidztime/models";
import SvLog from "../logger";
import { GenericOpts } from "../types";

export type CreateInventoryItemProps = {
  inventory_id: number;
  product_id: number;
  count: number;

  actor_id: number;
};

export type UpdateInventoryItemProps = {
  inventory_item: InventoryItem;
  count: number;

  actor_id: number;
};

export type DeleteInventoryItemProps = {
  inventory_item: InventoryItem;

  actor_id: number;
};

export type UpdateInventoryItemByProductProps = {
  inventory: Inventory,
  count: number;
  product: Product;
  actor_id: number;
};

export type ListInventoryItemProps = {
  inventory_ids: number[],
  product_ids: number[];
  actor_id: number;
  crudscope: string;
};

export type UpdateStockProps = {
  order: Order;
};

export const add_inventory_item = async (props: CreateInventoryItemProps, opts: GenericOpts = {}) => {
  const { product_id, inventory_id } = props
  const inventory_item = await transact(opts.transaction).run<InventoryItem>(async (transaction) => {
    const name_conflicted_inventory_item = await InventoryItem.findOne({
      where: {
        product_id,
        inventory_id
      },
      transaction,
    });

    if (name_conflicted_inventory_item) throw new BadRequestError("inventory item already created with product and inventory");

    const inventory_item = await InventoryItem.create({
      ...props
    }, { transaction });

    await SvLog.log_activity({
      category: InventoryItem.name,
      description: LogMessage.CreateInventoryItem,
      owner: inventory_item,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return inventory_item;
  });

  return inventory_item;
};

export const update_inventory_item = async (props: UpdateInventoryItemProps, opts: GenericOpts = {}) => {
  const { actor_id, inventory_item } = props;

  const updated_inventory = await transact(opts.transaction).run(async (transaction) => {
    await cruder.processor(inventory_item, props, InventoryItem.crud.update);
    await inventory_item.save({ transaction });


    await SvLog.log_activity({
      category: InventoryItem.name,
      description: LogMessage.UpdateInventoryItem,
      owner: inventory_item,
      actor_id,
      ip_address: opts.ip_address,
    }, { transaction });


    return InventoryItem;
  });

  return updated_inventory;
};


export const delete_inventory_item = async (props: DeleteInventoryItemProps, opts: GenericOpts = {}) => {
  const { inventory_item } = props;

  const updated_inventory = await transact(opts.transaction).run<InventoryItem>(async (transaction) => {

    await inventory_item.destroy({
      transaction
    });

    await SvLog.log_activity({
      category: InventoryItem.name,
      description: LogMessage.DeleteInventoryItem,
      owner: inventory_item,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });

    return inventory_item;
  });

  return updated_inventory;
};

export const update_inventory_by_product = async (props: UpdateInventoryItemByProductProps, opts: GenericOpts = {}) => {
  const { inventory, product, count, actor_id } = props;

  const updated_inventory = await transact(opts.transaction).run(async (transaction) => {
    let inventory_item = await InventoryItem.findOne({
      where: {
        inventory_id: inventory.id, 
        product_id: product.id,
      },
      transaction,
    })

    if (!inventory_item) {
      inventory_item = await InventoryItem.create({
        inventory_id: inventory.id,
        product_id: product.id,
        count,
      }, { transaction });

      await SvLog.log_activity({
        category: InventoryItem.name,
        actor_id,
        description: LogMessage.CreateInventoryItem,
        owner: inventory_item,
        ip_address: opts.ip_address,
      }, { transaction });
    } else {
      await cruder.processor(inventory_item, { count }, InventoryItem.crud.update);
      await inventory_item.save({ transaction });

      await SvLog.log_activity({
        category: InventoryItem.name,
        actor_id,
        description: LogMessage.UpdateInventoryItem,
        owner: inventory_item,
        ip_address: opts.ip_address,
      }, { transaction });
    }

    return inventory_item;
  });

  return updated_inventory;
};

export const list_inventory_items = async (props: ListInventoryItemProps, opts: GenericOpts = {}) => {
  const { inventory_ids, product_ids, crudscope } = props;
  const listscope = `${crudscope}_list`;
  const scoped_model_def = model_utils.scope(InventoryItem, listscope, crudscope);

  const filtered_inventory_items = await transact(opts.transaction).run(async (transaction) => {
    const inventory_items = await scoped_model_def.findAll({
      where: { inventory_id: inventory_ids, product_id: product_ids },
      transaction
    })

    return inventory_items;
  });

  return filtered_inventory_items;
};

export const update_stock = async (props: UpdateStockProps, opts: GenericOpts = {}) => {
  const { order } = props;
  const name = "kidztime"

  await transact(opts.transaction).run(async (transaction) => {
    const inventory = await Inventory.findOne({
      where: { name }
    })
    if (!inventory) throw new BadRequestError("inventory for this platform not found");

    const order_items = await OrderItem.findAll({
      where: { order_id: order.id, },
      transaction,
    });

    for (const item of order_items) {
      const available_inventory = await InventoryItem.findOne({
        where: { inventory_id: inventory.id, product_id: item.product_id },
        transaction
      });

      const count = available_inventory?.count! - item?.quantity!
      if (!available_inventory || count < 0) throw new BadRequestError("insufficient quantity");

      await InventoryItem.update({ count }, { where: { inventory_id: inventory.id, product_id: item.product_id }, transaction });
    }
  });
};
