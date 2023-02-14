import Datasource from "@kidztime/models/datasource";
import { model_specs } from "@kidztime/utilities";
import { Model } from "sequelize";

const sequelize = Datasource.source("default-db");
class CategoryProduct extends Model {
  static TABLENAME = "category_has_product";

  public category_id!: number;
  public product_id!: number;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

CategoryProduct.init({
  category_id: model_specs.foreign_key(true),
  product_id: model_specs.foreign_key(true),
}, {
  tableName: CategoryProduct.TABLENAME,
  modelName: CategoryProduct.TABLENAME,
  freezeTableName: true,
  timestamps: false,
  sequelize,
});

export default CategoryProduct;
