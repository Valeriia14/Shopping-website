import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import { Session } from "..";
import { Product } from "../product";
const sequelize = Datasource.source("default-db");

class CartItem extends CrudModel {
  static TABLENAME = "cart_item";
  static STATUS = {
    created : "created",
    deleted : "deleted",
    completed : "completed",
  }


  public created_at!: Date | null;
  public updated_at!: Date | null;
  public deleted_at!: Date | null;
  public product_id!: number | null;
  public reference!: string | null;
  public session_id!: number | null;
  public parent_id!: number | null;
  public product_type!: string | null;
  public status!: string | null;

  //associations
  public session!: Session | null;
  public product!: Product | null;
  public accessory!: Product | null;
  public gift!: Product | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
}

const hooks = {
  beforeValidate: (model: CartItem) => {
    model_utils.reference(model, { prefix: "notPrefix" });
  },
};

CartItem.init(
  {
    created_at: model_specs.timestamp(),
    updated_at: model_specs.timestamp(),
    deleted_at: model_specs.timestamp(),
    product_id: model_specs.foreign_key(true),
    reference: model_specs.reference(),
    session_id: model_specs.foreign_key(),
    parent_id: model_specs.foreign_key(),
    product_type: model_specs.generic_string(),
    status: model_specs.generic_string(),
  },
  {
    ...model_utils.model_defaults(CartItem.TABLENAME),
    hooks,
    sequelize,
  }
);

CartItem.crud = new CrudSpec();
// Session.crud.search = ["discount_ref_no"];

export default CartItem;
