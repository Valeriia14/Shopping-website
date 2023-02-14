import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('order', 'customer_email', {
      type: DataTypes.STRING  })
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('order', 'customer_email');
};