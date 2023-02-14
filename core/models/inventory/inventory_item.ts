import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import { Product } from "@kidztime/models";
import { Inventory } from "./index"

const sequelize = Datasource.source("default-db");

class InventoryItem extends CrudModel {
  static TABLENAME = "inventory_item";

  public inventory_id!: number | null;
  public product_id!: number | null;
  public count!: number | null;

  // associations
  public inventory!: Inventory | null;
  public product!: Product | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

InventoryItem.init({
  inventory_id: model_specs.foreign_key(),
  product_id: model_specs.foreign_key(),
  count: model_specs.number(),
}, {
  ...model_utils.model_defaults(InventoryItem.TABLENAME),
  hooks, sequelize,
});

InventoryItem.crud = new CrudSpec();
InventoryItem.crud.create = ["inventory_id", "product_id", "count"];
InventoryItem.crud.update = ["inventory_id", "product_id", "count"];
InventoryItem.crud.validators = {
  create: [
    validator.required(["inventory_id", "product_id", "count"])
  ],
  update: [
    validator.trim("product_id"),
    validator.required("count"),
  ],
};

export default InventoryItem;
