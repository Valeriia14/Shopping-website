import { QueryConfig } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");
class Privilege extends CrudModel {
  static TABLENAME = "privilege";
  static Types = {
    role: "role",
  };
  static Domain = {
    Account: "account",
    Admin: "admin",
  };

  public name!: string | null;
  public label!: string | null;
  public description!: string | null;
  public manageable!: boolean;
  public type!: string | null;
  public domain!: string | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

Privilege.init({
  name: model_specs.generic_string(true),
  label: model_specs.generic_string(),
  description: model_specs.generic_string(true),

  manageable: model_specs.boolean(true, false),

  type: model_specs.enum(Privilege.Types),
  domain: model_specs.enum(Privilege.Domain),
}, {
  ...model_utils.model_defaults(Privilege.TABLENAME),
  sequelize,
});

Privilege.crud = new CrudSpec();

Privilege.crud.filter.default = (config: QueryConfig) => {
  config.options.add_order("id", "asc");
};

export default Privilege;