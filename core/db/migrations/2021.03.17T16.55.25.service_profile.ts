import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('service_profile', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
    },
    service: {
      type: DataTypes.STRING,
    },
    secret: {
      type: DataTypes.STRING,
    },
    key: {
      type: DataTypes.STRING,
    },
    extra0: {
      type: DataTypes.STRING,
    },
    extra1: {
      type: DataTypes.STRING,
    },
    extra2: {
      type: DataTypes.STRING,
    },
    extra3: {
      type: DataTypes.STRING,
    },
    extra4: {
      type: DataTypes.STRING,
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
	await sequelize.dropTable('service_profile');
};