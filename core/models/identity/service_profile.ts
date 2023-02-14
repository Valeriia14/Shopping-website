import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import Account from "./account";

const sequelize = Datasource.source("default-db");
class ServiceProfile extends CrudModel {
  static TABLENAME = "service_profile";
  static SERVICE = {
    facebook: "facebook",
    google: "google",
    stripe: "stripe",
    shopee: "shopee",
  } as const;

  public account_id!: number | null;

  public reference!: string | null;
  public service!: string | null;
  public secret!: string | null;
  public key!: string | null;
  public extra0!: string | null;
  public extra1!: string | null;
  public extra2!: string | null;
  public extra3!: string | null;
  public extra4!: string | null;

  // associations
  public account!: Account | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
  beforeValidate: ((model: ServiceProfile) => {
    model_utils.reference(model, { prefix: "svpf" });
  }),
};

ServiceProfile.init({
  account_id: model_specs.foreign_key(),

  reference: model_specs.generic_string(),
  service: model_specs.enum(ServiceProfile.SERVICE, true),
  secret: model_specs.generic_string(),
  key: model_specs.generic_string(),
  extra0: model_specs.generic_string(),
  extra1: model_specs.generic_string(),
  extra2: model_specs.generic_string(),
  extra3: model_specs.generic_string(),
  extra4: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(ServiceProfile.TABLENAME),
  hooks, sequelize,
});

ServiceProfile.crud = new CrudSpec();
ServiceProfile.crud.create = ["account_id", "service", "secret", "key", "extra0", "extra1", "extra2", "extra3", "extra4"];
ServiceProfile.crud.update = ["account_id", "service", "secret", "key", "extra0", "extra1", "extra2", "extra3", "extra4"];

export default ServiceProfile;
