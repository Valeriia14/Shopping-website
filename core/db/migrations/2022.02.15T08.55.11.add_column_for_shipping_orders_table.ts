import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn("shipping_orders", "customer_name", {
        type: DataTypes.STRING,
        defaultValue: null,
    });
    await sequelize.addColumn("shipping_orders", "phone_number", {
      type: DataTypes.STRING,
      defaultValue: null,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.removeColumn("shipping_orders", "customer_name");
    await sequelize.removeColumn("shipping_orders", "phone_number");
};
