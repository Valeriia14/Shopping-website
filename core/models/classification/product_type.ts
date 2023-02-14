import { Webpage } from '@kidztime/models';
import { QueryConfig, QueryOptions } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");

class ProductType extends CrudModel {
  static TABLENAME = "product_type";
  static TYPE = "product_type";

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
  public min_age!: number | null;
  public max_age!: number | null;
  public category_id!: number | null;
  public item_class!: number | null;
  public customer_segment!: string | null;
  public customer_segment_dtl!: string | null;
  public description_dtl!: string | null;
  public ifpersonalised!: number | null;

  // associations
  public webpage!: Webpage | null;

  toJSON(): object {
    var values: any = Object.assign({}, this.get());

    if (values.assets)
      values.image = values.assets[0]?.uri;
    return values;
  }
};

const hooks = {
  afterUpdate: async (model: ProductType, options: any) =>{
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

ProductType.init({
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
  min_age: model_specs.number(),
  max_age: model_specs.number(),
  category_id: model_specs.number(),
  item_class: model_specs.number(),
  customer_segment: model_specs.text(),
  customer_segment_dtl: model_specs.text(),
  description_dtl: model_specs.text(),
  ifpersonalised: model_specs.number()
}, {
  ...model_utils.model_defaults(ProductType.TABLENAME),
  defaultScope: {
      attributes: {
        exclude: ["created_at", "deleted_at"],
      },
    },
  hooks, sequelize,
});

ProductType.crud = new CrudSpec();
ProductType.crud.search = ["name", "type", "published"];
ProductType.crud.create = ["type", "name", "description", "handle", "meta_keywords", "meta_title", "extras"];
ProductType.crud.update = [
  "type",
  "name",
  "description",
  "handle",
  "meta_keywords",
  "meta_title",
  "extras",
  "published",
  "published_at",
  "min_age",
  "max_age",
];
ProductType.crud.validators = {
  create: [
    validator.required("name"),
    validator.trim(["description", "handle", "meta_keywords", "meta_title", "extras"]),
  ],
  update: [
    validator.required("name"),
    validator.trim(["description", "handle", "meta_keywords", "meta_title", "extras"]),
  ],
};
ProductType.crud.filter.admin = (config: QueryConfig) => {
  ProductType.crud.filter.default(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "type")
  QueryOptions.query_column(config, "published");
};

export default ProductType;
