import { BadRequestError, ServerError } from "@kidztime/errors";
import { controller } from "@kidztime/middlewares";
import CrudModel from "@kidztime/models/crud_model";
import fileupload, { UploadedFile } from "express-fileupload";
import { Asset, transact } from "@kidztime/models";
import { GenericOpts } from "../types";
import AWS from 'aws-sdk';
import config from "@kidztime/config";
import { gen_token } from "@kidztime/utilities";
import fs from "fs";

AWS.config.update({
  accessKeyId: config.s3.access_key_id,
  secretAccessKey: config.s3.secret_access_key
})

const s3 = new AWS.S3();
const bucket = config.s3.bucket;

export const s3_store_file = async (file: fileupload.UploadedFile, temp = false) => {
  const type = file.mimetype.split('/')[1]
  // Setting up S3 upload parameters
  const token = gen_token(16);
  // Binary data base64
  const fileContent  = fs.createReadStream(file.tempFilePath);
  const fileName = `${token}.${type}`;
  const params = {
    Bucket: bucket,
    Key: `static-media/${fileName}`,
    Body: fileContent,
    ACL:'public-read'
  };
  return await s3.upload(params, function (err, data) {
    if (err) {
      throw new BadRequestError("uploading files fail");
    }
  }).promise().then(data => {
    return {...data,fileName}
  } );
};

export const s3_delete_file = async (filepath: string) => {
  return await s3.deleteObject({
    Bucket: bucket,
    Key: filepath
  }, async (err, _data) => {
    if (err) throw new BadRequestError("delete files fail");
    return { result: true, msg: "deleted file successfully" };
  })
};

export type MediaAssocOpts = GenericOpts & {
  overwrite?: boolean;
  asset_name?: string;
};
export const s3_mw_assoc = (model_def: typeof CrudModel = null, assoc_type: string = '', opts: MediaAssocOpts = {}) => {
  const model_key = model_def ? model_def.name : null;

  return controller(async (req, res) => {
    const model: CrudModel = model_key ? req.extras![model_key] : null;
    const file = req.files!.image as UploadedFile;
    if (!file)
      throw new BadRequestError("file not found:image");

    const s3File = await s3_store_file(file);

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
        host: "static-media",
        host_key: s3File.Key,
        uri:`${s3File.fileName}` 
      });
      return asset;
    });

    res.result.model = asset;
  });
};