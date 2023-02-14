import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('order', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
    },
    payment_id: {
      type: DataTypes.INTEGER,
    },
    reference: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.DATE
    },
    currency: {
      type: DataTypes.STRING
    },
    subtotal: {
      type: DataTypes.DECIMAL(10,2)
    },
    shipping: {
      type: DataTypes.DECIMAL(10,2)
    },
    coupon_discount: {
      type: DataTypes.DECIMAL(10,2)
    },
    points_discount: {
      type: DataTypes.DECIMAL(10,2)
    },
    total: {
      type: DataTypes.DECIMAL(10,2)
    },
    items: {
      type: DataTypes.INTEGER
    },
    discount_code: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    payment_method: {
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
	await sequelize.dropTable('order');
};