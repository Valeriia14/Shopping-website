import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
const sequelize = Datasource.source("default-db");

class Inventory extends CrudModel {
  static TABLENAME = "inventory";

  public name!: string | null;
  public description!: string | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

Inventory.init({
  name: model_specs.generic_string(),
  description: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(Inventory.TABLENAME),
  hooks, sequelize,
});

Inventory.crud = new CrudSpec();
Inventory.crud.search = ["name"];
Inventory.crud.create = ["name", "description"];
Inventory.crud.update = ["name", "description"];
Inventory.crud.validators = {
  create: [
    validator.required("name"),
    validator.trim("description"),
  ],
  update: [
    validator.trim(["name", "description"])
  ],
};

export default Inventory;
