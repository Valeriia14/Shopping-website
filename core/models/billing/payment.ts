import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import Order from "./order";

const sequelize = Datasource.source("default-db");

class Payment extends CrudModel {
  static TABLENAME = "payment";
  static STATUS = {
    processing: "processing",
    success: "success",
    failed: "failed",
    refunded: "refunded",
    partial_refunded: "partial-refunded",
  } as const;
  
  static TYPES = {
    main: 'main',
    additional: 'additional'
  } as const;
  
  public order_id!: number | null;

  public status!: string | null;
  public transaction_type!: string | null;
  public transaction_amt!: number | null;
  // public refund_amount!: number | null;

  public description!: string | null;
  public payment_method!: string | null;
  public charge_id!: string | null;
  
  public date!: Date | null;

  // associations
  public order!: Order | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
  beforeValidate: ((model: Payment) => {
    model_utils.reference(model, { prefix: "pymt" });
  }),
};

Payment.init({
  order_id: model_specs.foreign_key(),

  status: model_specs.generic_string(),
  transaction_type: model_specs.generic_string(),

  transaction_amt: model_specs.number(),
  // refund_amount: model_specs.number(),

  description: model_specs.generic_string(),
  payment_method: model_specs.generic_string(),
  charge_id: model_specs.generic_string(),

  date: model_specs.timestamp(),
}, {
  ...model_utils.model_defaults(Payment.TABLENAME),
  hooks, sequelize,
});

Payment.crud = new CrudSpec();

export default Payment;
