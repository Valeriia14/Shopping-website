import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.createTable('character', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "character"
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    handle: {
      type: DataTypes.STRING
    },
    meta_keywords: {
      type: DataTypes.STRING
    },
    meta_title: {
      type: DataTypes.STRING
    },
    extras: {
      type: DataTypes.STRING
    },
    webpage_id : {
      type: DataTypes.INTEGER,
    },
    published : {
      type: DataTypes.BOOLEAN,
    },
    published_at:{
      type: DataTypes.DATE,
    },
    if_boy:{
      type: DataTypes.BOOLEAN,
    },
    if_girl:{
      type: DataTypes.BOOLEAN,
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
  await sequelize.dropTable('character');
};
