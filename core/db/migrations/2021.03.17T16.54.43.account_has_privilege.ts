import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('account_has_privilege', {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    privilege_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.dropTable('account_has_privilege');
};