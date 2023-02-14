import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import Account from "../identity/account";

const sequelize = Datasource.source("default-db");

class VerifyRequest extends CrudModel {
  static TABLENAME = "verify_request";

  static Status = {
    Open: "open",
    Processing: "processing",
    Completed: "completed",
  } as const;
  static Type = {
    Email: "email",
    Invite: "invite",
  } as const;
  static Result = {
    Verified: "verified",
  } as const;

  public account_id!: number | null;

  public reference!: string | null;
  public type!: string | null;

  public open_at!: Date | null;
  public submit_at!: Date | null;
  public resolve_at!: Date | null;
  public expire_at!: Date | null;

  public status!: string | null;
  public value!: string | null;
  public token!: string | null;
  public code!: string | null;
  public result!: string | null;

  // associations
  public account!: Account | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
  beforeValidate: ((model: VerifyRequest) => {
    model_utils.reference(model, { prefix: "vrfy" });
  }),
};

VerifyRequest.init({
  account_id: model_specs.foreign_key(true),

  reference: model_specs.reference(),
  type: model_specs.enum(VerifyRequest.Type, true),

  open_at: model_specs.timestamp(),
  submit_at: model_specs.timestamp(),
  resolve_at: model_specs.timestamp(),
  expire_at: model_specs.timestamp(),

  status: model_specs.enum(VerifyRequest.Status, true),
  value: model_specs.generic_string(),
  token: model_specs.generic_string(),
  code: model_specs.generic_string(),
  result: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(VerifyRequest.TABLENAME),
  hooks, sequelize,
});

VerifyRequest.crud = new CrudSpec();
VerifyRequest.crud.filter.account = (config: QueryConfig) => {
  VerifyRequest.crud.filter.default(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "status");

  if (query.date) {
    const [first_date, last_date] = query.date.split(",");
    options.filter_date({ first_date, last_date });
  }
};

export default VerifyRequest;