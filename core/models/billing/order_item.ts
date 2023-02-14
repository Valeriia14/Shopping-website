import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import OrderStatus from "@ktwebsite/components/OrderSummary/OrderStatus";
import { Order } from ".";
import CrudModel, { CrudSpec } from "../crud_model";
import { Product } from "../product";

const sequelize = Datasource.source("default-db");

class OrderItem extends CrudModel {
  static TABLENAME = "order_item";
  
  static STATUS = {
    open: "open",
    unprocessed: "unprocessed",
    processed: "processed",
    shipped: "shipped",
    void: "void",
    completed: "completed",
    cancelled: "cancelled",
    request_refund: "request-refund",
    refunded: "refunded",
    exchange_in: "exchange-in",
    exchanged_in: "exchanged-in",
    exchange_out: "exchange-out",
    exchanged_out: "exchanged-out"
  } as const;

  static non_billable_status = [
    OrderItem.STATUS.refunded,
    OrderItem.STATUS.exchange_out,
    OrderItem.STATUS.exchanged_out,
    OrderItem.STATUS.cancelled,
    OrderItem.STATUS.void,
    OrderItem.STATUS.open,
    null
  ]

  static final_status = [
    OrderItem.STATUS.exchange_in,
    OrderItem.STATUS.exchange_out,
    OrderItem.STATUS.exchanged_in,
    OrderItem.STATUS.exchanged_out
  ]

  static PRODUCT_TYPE = {
    product: "product",
    accessory: "accessory",
    gift: "gift",
  } as const;

  public order_id!: number;
  public product_id!: number;
  public product_type!: string | null;
  public parent_id!: number | null;

  public reference!: string | null;

  public name!: string | null;
  public sku!: string | null;
  public upc!: string | null;

  public quantity!: number | null;
  public unit_price!: number | null;
  public discount_value!: number | null;
  public discount_type!: string | null;
  public subtotal!: number | null;
  public status!: string | null;
  public refund_reason!: string | null;
  public discounted_amt!: number | null;

  //associations
  public order!: Order | null;
  public product!: Product | null;
  public accessory!: Product | null;
  public gift!: Product | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
  beforeValidate: ((model: OrderItem) => {
    model_utils.reference(model, { prefix: "ortm" });
  }),
};

OrderItem.init({
  order_id: model_specs.foreign_key(true),
  product_id: model_specs.foreign_key(true),
  product_type: model_specs.generic_string(),
  parent_id: model_specs.foreign_key(false),

  reference: model_specs.reference(),

  name: model_specs.generic_string(),
  sku: model_specs.generic_string(),
  upc: model_specs.generic_string(),

  quantity: model_specs.number(),

  unit_price: model_specs.decimal(),
  discount_value: model_specs.decimal(),
  discount_type: model_specs.generic_string(),
  subtotal: model_specs.decimal(),
  status: model_specs.generic_string(),
  refund_reason: model_specs.text(),
  discounted_amt: model_specs.decimal()
}, {
  ...model_utils.model_defaults(OrderItem.TABLENAME), defaultScope: {
    attributes: {
      include: ["updated_at"],
    },
  },
  hooks, sequelize,
});

OrderItem.crud = new CrudSpec();
OrderItem.crud.search = ["name"];

export default OrderItem;