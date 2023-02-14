import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  // Create 3 columns foreign keys for account table
  await sequelize.addColumn("account", "shipping_default_id", {
    type: DataTypes.INTEGER,
  });

  await sequelize.addColumn("account", "billing_default_id", {
    type: DataTypes.INTEGER,
  });

  await sequelize.addColumn("account", "payment_method_default_id", {
    type: DataTypes.INTEGER,
  });
  await sequelize.removeColumn("account", "delivery_address");
  await sequelize.removeColumn("account", "postal_code");
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn("account", "shipping_default_id");
  await sequelize.removeColumn("account", "billing_default_id");
  await sequelize.removeColumn("account", "payment_method_default_id");
  await sequelize.addColumn("account", "delivery_address", {
    type: DataTypes.INTEGER,
  });

  await sequelize.addColumn("account", "postal_code", {
    type: DataTypes.INTEGER,
  });
};
