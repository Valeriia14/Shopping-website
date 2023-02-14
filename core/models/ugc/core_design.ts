import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import { QuestionAnswer } from '.';
import CrudModel, { CrudSpec } from "../crud_model";

const sequelize = Datasource.source("default-db");

class CoreDesign extends CrudModel {
  static TABLENAME = "core_design";
  
  
  public name!: string | null;
  
  //associations
  public qa!: QuestionAnswer | null;
  
  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

CoreDesign.init({
  name: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(CoreDesign.TABLENAME),
  defaultScope: {},
  sequelize,
});

CoreDesign.crud = new CrudSpec();
CoreDesign.crud.search = ["name"];
CoreDesign.crud.create = ["name"];
CoreDesign.crud.update = ["name"];
export default CoreDesign;