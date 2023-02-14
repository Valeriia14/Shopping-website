import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('objectmeta', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING
    },
    value: {
      type: DataTypes.STRING
    },
    extra0: {
      type: DataTypes.STRING
    },
    extra1: {
      type: DataTypes.STRING
    },
    extra2: {
      type: DataTypes.STRING
    },
    extra3: {
      type: DataTypes.STRING
    },
    extra4: {
      type: DataTypes.STRING
    },
    owner_type: {
      type: DataTypes.STRING
    },
    owner_id: {
      type: DataTypes.INTEGER
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
	await sequelize.dropTable('objectmeta');
};