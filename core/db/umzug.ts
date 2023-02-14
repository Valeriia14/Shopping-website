require("@kidztime/utilities");
require("@kidztime/config").default.__configure(`./config`);

import { Umzug, SequelizeStorage } from "umzug";
import { Sequelize } from "sequelize";
import config from "@kidztime/config";

const { datasources } = config;
const datasource = datasources.find((source: any) => source.name === "default-db");
const { username, password, schema, options } = datasource;

const sequelize = new Sequelize(schema, username, password, {
	dialect: options.dialect,
	host: options.host,
	pool:{
		max: 50,
		min: 0,
		acquire: 60000,
		idle: 10000
	}
});
export const migrator = new Umzug({
	migrations: {
		glob: ['migrations/*.ts', { cwd: __dirname }],
	},
	context: sequelize.getQueryInterface(),
	storage: new SequelizeStorage({
		sequelize,
	}),
	logger: console,
});

export type Migration = typeof migrator._types.migration;
