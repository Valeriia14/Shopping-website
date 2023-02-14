import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('product', 'features', {
    type: DataTypes.STRING
  })

  await sequelize.addColumn('product', 'certificates', {
    type:DataTypes.STRING
  })

  await sequelize.addColumn('product', 'materials', {
    type: DataTypes.STRING
  })

};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('product', 'certificates')
  await sequelize.removeColumn('product', 'materials')
  await sequelize.removeColumn('product', 'features')
};


