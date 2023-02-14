import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('verify_request', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    open_at: {
      type: DataTypes.DATE
    },
    submit_at: {
      type: DataTypes.DATE
    },
    resolve_at: {
      type: DataTypes.DATE
    },
    expire_at: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.STRING
    },
    token: {
      type: DataTypes.STRING
    },
    code: {
      type: DataTypes.STRING
    },
    result: {
      type: DataTypes.STRING
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
     defaultValue: Sequelize.fn("NOW")
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
     defaultValue: Sequelize.fn("NOW")
    },
    deleted_at: {
      type: DataTypes.DATE,
    }
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.dropTable('verify_request');
};