import { QueryConfig } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import config from "@kidztime/config";

const sequelize = Datasource.source("default-db");

class Asset extends CrudModel {
  static TABLENAME = "asset";

  public owner_type!: string | null;
  public owner_id!: number | null;
  public assoc_type!: string | null;

  public name!: string | null;
  public filename!: string | null;

  public size!: number | null;
  public content_type!: string | null;

  public uri!: string | null;
  public host!: string | null;
  public host_key!: string | null;

  // associations

  toJSON(): object {
    let values: any = Object.assign({}, this.get());
    if(values?.uri) {
      const cloud_front = config?.s3?.cloud_front || "https://staging.kidztime.com/static-media/"
      values.uri = cloud_front + values.uri
    }
    return values;
  }
};

const hooks = {
};

Asset.init({
  owner_type: model_specs.generic_string(),
  owner_id: model_specs.number(),
  assoc_type: model_specs.generic_string(),

  name: model_specs.generic_string(),
  filename: model_specs.generic_string(),

  size: model_specs.number(),
  content_type: model_specs.generic_string(),

  uri: model_specs.generic_string(),
  host: model_specs.generic_string(),
  host_key: model_specs.generic_string(),

}, {
  ...model_utils.model_defaults(Asset.TABLENAME),
  hooks, sequelize,
});

Asset.crud = new CrudSpec();
Asset.crud.filter.account = (config: QueryConfig) => {
  Asset.crud.filter.default(config);
  const { query, options } = config;

  if (query.timestamp) {
    const [first_date, last_date] = query.date.split(",");
    options.filter_date({ first_date, last_date });
  }
};
Asset.crud.filter.admin = (config: QueryConfig) => {
  Asset.crud.filter.account(config);
};

export default Asset;