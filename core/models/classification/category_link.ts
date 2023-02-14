import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import { Category } from ".";

const sequelize = Datasource.source("default-db");

class CategoryLink extends CrudModel {
  static TABLENAME = "category_link";

  public parent_id!: number | null;
  public child_id!: number | null;

  public type!: string | null;

  // associations
  public parent!: Category | null;
  public child!: Category | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {};

CategoryLink.init({
  parent_id: model_specs.foreign_key(),
  child_id: model_specs.foreign_key(),

  type: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(CategoryLink.TABLENAME),
  hooks, sequelize,
});

CategoryLink.crud = new CrudSpec();
CategoryLink.crud.search = ["type"];
CategoryLink.crud.create = ["parent_id", "child_id", "type"];
CategoryLink.crud.update = ["parent_id", "child_id", "type"];
CategoryLink.crud.validators = {
  create: [
    validator.enumtype("type", Object.values(Category.TYPE)),
    validator.required(["parent_id", "child_id"]),
  ],
  update: [
    validator.enumtype("type", Object.values(Category.TYPE)),
    validator.required(["parent_id", "child_id"]),
  ],
};
CategoryLink.crud.filter.admin = (config: QueryConfig) => {
  CategoryLink.crud.filter.default(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "type");
};

export default CategoryLink;
