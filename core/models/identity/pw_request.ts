import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import Credential from "./credential";

const sequelize = Datasource.source("default-db");
class PasswordRequest extends CrudModel {
  static TABLENAME = "pw_request";
  static Types = {
    TokenLink: "token_link",
  };

  public credential_id!: number | null;

  public ip_request!: string | null;
  public ip_reset!: string | null;
  public ip_last_attempt!: string | null;

  public reset_attempts!: number | null;

  public reset_at!: Date | null;
  public expired_at!: Date | null;

  public type!: string | null;
  public code!: string | null;

  // associations
  public readonly credential?: Credential;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

PasswordRequest.init({
  credential_id: model_specs.foreign_key(true),

  ip_request: model_specs.generic_string(),
  ip_reset: model_specs.generic_string(),
  ip_last_attempt: model_specs.generic_string(),

  reset_attempts: model_specs.number(),

  reset_at: model_specs.timestamp(),
  expired_at: model_specs.timestamp(),

  type: model_specs.generic_string(),
  code: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(PasswordRequest.TABLENAME),
  hooks, sequelize,
});

PasswordRequest.crud = new CrudSpec();

export default PasswordRequest;
