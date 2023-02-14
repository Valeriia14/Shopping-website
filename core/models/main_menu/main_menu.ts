import CrudModel from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");

class MainMenu extends CrudModel {
  static TABLENAME = "main_menu";
  
  public customer_segment!: string | null;
  public customer_segment_dtl!: string | null;
 
  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
 
};

MainMenu.init({
  customer_segment: model_specs.foreign_key(),
  customer_segment_dtl: model_specs.foreign_key(),
}, {
  tableName: MainMenu.TABLENAME,
  modelName: MainMenu.TABLENAME,
  freezeTableName: true,
  timestamps: false,
  sequelize,
});
MainMenu.removeAttribute("id")


export default MainMenu;
