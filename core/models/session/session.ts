import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils, validator } from "@kidztime/utilities";
import { CartItem } from "..";
const sequelize = Datasource.source("default-db");

class Session extends CrudModel {
  static TABLENAME = "session";
  static STATUS = {
    active: "active",
    ended : "ended",
  };

  public created_at!: Date | null;
  public updated_at!: Date | null;
  public deleted_at!: Date | null;
  public ended_at!: Date | null;
  public duration!: Date | null;
  public account_id!: number | null;
  public status!: string | null;
  public pages!: number | null;
  public addtocart!: boolean | null;
  public productpage!: boolean | null;
  // associations
  public cart_items!: CartItem[] | null;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
}

const hooks = {};

Session.init(
  {
    created_at: model_specs.timestamp(),
    updated_at: model_specs.timestamp(),
    deleted_at: model_specs.timestamp(),
    ended_at: model_specs.timestamp(),
    duration: model_specs.timestamp(),
    account_id: model_specs.foreign_key(),
    status: model_specs.generic_string(),
    pages: model_specs.number(),
    addtocart: model_specs.boolean(),
    productpage: model_specs.boolean(),
  },
  {
    ...model_utils.model_defaults(Session.TABLENAME),
    hooks,
    sequelize,
  }
);

Session.crud = new CrudSpec();
// Session.crud.search = ["discount_ref_no"];
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

export default Session;
