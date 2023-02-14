import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('category', 'type', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "category"
  });
  return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('category', 'type', {
    type: DataTypes.STRING,
  });
};
