import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('review', 'account_id', {
    type: DataTypes.INTEGER  
  })
  await sequelize.addColumn('review', 'category_id', {
    type: DataTypes.INTEGER  
  })
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('review', 'account_id');
  await sequelize.removeColumn('review', 'category_id');
};