import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('category_has_producttype', {
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
	});
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.dropTable('category_has_producttype');
};