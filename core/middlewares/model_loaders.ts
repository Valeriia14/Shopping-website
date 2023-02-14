import { BadRequestError } from "@kidztime/errors";
import { make, Request } from "@kidztime/middlewares";
import CrudModel from "@kidztime/models/crud_model";
import { chirp, model_utils } from "@kidztime/utilities";

export type LoadModelOptions = {
  optional?: boolean;
  json?: boolean;
};
export type LoadChildModelOptions = {
  foreign_key?: string;
  extras_key?: string;
  optional?: boolean;
  json?: boolean;
};

export const load_model = (
  model_def: typeof CrudModel,
  opts: LoadModelOptions = {}
) => {
  return make(async (req: Request) => {
    chirp("m: load_model", model_def.name);

    const type = opts.json ? "body" : "path";
    let { primary_key = "id" } = model_def;
    let key = `${model_def.name}_${primary_key}`;
    let id = opts.json ? req.body[key] : req.params[key];

    if (opts.optional && !id) return;

    if (!id) throw new BadRequestError(`${key} not found in ${type}`);

    const { optional } = opts;
    const { crudscope = "public" } = req.extras!;
    const specific_scope = `${crudscope}_detail`;
    const scoped_model_def = model_utils.scope(
      model_def,
      specific_scope,
      crudscope
    );
    let model = await scoped_model_def.findByPk(id);
    if (!model) {
      throw new BadRequestError(`model not found:${model_def.name}`);
    }
    req.extras![model_def.name] = model;
  });
};

export const load_child_model = (
  model_def: typeof CrudModel,
  parent_def: typeof CrudModel,
  opts: LoadChildModelOptions = {}
) => {
  const { name: model_name } = model_def;
  const { name: parent_name } = parent_def;
  const foreign_key = opts.foreign_key || `${parent_name}_id`;
  const extras_key: string = opts.extras_key || parent_name;
  return make(async (req: Request) => {
    chirp("m: load_child_model", model_name, parent_name);

    const parent = req.extras![extras_key];

    if (!parent) throw new BadRequestError(`model not loaded:${parent_name}`);
    const parent_id = parent.id;

    const type = opts.json ? "body" : "path";
    let { primary_key = "id" } = model_def;
    let key = `${model_def.name}_${primary_key}`;
    let id = opts.json ? req.body[key] : req.params[key];

    if (!id) throw new BadRequestError(`${key} not found in ${type}`);

    const { optional } = opts;
    const { crudscope = "public" } = req.extras!;
    const specific_scope = `${crudscope}_detail`;
    const scoped_model_def = model_utils.scope(
      model_def,
      specific_scope,
      crudscope
    );
    let model = await scoped_model_def.findOne({
      where: {
        id,
        [foreign_key]: parent_id,
      },
    });
    if (!optional && !model) {
      throw new BadRequestError(`model not found:${model_def.name}`);
    }
    req.extras![model_def.name] = model;
  });
};

export type LoadHandleOptions = {
  optional?: boolean;
  json?: boolean;
};
export const load_handle = (
  model_def: typeof CrudModel,
  opts: LoadHandleOptions = {}
) => {
  return make(async (req: Request) => {
    chirp("m: load_handle", model_def.name);

    let handle = req.params.handle;

    if (opts.optional && !handle) return;

    if (!handle) throw new BadRequestError(`handle not found in path`);

    const { crudscope = "public" } = req.extras!;
    const specific_scope = `${crudscope}_detail`;
    const scoped_model_def = model_utils.scope(
      model_def,
      specific_scope,
      crudscope
    );
    let model = await scoped_model_def.findOne({
      where: { handle },
    });
    req.extras![model_def.name] = model;
  });
};
