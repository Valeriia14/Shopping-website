import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('pw_request', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    credential_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ip_request: {
      type: DataTypes.STRING,
    },
    ip_reset: {
      type: DataTypes.STRING,
    },
    ip_last_attempt: {
      type: DataTypes.STRING,
    },
    reset_attempts: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    reset_at: {
      type: DataTypes.DATE,
    },
    expired_at: {
      type: DataTypes.DATE,
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
	await sequelize.dropTable('pw_request');
};