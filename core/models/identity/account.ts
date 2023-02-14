import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import { BuildOptions } from 'sequelize';

const sequelize = Datasource.source("default-db");

class Account extends CrudModel {
  static TABLENAME = "account";

  public reference!: string | null;
  public firstname!: string | null;
  public lastname!: string | null;
  public email_address!: string | null;
  public phone_number!: string | null;

  public last_seen_at!: Date | null;
  public last_logged_in!: Date | null;
  public last_order_at!: Date | null;

  public google_id!: string | null;
  public facebook_id!: string | null;
  
  public date_of_birth! : string | null;
  public shipping_default_id!: number | null;
  public billing_default_id!: number | null;
  public payment_method_default_id!: number | null;
  
  constructor(values?: any, options?: BuildOptions) {
    super(values, options)
  }

  // associations

  toJSON(): object {
    const values: any = Object.assign({}, this.get());

    if (values.roles)
      values.roles = values.roles.map((privilege: any) => privilege.name);

    return values;
  }
};

const hooks = {
  beforeValidate: ((model: Account) => {
    model_utils.reference(model, { prefix: "acct" });
  })
};

Account.init({
  reference: model_specs.reference(),

  firstname: model_specs.generic_string(),
  lastname: model_specs.generic_string(),
  email_address: model_specs.generic_string(),
  phone_number: model_specs.generic_string(),

  last_seen_at: model_specs.timestamp(),
  last_logged_in: model_specs.timestamp(),
  last_order_at: model_specs.timestamp(),

  google_id: model_specs.generic_string(),
  facebook_id: model_specs.generic_string(),
  date_of_birth: model_specs.generic_string(),
  shipping_default_id: model_specs.foreign_key(),
  billing_default_id: model_specs.foreign_key(),
  payment_method_default_id: model_specs.foreign_key(),
}, {
  ...model_utils.model_defaults(Account.TABLENAME),
  hooks, sequelize,
});

Account.crud = new CrudSpec();
Account.crud.search = ["firstname", "lastname"];
Account.crud.create = ["firstname", "lastname", "email_address","phone_number","google_id","facebook_id","date_of_birth","shipping_default_id", "billing_default_id", "payment_method_default_id"];
Account.crud.update = ["firstname", "lastname", "email_address","phone_number","google_id","facebook_id","date_of_birth","shipping_default_id", "billing_default_id", "payment_method_default_id"];
Account.crud.validators = {
  create: [
    validator.required("firstname"),
    validator.trim(["lastname", "phone_number", "google_id","facebook_id","date_of_birth","shipping_default_id", "billing_default_id", "payment_method_default_id"]),
    validator.trim(["email_address"], { lowercase: true }),
  ],
  update: [
    validator.required("firstname"),
    validator.trim(["lastname", "phone_number", "google_id","facebook_id","date_of_birth","shipping_default_id", "billing_default_id", "payment_method_default_id"]),
    validator.trim(["email_address"], { lowercase: true }),
  ],
};

export default Account;