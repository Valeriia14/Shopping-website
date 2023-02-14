import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('product_info', 'description', {
    type: DataTypes.TEXT,
  });
  return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('product_info', 'description', {
    type: DataTypes.STRING,
  });
};
