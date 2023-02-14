import { QueryConfig } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");

class IPGeoCache extends CrudModel {
  static TABLENAME = "ipgeo_cache";

  public ip_address!: string | null;
  public country!: string | null;
  public region!: string | null;
  public city!: string | null;
  public label!: string | null;
  public raw!: string | null;

  public timestamp!: Date | null;

  // associations

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

IPGeoCache.init({
  ip_address: model_specs.generic_string(),
  country: model_specs.generic_string(),
  region: model_specs.generic_string(),
  city: model_specs.generic_string(),
  label: model_specs.generic_string(),

  raw: model_specs.text(),

  timestamp: model_specs.timestamp(),
}, {
  ...model_utils.model_defaults(IPGeoCache.TABLENAME),
  hooks, sequelize,
});

IPGeoCache.crud = new CrudSpec();
IPGeoCache.crud.filter.account = (config: QueryConfig) => {
  IPGeoCache.crud.filter.default(config);
  const { query, options } = config;

  if (query.date) {
    const [first_date, last_date] = query.date.split(",");
    options.filter_date({ first_date, last_date }, "timestamp");
  }
};

export default IPGeoCache;