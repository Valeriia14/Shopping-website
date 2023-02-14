import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");

class ProductInfo extends CrudModel {
  static TABLENAME = "product_info";

  public product_type_id!: number | null;

  public description!: string | null;
  public component_type!: string | null;
  public sub_component_desc!: string | null;
  public sub_component_img!: string | null;
  public sub_component_link!: string | null;

  static ComponentType = {
    MaterialIngredientCare: "material_ingredient_care",
    Features:"features",
    Certificate:'certificate'
  } as const;
  // associations

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

ProductInfo.init({
  product_type_id: model_specs.number(),

  description: model_specs.text(),
  component_type: model_specs.text(),
  sub_component_desc:model_specs.text(),
  sub_component_img:model_specs.text(),
  sub_component_link:model_specs.text(),

}, {
  ...model_utils.model_defaults(ProductInfo.TABLENAME),
  hooks, sequelize,
});

ProductInfo.crud = new CrudSpec();
ProductInfo.crud.create = ["product_type_id", "description"];
ProductInfo.crud.update = ["product_type_id", "description"];
ProductInfo.crud.validators = {
  create: [
    validator.required("product_type_id"),
    validator.trim("description"),
  ],
  update: [
    validator.required("product_type_id"),
    validator.trim("description"),
  ],
};

export default ProductInfo;