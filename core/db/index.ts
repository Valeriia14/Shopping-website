require("@kidztime/utilities");
require("@kidztime/config").default.__configure(`./config`);

import { Sequelize } from "sequelize";
import { chirp } from "@kidztime/utilities";
import config from "@kidztime/config";

const { datasources } = config;
const datasource = datasources.find((source: any) => source.name === "default-db");
const { username, password, schema, options } = datasource;
//create the sequelize instance, omitting the database-name arg
const sequelize = new Sequelize("", username, password, {
  dialect: options.dialect,
	host: options.host,
  pool:{
    max: 50,
    min: 0,
    acquire: 60000,
    idle: 10000
  }
});

sequelize.query(`CREATE DATABASE IF NOT EXISTS ${schema};`)
.then(() => chirp("db creation completed"))
.catch(console.error)
.finally(() => process.exit(0));
