import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
const sequelize = Datasource.source("default-db");

class Voucher extends CrudModel {
  static TABLENAME = "vouchers";

  public account_id!: number | null;
  public order_id!: number | null;
  public name!: string | null;
  public description!: string | null;
  public voucher_type!: string | null;
  public voucher_value!: string | null;
  public expiry_date!: Date | null;
  public discount_ref_no!: string | null;
  public log_status!: string | null;



  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

Voucher.init({
  account_id: model_specs.foreign_key(),
  order_id: model_specs.foreign_key(),
  name : model_specs.generic_string(),
  description: model_specs.generic_string(),
  voucher_type: model_specs.generic_string(),
  voucher_value: model_specs.decimal(),
  expiry_date: model_specs.timestamp(),
  discount_ref_no: model_specs.generic_string(),
  log_status: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(Voucher.TABLENAME),
  hooks, sequelize,
});

Voucher.crud = new CrudSpec();
Voucher.crud.search = ["name"];
// Voucher.crud.create = ["name", "description"];
// Voucher.crud.update = ["name", "description"];
// Voucher.crud.validators = {
//   create: [
//     validator.required("name"),
//     validator.trim("description"),
//   ],
//   update: [
//     validator.trim(["name", "description"])
//   ],
// };

export default Voucher;
