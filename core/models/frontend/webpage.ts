import { QueryConfig } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import WebpageItem from "./webpage_item";

const sequelize = Datasource.source("default-db");
class Webpage extends CrudModel {
  static TABLENAME = "webpage";
  static Status = {
    Draft: "draft",
    Published: "published",
    Archived: "archived",
  } as const;
  static Type = {
    Category: "category",
    Character: "character",
    ProductType: "product_type",
  }
  public title!: string | null;
  public description!: string | null;
  public path!: string | null;
  public type!: string | null;

  public webpage_items!: WebpageItem[] | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());

    if (values.webpage_items)
      values.items = values.webpage_items;
    delete values.webpage_items;

    return values;
  }
};

const hooks = {
  beforeValidate: ((model: Webpage) => {
  }),
};

Webpage.init({
  title: model_specs.generic_string(),
  type: model_specs.enum(Webpage.Type),
  description: model_specs.generic_string(),
  path: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(Webpage.TABLENAME),
  hooks, sequelize,
});

Webpage.crud = new CrudSpec();
Webpage.crud.search = ["path", "title", "description"];
Webpage.crud.create = ["path", "title", "description" ,"type"];
Webpage.crud.update = ["path", "title", "description" , "type"];
Webpage.crud.validators = {
  create: [
    validator.required(["path"], { trim: true }),
    validator.trim(["description", "title"], { clean: true }),
  ],
  update: [
    validator.required(["path"], { trim: true }),
    validator.trim(["description", "title"], { clean: true }),
  ],
};
Webpage.crud.filter.account = (config: QueryConfig) => {
  Webpage.crud.filter.default(config);
};
Webpage.crud.filter.admin = (config: QueryConfig) => {
  Webpage.crud.filter.account(config);
};

export default Webpage;
