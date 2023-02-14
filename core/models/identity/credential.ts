import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import { BuildOptions } from "sequelize";
import Account from "./account";

const sequelize = Datasource.source("default-db");
class Credential extends CrudModel {
  static TABLENAME = "credential";
  static Types = {
    password: "password",
    programmatic: "programmatic",
  };


  constructor(values?: any, options?: BuildOptions) {
    super(values, options)
  }


  public account_id!: number | null;

  public reference!: string | null;
  public type!: string | null;
  public access_handle!: string | null;
  public secret!: string | null;

  public last_changed_at!: Date | null;

  // associations
  public account!: Account | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
  beforeValidate: ((model: Credential) => {
    model_utils.reference(model, { prefix: "cred" });
  }),
};

Credential.init({
  account_id: model_specs.foreign_key(true),

  reference: model_specs.reference(),

  type: model_specs.enum(Credential.Types),

  access_handle: model_specs.generic_string(true),
  secret: model_specs.generic_string(true),

  last_changed_at: model_specs.timestamp(),
}, {
  ...model_utils.model_defaults(Credential.TABLENAME),
  hooks, sequelize,
});

Credential.crud = new CrudSpec();

export default Credential;