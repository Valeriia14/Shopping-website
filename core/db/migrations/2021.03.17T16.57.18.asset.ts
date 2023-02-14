import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('asset', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    owner_type: {
      type: DataTypes.STRING
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assoc_type: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    filename: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.INTEGER
    },
    content_type: {
      type: DataTypes.STRING
    },
    uri: {
      type: DataTypes.STRING
    },
    host: {
      type: DataTypes.STRING
    },
    host_key: {
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
	await sequelize.dropTable('asset');
};