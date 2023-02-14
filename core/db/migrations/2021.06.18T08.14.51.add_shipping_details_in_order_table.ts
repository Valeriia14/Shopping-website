import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('order', 'postal_code', {
      type: DataTypes.STRING
  });
  await sequelize.addColumn('order', 'customer_name', {
    type: DataTypes.STRING
  });
  await sequelize.addColumn('order', 'phone_number', {
    type: DataTypes.STRING
  });
  return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('order', 'postal_code');
  await sequelize.removeColumn('order', 'customer_name');
  await sequelize.removeColumn('order', 'phone_number');
};