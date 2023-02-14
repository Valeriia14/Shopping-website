import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.createTable('product_type', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "product_type"
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
    min_age:{
      type: DataTypes.INTEGER,
    },
    max_age:{
      type: DataTypes.INTEGER,
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
    },
    category_id: {
      type: DataTypes.INTEGER,
    },
    item_class: {
      type: DataTypes.STRING,
    },
    customer_segment: {
      type: DataTypes.STRING,
    },
    customer_segment_dtl: {
      type: DataTypes.STRING,
    },
    description_dtl: {
      type: DataTypes.TEXT,
    },
    ifpersonalised: {
      type: DataTypes.INTEGER,
    },
	});
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.dropTable('product_type');
};
