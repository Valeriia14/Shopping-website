import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('account', 'google_id', {
    type:DataTypes.STRING
  })

  await sequelize.addColumn('account', 'facebook_id', {
    type:DataTypes.STRING
  })

};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('account', 'google_id')
  await sequelize.removeColumn('account', 'facebook_id')
};


