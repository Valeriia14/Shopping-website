import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('account', {
		id: {
			type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
		},
    reference: {
      type: DataTypes.STRING,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    email_address: {
      type: DataTypes.STRING,
    },
    delivery_address: {
      type: DataTypes.STRING,
    },
    postal_code: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    last_seen_at: {
      type: DataTypes.DATE,
    },
    last_logged_in: {
      type: DataTypes.DATE,
    },
    last_order_at: {
      type: DataTypes.DATE,
    },
    email_verified_at: {
      type: DataTypes.DATE,
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
	await sequelize.dropTable('account');
};