import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('webpage_item', 'options', {
    type: DataTypes.TEXT,
  });
  return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('webpage_item', 'options', {
    type: DataTypes.STRING,
  });
};
