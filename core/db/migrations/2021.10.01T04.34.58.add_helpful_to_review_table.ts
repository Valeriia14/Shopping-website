import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('review', 'helpful', {
    type: DataTypes.INTEGER,
  });
  return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('review', 'helpful', {
    type: DataTypes.INTEGER,
  });
};
