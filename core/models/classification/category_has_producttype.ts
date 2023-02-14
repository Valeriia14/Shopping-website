import Datasource from "@kidztime/models/datasource";
import { model_specs } from "@kidztime/utilities";
import { Model } from "sequelize";

const sequelize = Datasource.source("default-db");
class CategoryProductType extends Model {
  static TABLENAME = "category_has_producttype";

  public category_id!: number;
  public product_type_id!: number;

  toJSON(): object {
    var values: any = Object.assign({}, this.get());
    return values;
  }
};

CategoryProductType.init({
  category_id: model_specs.foreign_key(true),
  product_type_id: model_specs.foreign_key(true),
}, {
  tableName: CategoryProductType.TABLENAME,
  modelName: CategoryProductType.TABLENAME,
  freezeTableName: true,
  timestamps: false,
  sequelize,
});

export default CategoryProductType;
