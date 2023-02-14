import { Moment } from "moment";
import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import { GroupProduct } from ".";

const sequelize = Datasource.source("default-db");

class Group extends CrudModel {
  static TABLENAME = "group";
  static TYPE = {
    accessory: "accessory",
    gift: "gift",
    discount: "discount",
  } as const;

  static DISCOUNT_TYPE = {
    percent: "percent",
    amount: "amount",
  } as const;

  public type!: string | null;
  public description!: string | null;
  public name!: string | null;
  public handle!: string | null;
  public discount_value!: number;
  public discount_type!: string;
  public start_at!: Moment | null;
  public end_at!: Moment | null;
  public published!: boolean;
  public home_feature_id!: number | null;
  // associations
  public products_of_group!: GroupProduct[];

  toJSON(): object {
    const values: any = Object.assign({}, this.get());

    if (values.products_of_group) {
      values.products = values.products_of_group.map((item: GroupProduct) => item.product);
    }
    delete values.products_of_group;

    return values;
  }
};

const hooks = {};

Group.init({
  type: model_specs.generic_string(),
  name: model_specs.generic_string(),
  description: model_specs.text(),
  handle: model_specs.generic_string(),
  discount_value: model_specs.number(),
  discount_type: model_specs.generic_string(),
  start_at: model_specs.timestamp(),
  end_at: model_specs.timestamp(),
  published: model_specs.boolean(true, false),
  home_feature_id: model_specs.number(),
}, {
  ...model_utils.model_defaults(Group.TABLENAME),
  hooks, sequelize,
});

Group.crud = new CrudSpec();
Group.crud.search = ["description", "type", "name", "handle", "published"];
Group.crud.create = ["type", "name", "description", "handle", "discount_value", "discount_type", "start_at", "end_at", "published"];
Group.crud.update = ["type", "name", "description", "handle", "discount_value", "discount_type", "start_at", "end_at", "published"];
Group.crud.validators = {
  create: [
    validator.enumtype("type", Object.values(Group.TYPE)),
    validator.enumtype("discount_type", Object.values(Group.DISCOUNT_TYPE)),
    validator.required(["name", "type"]),
    validator.trim(["description", "handle"]),
  ],
  update: [
    validator.enumtype("type", Object.values(Group.TYPE)),
    validator.enumtype("discount_type", Object.values(Group.DISCOUNT_TYPE)),
    validator.required("name"),
    validator.trim(["description", "handle"]),
  ],
};
Group.crud.filter.admin = (config: QueryConfig) => {
  Group.crud.filter.default(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "type");
  QueryOptions.query_column(config, "published");
  QueryOptions.query_column(config, "name");
  
  if (query.start_at) {
    const [first_date, last_date] = query.start_at.split(",");
    options.filter_date({ first_date, last_date }, "start_at");
  }
  if (query.end_at) {
    const [first_date, last_date] = query.end_at.split(",");
    options.filter_date({ first_date, last_date }, "end_at");
  }
};

export default Group;
