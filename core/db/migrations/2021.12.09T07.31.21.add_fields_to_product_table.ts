import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('product', 'is_new', {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  })

  await sequelize.addColumn('product', 'is_sale', {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  })

  await sequelize.addColumn('product', 'has_gift', {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  })

};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('product', 'is_new')
  await sequelize.removeColumn('product', 'is_sale')
  await sequelize.removeColumn('product', 'has_gift')
};


