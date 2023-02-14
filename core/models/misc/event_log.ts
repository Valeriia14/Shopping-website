import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";
import { QueryConfig, QueryOptions } from "@kidztime/middlewares";

const sequelize = Datasource.source("default-db");

class EventLog extends CrudModel {
  static TABLENAME = "event_log";

  public timestamp!: Date | null;
  public category!: string | null;
  public description!: string | null;
  public owner_type!: string | null;
  public owner_id!: number | null;
  public actor_id!: number | null;
  public account_id!: number | null;
  public ip_address!: string | null;

  // associations

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

EventLog.init({
  timestamp: model_specs.timestamp(),

  category: model_specs.generic_string(),
  description: model_specs.generic_string(),
  owner_type: model_specs.generic_string(),

  owner_id: model_specs.number(),
  actor_id: model_specs.number(),
  account_id: model_specs.number(),

  ip_address: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(EventLog.TABLENAME),
  hooks, sequelize,
});

EventLog.crud = new CrudSpec();
EventLog.crud.filter.account = (config: QueryConfig) => {
  EventLog.crud.filter.default(config);
  const { query, options } = config;

  QueryOptions.query_column(config, "category");
  QueryOptions.query_column(config, "owner_type");
  QueryOptions.query_column(config, "owner_id", "owner");
  QueryOptions.query_column(config, "actor_id", "actor");
  QueryOptions.query_column(config, "account_id", "account");
  QueryOptions.query_column(config, "ip_address");

  if (query.timestamp) {
    const [first_date, last_date] = query.date.split(",");
    options.filter_date({ first_date, last_date });
  }
};
EventLog.crud.filter.admin = (config: QueryConfig) => {
  EventLog.crud.filter.account(config);
};

export default EventLog;