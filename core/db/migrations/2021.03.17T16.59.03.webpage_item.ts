import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('webpage_item', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    webpage_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING
    },
    position: {
      type: DataTypes.STRING
    },
    options: {
      type: DataTypes.STRING
    },
    link: {
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
	await sequelize.dropTable('webpage_item');
};