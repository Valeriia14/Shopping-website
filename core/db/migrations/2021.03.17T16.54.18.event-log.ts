import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('event_log', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    owner_type: {
      type: DataTypes.STRING,
    },
    owner_id: {
      type: DataTypes.INTEGER,
    },
    actor_id: {
      type: DataTypes.INTEGER,
    },
    account_id: {
      type: DataTypes.INTEGER,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    timestamp: {
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
	await sequelize.dropTable('event_log');
};