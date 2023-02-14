import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('order_item', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
    },
    product_type: {
      type: DataTypes.STRING
    },
    reference: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    sku: {
      type: DataTypes.STRING
    },
    upc: {
      type: DataTypes.STRING
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    unit_price: {
      type: DataTypes.DECIMAL(10,2)
    },
    discount_value: {
      type: DataTypes.DECIMAL(10,2)
    },
    discount_type: {
      type: DataTypes.STRING
    },
    subtotal: {
      type: DataTypes.DECIMAL(10,2)
    },
    status: {
      type: DataTypes.STRING
    },
    refund_reason: {
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
	await sequelize.dropTable('order_item');
};