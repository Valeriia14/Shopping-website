import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('ipgeo_cache', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ip_address: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    region: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    label: {
      type: DataTypes.STRING
    },
    raw: {
      type: DataTypes.INTEGER
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
     defaultValue: Sequelize.fn("NOW")
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
	await sequelize.dropTable('ipgeo_cache');
};