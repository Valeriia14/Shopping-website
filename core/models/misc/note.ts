import { QueryConfig } from "@kidztime/middlewares";
import CrudModel, { CrudSpec } from "@kidztime/models/crud_model";
import Datasource from "@kidztime/models/datasource";
import { model_specs, model_utils } from "@kidztime/utilities";

const sequelize = Datasource.source("default-db");

class Note extends CrudModel {
  static TABLENAME = "note";

  public owner_type!: string | null;
  public owner_id!: number | null;
  public assoc_type!: string | null;

  public note!: string | null;
  // associations

  toJSON(): object {
    const values: any = Object.assign({}, this.get());
    return values;
  }
};

const hooks = {
};

Note.init({
  owner_type: model_specs.generic_string(),
  owner_id: model_specs.number(),
  assoc_type: model_specs.generic_string(),
  note: model_specs.generic_string(),
}, {
  ...model_utils.model_defaults(Note.TABLENAME),
  defaultScope: {
    attributes: {
      exclude: ["deleted_at"],
    },
  },
  hooks, sequelize,
});

Note.crud = new CrudSpec();
Note.crud.update = ["note"];

Note.crud.filter.account = (config: QueryConfig) => {
  Note.crud.filter.default(config);
  const { query, options } = config;

  if (query.timestamp) {
    const [first_date, last_date] = query.date.split(",");
    options.filter_date({ first_date, last_date });
  }
};
Note.crud.filter.admin = (config: QueryConfig) => {
  Note.crud.filter.account(config);
};


export default Note;