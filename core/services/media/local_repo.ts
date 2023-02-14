import { BadRequestError, ServerError } from "@kidztime/errors";
import { controller } from "@kidztime/middlewares";
import CrudModel from "@kidztime/models/crud_model";
import { gen_token } from "@kidztime/utilities";
import fs from "fs";
import path from "path";
import fileupload, { UploadedFile } from "express-fileupload";
import { Asset, transact } from "@kidztime/models";
import { GenericOpts } from "../types";

type RepoStat = {
  static_folder: string;
  temp_folder: string;
  auto_mkdir: boolean;
  uri_prefix: string;
};
const StaticLocalHost = "static-local";

let _state: RepoStat;

const check_state = () => {
  if (!_state)
    throw new ServerError("local media repo not enabled");
  if (fs.existsSync(_state.static_folder)) return;
  if (fs.existsSync(_state.temp_folder)) return;
  if (_state.auto_mkdir) {
    fs.mkdirSync(_state.static_folder, { recursive: true });
    fs.mkdirSync(_state.temp_folder, { recursive: true });
  } else {
    throw new ServerError("static, temp folder not found");
  }
  if (!fs.existsSync(_state.static_folder)) throw new ServerError("static folder create failed");
  if (!fs.existsSync(_state.temp_folder)) throw new ServerError("temp folder create failed");
};

export const setup_local_repo = async (config: any) => {
  _state = {
    static_folder: config.static_folder,
    temp_folder: config.temp_folder,
    auto_mkdir: config.auto_mkdir,
    uri_prefix: config.uri_prefix,
  };
};

export const allocate_file = (filename: string, temp: boolean) => {
  check_state();

  const token = gen_token(16);
  const pathname = temp ? `${token}${path.extname(filename)}` : path.join(token, filename);
  const filepath = path.join(temp ? _state.temp_folder : _state.static_folder, pathname);
  return { pathname, filepath };
};

export const store_file = async (file: fileupload.UploadedFile, temp = false) => {
  check_state();

  const { filepath, pathname } = allocate_file(file.name, temp);
  const directory = path.dirname(filepath);
  if (!fs.existsSync(directory))
    fs.mkdirSync(directory, { recursive: true });
  await file.mv(filepath);

  return { filepath, pathname };
};

export const delete_file = (filepath: string) => {
  const directory = path.join(`${__dirname}/../../../`, filepath);
  return new Promise((resolve, reject) => {
    fs.unlink(directory, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve({ result: true, msg: "deleted file successfully" });
      }
    });
  });
};

export type MediaAssocOpts = GenericOpts & {
  overwrite?: boolean;
  asset_name?: string;
};
export const mw_assoc = (model_def: typeof CrudModel = null, assoc_type: string = '', opts: MediaAssocOpts = {}) => {
  const model_key = model_def ? model_def.name : null;

  return controller(async (req, res) => {
    const model: CrudModel = model_key ? req.extras![model_key] : null;
    const file = req.files!.image as UploadedFile;
    if (!file)
      throw new BadRequestError("file not found:image");
  
    const { filepath, pathname } = await store_file(file);

    const asset = await transact(opts.transaction).run(async (transaction) => {
      if (model && opts.overwrite) {
        await Asset.destroy({
          where: {
            owner_type: model_key,
            owner_id: model.id,
            assoc_type,
          },
        });
      }

      const asset = await Asset.create({
        owner_type: model_key,
        owner_id: model ? model.id : null,
        assoc_type,
        size: file.size,
        name: opts.asset_name,
        content_type: file.mimetype,
        host: StaticLocalHost,
        host_key: filepath,
        uri: `${_state.uri_prefix}/${pathname}`,
      });

      return asset;
    });


    res.result.model = asset;
  });
};