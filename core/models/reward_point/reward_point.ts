import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
const sequelize = Datasource.source("default-db");

class RewardPoint extends CrudModel {
  static TABLENAME = "reward_points";

  public account_id!: number | null;
  public order_id!: number | null;

  public description!: string | null;
  public transaction_pts!: number | null;
  public transaction_value!: number | null;
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

RewardPoint.init({
  account_id: model_specs.foreign_key(),
  order_id: model_specs.foreign_key(),
  description: model_specs.generic_string(),
  transaction_pts: model_specs.decimal(),
  transaction_value: model_specs.decimal(),
  expiry_date: model_specs.timestamp(),
  discount_ref_no: model_specs.generic_string(),
  log_status: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(RewardPoint.TABLENAME),
  defaultScope: {
    attributes: {
      include: ["created_at"],
    },
  },
  hooks, sequelize,
});

RewardPoint.crud = new CrudSpec();
RewardPoint.crud.search = ["discount_ref_no"];
// RewardPoint.crud.create = ["name", "description"];
// RewardPoint.crud.update = ["name", "description"];
// RewardPoint.crud.validators = {
//   create: [
//     validator.required("name"),
//     validator.trim("description"),
//   ],
//   update: [
//     validator.trim(["name", "description"])
//   ],
// };

export default RewardPoint;
