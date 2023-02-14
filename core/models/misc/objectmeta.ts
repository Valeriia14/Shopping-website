import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");

class ObjectMeta extends CrudModel {
  static TABLENAME = "objectmeta";
  static KEY = {
    metadata: "metadata",
    page_content: "page-content",
    banner: "banner",
    settings: "settings",
    page_image: "page-image",
  } as const;
  static AssetPreviewImage = "preview";

  public key!: string | null;
  public value!: string | null;
  public extra0!: string | null;
  public extra1!: string | null;
  public extra2!: string | null;
  public extra3!: string | null;
  public extra4!: string | null;
  public owner_type!: string | null;

  public owner_id!: number | null;

  // associations

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {};

ObjectMeta.init({
  key: model_specs.generic_string(),
  value: model_specs.generic_string(),
  extra0: model_specs.generic_string(),
  extra1: model_specs.generic_string(),
  extra2: model_specs.generic_string(),
  extra3: model_specs.generic_string(),
  extra4: model_specs.generic_string(),
  owner_type: model_specs.generic_string(),

  owner_id: model_specs.foreign_key(),
}, {
  ...model_utils.model_defaults(ObjectMeta.TABLENAME),
  hooks, sequelize,
});

ObjectMeta.crud = new CrudSpec();
ObjectMeta.crud.create = ["key", "value", "extra0", "extra1", "extra2", "extra3", "extra4", "owner_type", "owner_id"];
ObjectMeta.crud.update = ["key", "value", "extra0", "extra1", "extra2", "extra3", "extra4", "owner_type", "owner_id"];
ObjectMeta.crud.validators = {
  create: [
    validator.required(["owner_type", "owner_id"]),
  ],
  update: [
    validator.required(["owner_type", "owner_id"]),
  ],
};

export default ObjectMeta;
