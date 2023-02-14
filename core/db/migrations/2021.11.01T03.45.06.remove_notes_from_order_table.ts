import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('order', 'notes')
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('order', 'notes', {
    type: DataTypes.STRING
  })
};