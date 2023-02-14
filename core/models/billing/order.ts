import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import { Moment } from "moment";
import { Payment } from ".";
import { Account } from "../identity";
import OrderItem from "./order_item";
import { Voucher } from "../voucher"
import { RewardPoint } from "../reward_point"

const sequelize = Datasource.source("default-db");

class Order extends CrudModel {
  static TABLENAME = "order";
  static STATUS = {
    open: "open",
    unprocessed: "unprocessed",
    processed: "processed",
    shipped: "shipped",
    completed: "completed",
    cancelled: "cancelled",
    void: "void",
    request_partial_refund: "request-partial-refund",
    request_refund: "request-refund",
    partial_refunded: "partial-refunded",
    refunded: "refunded",
    pendingExchange: 'pending-exchange'
  } as const;
  static PAYMENT_METHOD = {
    stripe: "stripe",
  } as const;
  static NoteAssoc = {
    adminNote: "admin-note",
    customerNote: "customer-note",
  } as const;

  public account_id!: number | null;

  public reference!: string | null;


  public currency!: string | null;

  public total_sales!: number | null;
  public shipping_address!: string | null;
  public customer_name!: string | null;
  public customer_email!: string | null;
  public shipping_postal!: string | null;
  public phone_number!: string | null;
  public total_discount!: number | null;
  public total_payment!: number | null;
  public tracking_id!: string | null;

  public total_shipping!: number | null;
  public status!: string | null;

  // associations
  public account!: Account | null;
  public payments!: Payment[] | null;
  public order_items!: OrderItem[] | null;
  public net_sales!: number | null;
  public billing_address!: string | null;
  public billing_postal!: string | null;
  public voucher!: Voucher | null;
  public reward_point!: RewardPoint | null;
  
  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
  beforeValidate: ((model: Order) => {
    model_utils.reference(model, { prefix: "ordr" });
  }),
};

Order.init({
  account_id: model_specs.foreign_key(),
  

  reference: model_specs.reference(),


  currency: model_specs.generic_string(),

  total_sales: model_specs.decimal(),
  shipping_address: model_specs.generic_string(),
  billing_postal: model_specs.generic_string(),
  billing_address: model_specs.generic_string(),
  customer_name: model_specs.generic_string(),
  customer_email: model_specs.generic_string(),
  shipping_postal: model_specs.generic_string(),
  phone_number: model_specs.generic_string(),
  total_discount: model_specs.decimal(),
  total_payment: model_specs.decimal(),

  total_shipping: model_specs.decimal(),
  status: model_specs.generic_string(),
  tracking_id: model_specs.generic_string(),
  net_sales: model_specs.decimal(),
}, {
  ...model_utils.model_defaults(Order.TABLENAME), 
  defaultScope: {
    attributes: {
      include: ["created_at"],
    },
  },
  hooks, sequelize,
});

Order.crud = new CrudSpec();
Order.crud.search = ["reference", "$payment.charge_id$", "$account.firstname$", "$account.lastname$"];
Order.crud.create = [];

Order.crud.update = ["currency", "total_sales", "discount", "total_discount", "total_payment", 
                      "total_shipping", "status", "customer_email", "customer_name", "shipping_postal", "phone_number",
                      "tracking_id", "shipping_address",'net_sales','billing_address','billing_postal'
                    ];

Order.crud.validators = {
  create: [],
  update: [
    validator.enumtype("status", Object.values(Order.STATUS)),
  ],
};
Order.crud.filter.account = (config: QueryConfig) => {
  Order.crud.filter.default(config);

  QueryOptions.query_column(config, "status");
};
Order.crud.filter.admin = (config: QueryConfig) => {
  Order.crud.filter.account(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "reference");
  QueryOptions.query_column(config, "status");
  if (query.created_at) {
    const [first_date, last_date] = query.created_at.split(",");
    options.filter_date({ first_date, last_date }, "created_at");
  }
};

export default Order;
