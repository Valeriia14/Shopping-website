import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('order', 'shipping_address', {
      type: DataTypes.STRING
  });
  return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
await sequelize.removeColumn('order', 'shipping_address');
};