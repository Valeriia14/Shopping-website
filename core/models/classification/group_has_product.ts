import Datasource from "@kidztime/models/datasource";
import { model_specs } from "@kidztime/utilities";
import { Model } from "sequelize";
import { Group } from ".";
import { Product } from "../product";

const sequelize = Datasource.source("default-db");

class GroupProduct extends Model {
  static TABLENAME = "group_has_product";

  public group_id!: number;
  public product_id!: number;

  //association
  public product!: Product;
  public group!: Group;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

GroupProduct.init({
  group_id: model_specs.foreign_key(true),
  product_id: model_specs.foreign_key(true),
}, {
  tableName: GroupProduct.TABLENAME,
  modelName: GroupProduct.TABLENAME,
  freezeTableName: true,
  timestamps: false,
  sequelize,
});

export default GroupProduct;
