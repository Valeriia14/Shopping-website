import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('product', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    reference: {
      type: DataTypes.STRING
    },
    handle: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    alt_name: {
      type: DataTypes.STRING
    },
    sku: {
      type: DataTypes.STRING
    },
    upc: {
      type: DataTypes.STRING
    },
    material: {
      type: DataTypes.STRING
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL(10,2)
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
	await sequelize.dropTable('product');
};