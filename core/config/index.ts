import Toml from "toml";
import fs from "fs";
import { chirp } from "@kidztime/utilities";
import { ServerError } from "@kidztime/errors";

export type Configurations = {
  [index: string]: any;
};

const NODE_ENV = process.env.NODE_ENV || "development";
const {
  DATABASE_HOST,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  B2B_DATABASE_HOST,
  B2B_DATABASE_USERNAME,
  B2B_DATABASE_PASSWORD,
  STRIPE_SECRET_KEY,
  SENDGRID_API_KEY,

  S3_ACCESS_KEY_ID,
  S3_SECRET_KEY_ID,
  S3_BUCKET,
} = process.env;

const load_config = (filename: string) => {
  const config_path = `${config.__config_folder}/${filename}.toml`;
  try {
    chirp(`loading config "${config_path}"`);
    const toml = Toml.parse(fs.readFileSync(config_path, "utf8"));
    if (toml.__configure)
      throw new ServerError("__configure is a reserved keyword in the configs");
    if (toml.__config_folder)
      throw new ServerError(
        "__config_folder is a reserved keyword in the configs"
      );
    return toml;
  } catch (e) {
    chirp(`config "${config_path}" cannot be read`);
  }
};

const configure = (config_folder: string) => {
  chirp(`configuring environment ${NODE_ENV}`);
  config.__config_folder = config_folder;

  const base_config = load_config("development");
  Object.assign(config, base_config);

  if (NODE_ENV !== "development") {
    const env_config = load_config(NODE_ENV);
    Object.assign(config, env_config);
  }

  const local_config = load_config("local");
  if (local_config) Object.assign(config, local_config);

  chirp(`overrides credentials from the environment variables...`);
  let { datasources } = config;
  for (let datasource of datasources) {
    if (datasource.name == "b2b") {
      if (B2B_DATABASE_HOST) datasource.options.host = B2B_DATABASE_HOST;
      if (B2B_DATABASE_USERNAME) datasource.username = B2B_DATABASE_USERNAME;
      if (B2B_DATABASE_PASSWORD) datasource.password = B2B_DATABASE_PASSWORD;
    } else {
      if (DATABASE_HOST) datasource.options.host = DATABASE_HOST;
      if (DATABASE_USERNAME) datasource.username = DATABASE_USERNAME;
      if (DATABASE_PASSWORD) datasource.password = DATABASE_PASSWORD;
    }
  }

  if (STRIPE_SECRET_KEY) config.stripe.secret_key = STRIPE_SECRET_KEY;

  if (S3_ACCESS_KEY_ID) config.s3.access_key_id = S3_ACCESS_KEY_ID;
  if (S3_SECRET_KEY_ID) config.s3.secret_access_key = S3_SECRET_KEY_ID;
  if (S3_BUCKET) config.s3.bucket = S3_BUCKET;

  const mailers = config.mailers || [];
  for (const mailer of mailers) {
    if (mailer.provider === "sendgrid" && SENDGRID_API_KEY) {
      if (SENDGRID_API_KEY) mailer.config.api_key = SENDGRID_API_KEY;
    }
  }
};

const config: any = { __configure: configure };

export default config;
