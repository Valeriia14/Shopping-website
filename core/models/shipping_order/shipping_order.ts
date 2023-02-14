import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
const sequelize = Datasource.source("default-db");

class ShippingOrder extends CrudModel {
  static TABLENAME = "shipping_orders";

  public account_id!: number | null;
  public order_id!: number | null;
  public customer_name!: string | null;
  public phone_number!: string | null;
  public sender_address !: string | null;
  public sender_postal !: string | null;
  public delivery_address !: string | null;
  public delivery_postal !: string | null;

  public weight !: number | null;
  public width !: number | null;
  public length !: number | null;
  public height !: number | null;

  public collection_date !: Date | null;

  public shipping_order_no !: string | null;
  public awb_no !: string | null;

  public delivery_cost !: number | null;
  public delivery_price !: number | null;

  public status !: string | null;
  public log_status !: number | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

ShippingOrder.init({
  account_id: model_specs.foreign_key(),
  order_id: model_specs.foreign_key(),
  customer_name: model_specs.generic_string(),
  phone_number: model_specs.generic_string(),
  sender_address: model_specs.generic_string(),
  sender_postal: model_specs.generic_string(),
  delivery_address: model_specs.generic_string(),
  delivery_postal: model_specs.generic_string(),
  weight: model_specs.decimal(),
  width: model_specs.decimal(),
  length: model_specs.decimal(),
  height: model_specs.decimal(),
  collection_date: model_specs.timestamp(),
  shipping_order_no: model_specs.generic_string(),
  awb_no: model_specs.generic_string(),
  delivery_cost: model_specs.decimal(),
  delivery_price: model_specs.decimal(),
  status: model_specs.generic_string(),
  log_status: model_specs.decimal(),
}, {
  ...model_utils.model_defaults(ShippingOrder.TABLENAME),
  hooks, sequelize,
});

ShippingOrder.crud = new CrudSpec();

export default ShippingOrder;
