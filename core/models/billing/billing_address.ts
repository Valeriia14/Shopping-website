import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");

class BillingAddress extends CrudModel {
  static TABLENAME = "billing_address";
  static TYPE = {
    residential: "residential",
    office: "office",
  } as const;

  public street_address!: string | null;
  public unit_no!: string | null;
  public country!: string | null;
  public city!: string | null;
  public postal_code!: string | null;
  public firstname!: string | null;
  public lastname!: string | null;
  public contact_number!: string | null;
  public account_id!: number | null;
  public type!: string | null;
  public office_department!: string | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
}

const hooks = {
  beforeValidate: (model: BillingAddress) => {
    model_utils.reference(model, { prefix: "adr" });
  },
};

BillingAddress.init(
  {
    street_address: model_specs.generic_string(),
    unit_no: model_specs.generic_string(),
    country: model_specs.generic_string(),
    city: model_specs.generic_string(),
    postal_code: model_specs.generic_string(),
    firstname: model_specs.generic_string(),
    lastname: model_specs.generic_string(),
    contact_number: model_specs.generic_string(),
    account_id: model_specs.foreign_key(),
    type: model_specs.generic_string(),
    office_department: model_specs.generic_string(),
  },
  {
    ...model_utils.model_defaults(BillingAddress.TABLENAME),
    hooks,
    sequelize,
  }
);

BillingAddress.crud = new CrudSpec();
BillingAddress.crud.create = [
  "street_address",
  "unit_no",
  "country",
  "city",
  "postal_code",
  "firstname",
  "lastname",
  "contact_number",
  "account_id",
  "type",
  "office_department",
];
BillingAddress.crud.update = [
  "street_address",
  "unit_no",
  "country",
  "city",
  "postal_code",
  "firstname",
  "lastname",
  "contact_number",
  "account_id",
  "type",
  "office_department",
];
BillingAddress.crud.validators = {
  create: [
    validator.trim([
      "street_address",
      "unit_no",
      "country",
      "city",
      "postal_code",
      "firstname",
      "lastname",
      "contact_number",
      "account_id",
      "type",
      "office_department",
    ]),
  ],
  update: [
    validator.trim([
      "street_address",
      "unit_no",
      "country",
      "city",
      "postal_code",
      "firstname",
      "lastname",
      "contact_number",
      "account_id",
      "type",
      "office_department",
    ]),
  ],
};

export default BillingAddress;
