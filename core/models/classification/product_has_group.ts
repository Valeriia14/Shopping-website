import Datasource from "@kidztime/models/datasource";
import { model_specs } from "@kidztime/utilities";
import { Model } from "sequelize";
import { Group } from ".";
import { Product } from "../product";

const sequelize = Datasource.source("default-db");

class ProductGroup extends Model {
  static TABLENAME = "product_has_group";

  public product_id!: number;
  public group_id!: number;

  //associations
  public group!: Group;
  public product!: Product;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

ProductGroup.init({
  group_id: model_specs.foreign_key(true),
  product_id: model_specs.foreign_key(true),
}, {
  tableName: ProductGroup.TABLENAME,
  modelName: ProductGroup.TABLENAME,
  freezeTableName: true,
  timestamps: false,
  sequelize,
});

export default ProductGroup;
