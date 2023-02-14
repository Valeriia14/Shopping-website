import { Webpage } from '@kidztime/models';
import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import config from "@kidztime/config";

const sequelize = Datasource.source("default-db");

class Character extends CrudModel {
  static TABLENAME = "character";
  static TYPE = "character"

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
  public if_boy!: boolean | null;
  public if_girl!: boolean | null;

  // associations
  public webpage!: Webpage | null;

  toJSON(): object {
    var values: any = Object.assign({}, this.get());

    if (values.assets)
      values.image = config?.s3?.asset_host + values.assets[0]?.uri;
    return values;
  }
};

const hooks = {
  afterUpdate: async (model: Character, options: any) =>{
    if(!model.webpage_id){
      const webpage = await Webpage.create({
        status: Webpage.Status.Draft
      }, options)
      model.update({
        webpage_id: webpage!.id
      })
    }
  },
};

Character.init({
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
  if_boy: model_specs.boolean(),
  if_girl: model_specs.boolean(),
}, {
  ...model_utils.model_defaults(Character.TABLENAME),
  defaultScope: {
      attributes: {
        exclude: ["created_at", "deleted_at"],
      },
    },
  hooks, sequelize,
});

Character.crud = new CrudSpec();
Character.crud.search = ["name", "type", "published"];
Character.crud.create = ["type", "name", "description", "handle", "meta_keywords", "meta_title", "extras"];
Character.crud.update = [
  "type",
  "name",
  "description",
  "handle",
  "meta_keywords",
  "meta_title",
  "extras",
  "published",
  "published_at",
  "if_boy",
  "if_girl",
];
Character.crud.validators = {
  create: [
    validator.required("name"),
    validator.trim(["description", "handle", "meta_keywords", "meta_title", "extras"]),
  ],
  update: [
    validator.required("name"),
    validator.trim(["description", "handle", "meta_keywords", "meta_title", "extras"]),
  ],
};
Character.crud.filter.admin = (config: QueryConfig) => {
  Character.crud.filter.default(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "type")
  QueryOptions.query_column(config, "published");
};

export default Character;
