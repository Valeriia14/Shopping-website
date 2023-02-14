import { BadRequestError, ServerError } from "@kidztime/errors";
import { ObjectMeta } from "@kidztime/models";
import CrudModel, { CrudFilter, CrudSpec } from "@kidztime/models/crud_model";
import { model_utils } from "@kidztime/utilities";
import { json, RequestHandler } from "express";
import { controller } from "./controller";
import { check_dependencies, DestroyCheckOptions } from "./dependency_checker";
import { Request, RequestBody, Response } from "./middleware";
import { load_child_model, load_model } from "./model_loaders";
import { parse_query, query_meta } from "./query_parser";

export namespace cruder {
  export const find_filter = (crud: CrudSpec, ...scopes: string[]): CrudFilter => {
    for (const scope of scopes)
      if (crud.filter[scope]) return crud.filter[scope];

    return crud.filter.default;
  };

  export const processor = async (model: CrudModel, data: RequestBody, spec: string[] = []) => {
    if (typeof spec === "function")
      spec = [spec];

    if (!Array.isArray(spec))
      throw new ServerError("unknown crudspec type");

    for (let i in spec) {
      let spec_item = spec[i];
      if (typeof spec_item === "string") {
        if (data[spec_item] !== undefined)
          model[spec_item] = data[spec_item];
      }
    }
    return model;
  };

  export const list = (model_def: typeof CrudModel, parent_def?: typeof CrudModel): Array<RequestHandler> => {
    const crud = model_def.crud;
    const ctrl = controller(async (req: Request, res: Response) => {
      const { crudscope = "public" } = req.extras!;
      const listscope = `${crudscope}_list`;
      const scoped_model_def = model_utils.scope(model_def, listscope, crudscope);

      const options = req.parse_query!();
      if (parent_def) {
        const parent = req.extras![parent_def.name];
        if (!parent)
          throw new BadRequestError(`model not loaded:${parent_def.name}`);
        options.where[`${parent_def.name}_id`] = parent.id;
      }

      if (req.query.search)
        options.search(<string>req.query.search, crud.search || []);

      const filter: CrudFilter = find_filter(crud, listscope, crudscope);
      filter({
        options,
        extras: req.extras!,
        query: req.query,
      });

      const { primary_key = "id" } = model_def;
      const count_col = options.include ? primary_key : `${scoped_model_def.getTableName()}.${primary_key}`;

      const models = await scoped_model_def.findAll({ ...options });
      const count = await scoped_model_def.count({
        ...options,
        distinct: true,
        col: count_col,
      });
      res.result.models = models;
      res.result.meta = query_meta(options, count);
    });

    return [parse_query(), ...ctrl];
  };

  export const detail = (model_def: typeof CrudModel, parent_def?: typeof CrudModel): Array<RequestHandler> => {
    const model_key = model_def.name;
    const ctrl = controller(async (req, res) => {
      let model: CrudModel = req.extras![model_key];
      res.result.model = model;
    });

    const loader = parent_def === undefined ?
      load_model(model_def) : load_child_model(model_def, parent_def);

    return [loader, json(), ...ctrl];
  };

  export const create = (model_def: typeof CrudModel): Array<RequestHandler> => {
    const crud = model_def.crud;
    const { create: create_validators = [] } = crud.validators;
    const validators = [...create_validators];

    const ctrl = controller(validators, async (req, res) => {
      const { primary_key = "id" } = model_def;
      const { crudscope = "public" } = req.extras!;
      const scoped_model_def = model_utils.scope(model_def, crudscope);
      let model = new model_def();

      model = await processor(model, req.body, crud.create);
      await model.save();

      const temp_model = await scoped_model_def.findByPk(model[primary_key]);
      if (temp_model instanceof CrudModel)
        model = temp_model;
      res.result.model = model;
    });

    return [json(), ...ctrl];
  };

  export const update = (model_def: typeof CrudModel): Array<RequestHandler> => {
    const crud = model_def.crud;
    const { update: update_validators = [] } = crud.validators;
    const validators = [...update_validators];

    const model_key = model_def.name;
    const ctrl = controller(validators, async (req, res) => {
      const { primary_key = "id" } = model_def;
      const { crudscope = "public" } = req.extras!;
      const scoped_model_def = model_utils.scope(model_def, crudscope);
      let model: CrudModel = req.extras![model_key];

      model = await processor(model, req.body, crud.update);
      await model.save();

      const temp_model = await scoped_model_def.findByPk(model[primary_key]);
      if (temp_model instanceof CrudModel)
        model = temp_model;
      res.result.model = model;
    });

    return [load_model(model_def), json(), ...ctrl];
  };

  export const destroy = (
    model_def: typeof CrudModel,
    dependency_defs: Array<typeof CrudModel> = [],
    opts?: DestroyCheckOptions,
  ): Array<RequestHandler> => {
    const model_key = model_def.name;
    const ctrl = controller(async (req, res) => {
      const model = req.extras![model_key];
      await model.destroy();
    });

    return [
      load_model(model_def),
      check_dependencies(model_def, dependency_defs, opts),
      ...ctrl,
    ];
  };


  export const child = (parent_def: typeof CrudModel, child_def: typeof CrudModel) => {
    const crud = child_def.crud;
    const { create: create_validators = [] } = crud.validators;
    const validators = [...create_validators];

    const ctrl = controller(validators, async (req, res) => {
      const { primary_key = "id" } = child_def;
      const { crudscope = "public" } = req.extras!;
      const detailscope = `${crudscope}_detail`;
      const scoped_child_def = model_utils.scope(child_def, detailscope, crudscope);

      const parent = req.extras![parent_def.name];
      if (!parent)
        throw new ServerError("parent not defined");

      const parent_key = `${parent_def.name}_id`;

      let model = new child_def();
      model[parent_key] = parent.id;

      model = await processor(model, req.body, crud.create);
      await model.save();

      const temp_model = await scoped_child_def.findByPk(model[primary_key]);
      if (temp_model instanceof CrudModel)
        model = temp_model;
      res.result.model = model;
    });

    return [json(), load_model(parent_def), ...ctrl];
  };
};
