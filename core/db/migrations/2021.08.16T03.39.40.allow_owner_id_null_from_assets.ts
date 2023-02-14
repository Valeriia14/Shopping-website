import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('asset', 'owner_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
  return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.changeColumn('asset', 'owner_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
  });
};
