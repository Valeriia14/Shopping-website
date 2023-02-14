import { Webpage } from '@kidztime/models';
import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");

class Category extends CrudModel {
  static TABLENAME = "category";
  static TYPE = {
    character: "character",
    product_type: "product_type",
    category: "category",
  } as const;

  public type!: string | null;
  public name!: string | null;
  public description!: string | null;
  public handle!: string | null;
  public published!: boolean | null;
  public published_at!: Date | null;
  public webpage_id!: number | null; 
  public meta_keywords!: string | null;
  public meta_title!: string | null;
  public extras!: string | null;

  // associations
  public webpage!: Webpage | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());

    if (values.assets)
      values.image = values.assets[0]?.uri;
    return values;
  }
};

const hooks = {
  afterUpdate: async (model: Category, options: any) =>{
    if(!model.webpage_id){
      const webpage = await Webpage.create({
        status: Webpage.Status.Draft
      }, options)
      if(webpage){
        model.update({
          webpage_id: webpage.id
        })
      }
    }
  },
};

Category.init({
  type: model_specs.generic_string(),
  name: model_specs.generic_string(),
  description: model_specs.text(),
  published: model_specs.boolean(),
  published_at: model_specs.timestamp(),
  webpage_id: model_specs.foreign_key(),
  handle: model_specs.generic_string(),
  meta_keywords: model_specs.generic_string(),
  meta_title: model_specs.generic_string(),
  extras: model_specs.text(),
}, {
  ...model_utils.model_defaults(Category.TABLENAME),
  defaultScope: {
      attributes: {
        exclude: ["created_at", "deleted_at"],
      },
    },
  hooks, sequelize,
});

Category.crud = new CrudSpec();
Category.crud.search = ["name", "type", "published"];
Category.crud.create = ["type", "name", "description", "handle", "meta_keywords", "meta_title", "extras"];
Category.crud.update = ["type", "name", "description", "handle", "meta_keywords", "meta_title", "extras", "published", "published_at"];
Category.crud.validators = {
  create: [
    validator.enumtype("type", Object.values(Category.TYPE)),
    validator.required("name"),
    validator.trim(["description", "handle", "meta_keywords", "meta_title", "extras"]),
  ],
  update: [
    validator.enumtype("type", Object.values(Category.TYPE)),
    validator.required("name"),
    validator.trim(["description", "handle", "meta_keywords", "meta_title", "extras"]),
  ],
};
Category.crud.filter.admin = (config: QueryConfig) => {
  Category.crud.filter.default(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "type")
  QueryOptions.query_column(config, "published");
};

export default Category;
