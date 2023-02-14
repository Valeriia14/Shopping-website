import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('category', 'webpage_id', {
      type: DataTypes.INTEGER  })
  await sequelize.addColumn('category', 'published', {
        type: DataTypes.BOOLEAN  })    
  await sequelize.addColumn('category', 'published_at', {
        type: DataTypes.DATE  })          
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('category', 'webpage_id');
  await sequelize.removeColumn('category', 'published');
  await sequelize.removeColumn('category', 'published_at');
};