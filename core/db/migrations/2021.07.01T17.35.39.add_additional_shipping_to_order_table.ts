import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('order', 'additional_shipping', {
      type: DataTypes.DECIMAL(10,2),
      defaultValue: 0
  })
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('order', 'additional_shipping');
};