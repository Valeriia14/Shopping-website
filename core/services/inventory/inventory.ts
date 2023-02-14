import sequelize from 'sequelize'
import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { cruder } from "@kidztime/middlewares";
import { Inventory, InventoryItem, OrderItem, transact } from "@kidztime/models";
import SvLog from "../logger";
import { GenericOpts } from "../types";

export type CreateInventoryProps = {
  name: string;
  description: string;
  actor_id: number;
};

export type UpdateInventoryProps = {
  inventory: Inventory;
  name: string;
  description: string;
  actor_id: number;
};

export type DeleteInventoryProps = {
  inventory: Inventory;
  actor_id: number;
};

export type UpdateStockByOrderItemProps = {
  inventory?: Inventory,
  order_item: OrderItem;
  refund?: boolean;
};

export const add_inventory = async (props: CreateInventoryProps, opts: GenericOpts = {}) => {
  const { description, name } = props;

  const inventory = await transact(opts.transaction).run<Inventory>(async (transaction) => {

    const name_conflicted_inventory = await Inventory.findOne({
      where: {
        name,
      },
      transaction,
    });

    if (name_conflicted_inventory) throw new BadRequestError("inventory already created with name");

    const inventory = await Inventory.create({
      name,
      description
    }, { transaction });

    await SvLog.log_activity({
      category: Inventory.name,
      description: LogMessage.CreateInventory,
      owner: inventory,
      actor_id: props.actor_id,
      ip_address: opts.ip_address,
    }, { transaction });


    return inventory;
  });
  return inventory;
};

export const update_stock_by_order_item = async (props: UpdateStockByOrderItemProps, opts: GenericOpts = {}) => {
  const { inventory, order_item, refund } = props;
  await transact(opts.transaction).run(async (transaction) => {
    const inventory_item = await InventoryItem.findOne({
      where: { inventory_id: inventory!.id, product_id: order_item.product_id },
      transaction
    });

    const count = refund ? inventory_item?.count! + order_item?.quantity! : inventory_item?.count! - order_item?.quantity!;
    if (!inventory_item || count < 0) throw new BadRequestError("insufficient quantity");

    await inventory_item.update({ count });
  });
};

export const update_inventory = async (props: UpdateInventoryProps, opts: GenericOpts = {}) => {
  const { inventory, actor_id } = props;

  const updated_inventory = await transact(opts.transaction).run(async (transaction) => {
    await cruder.processor(inventory, props, Inventory.crud.update);
    await inventory.save({ transaction });

    await SvLog.log_activity({
      category: Inventory.name,
      actor_id,
      description: LogMessage.UpdateInventory,
      owner: inventory,
      ip_address: opts.ip_address,
    }, { transaction });

    return inventory;
  });

  return updated_inventory;
};


export const delete_inventory = async (props: DeleteInventoryProps, opts: GenericOpts = {}) => {
  const { inventory, actor_id } = props;

  const deleted_inventory = await transact(opts.transaction).run<Inventory>(async (transaction) => {

    const available_inventory = await InventoryItem.findOne({
      attributes: [
        [sequelize.fn('sum', sequelize.col('count')), 'count'],
      ],
      group: "inventory_id",
      where: { inventory_id: inventory.id }
    });

    if (available_inventory?.count! > 0) throw new BadRequestError("inventory item count is greater than zero")

    await inventory.destroy({
      transaction
    });

    await SvLog.log_activity({
      category: Inventory.name,
      actor_id,
      description: LogMessage.DeleteInventory,
      owner: inventory,
      ip_address: opts.ip_address,
    }, { transaction });

    return inventory;
  });

  return deleted_inventory;
};
