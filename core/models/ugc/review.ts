import { Account } from '@kidztime/models';
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import { ProductType } from "../classification";
import CrudModel, { CrudSpec } from "../crud_model";
import { Product } from "../product";

const sequelize = Datasource.source("default-db");

class Review extends CrudModel {
  static TABLENAME = "review";
  
  static STATUS = {
    published: "published",
    unpublished: "unpublished",
    canceled: "canceled"
  } as const;
  static AssetAssoc = {
    Main: 'main'
  }
  public product_id!: number;
  public account_id!: number;

  public score!: number | null;
  public comment!: string | null;

  public reply!: string | null;
  public status!: string | null;
  
  public helpful!: number | 0;
  public dislike!: number | 0;
  //associations
  public product!: Product | null;
  public account!: Account | null;
  public product_type!: ProductType | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

Review.init({
  product_id: model_specs.foreign_key(true),
  account_id: model_specs.foreign_key(false),
  score: model_specs.number(),
  comment: model_specs.generic_string(),
  reply: model_specs.generic_string(),
  status: model_specs.generic_string(),
  helpful: model_specs.number(false, 0),
  dislike: model_specs.number(false, 0)
}, {
  ...model_utils.model_defaults(Review.TABLENAME),
  defaultScope: {},
  sequelize,
});

Review.crud = new CrudSpec();
Review.crud.search = ["score", "comment", "reply", "status"];
Review.crud.create = ["score", "comment", "reply", "status"];
Review.crud.update = ["score", "comment", "reply", "status"];
export default Review;