import Datasource from "@kidztime/models/datasource";
import { model_specs } from "@kidztime/utilities";
import { Model } from "sequelize";

const sequelize = Datasource.source("default-db");
class AccountPrivilege extends Model {
  static TABLENAME = "account_has_privilege";

  public account_id!: number;
  public privilege_id!: number;

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

AccountPrivilege.init({
  account_id: model_specs.foreign_key(true),
  privilege_id: model_specs.foreign_key(true),
}, {
  tableName: AccountPrivilege.TABLENAME,
  modelName: AccountPrivilege.TABLENAME,
  freezeTableName: true,
  timestamps: false,
  sequelize,
});

export default AccountPrivilege;