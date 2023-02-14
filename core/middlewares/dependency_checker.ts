import { BadRequestError, ServerError } from "@kidztime/errors";
import { make, Request } from "@kidztime/middlewares";
import CrudModel from "@kidztime/models/crud_model";
import { chirp } from "@kidztime/utilities";

export type DestroyCheckOptions = {
  foreign_key?: string
};
export type LoadedCheckOptions = {
  extras_key?: string
};
export type DependencySpec = [typeof CrudModel, string] | typeof CrudModel;

export const check_dependencies = (
  model_def: typeof CrudModel,
  dep_defs: DependencySpec[],
  options: DestroyCheckOptions = {},
) => {
  const { name: model_name } = model_def;
  let foreign_key = options.foreign_key || `${model_name}_id`;

  return make(async (req: Request) => {
    chirp("m: check_destroy_dep", model_name);
    const model = req.extras![model_name];
    if (!model)
      throw new BadRequestError("model not loaded");

    for (const dependency_spec of dep_defs) {
      let dependency_def: typeof CrudModel | null = null;
      if (Array.isArray(dependency_spec)) {
        dependency_def = dependency_spec[0];
        foreign_key = dependency_spec[1];
      } else if (typeof dependency_spec === "function") {
        dependency_def = dependency_spec;
      } else {
        throw new ServerError(`invalid dependency specification:${JSON.stringify(dependency_spec)}`);
      }

      const dep_count = await dependency_def!.count({ where: { [foreign_key]: model.id } });
      if (dep_count)
        throw new BadRequestError(`dependency exists:${dependency_def.name}`);
    }
  });
};

export const check_loaded = (
  model_def: typeof CrudModel,
  opts: LoadedCheckOptions = {},
) => {
  const { name: model_name } = model_def;
  let extras_key: string = opts.extras_key || model_name;
  return make(async (req: Request) => {
    chirp("m: check_loaded", model_name);
    const model = req.extras![extras_key];
    if (!model)
      throw new BadRequestError(`model not loaded:${model_name}`);
  });
};