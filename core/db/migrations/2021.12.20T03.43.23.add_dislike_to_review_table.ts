import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn('review', 'dislike', {
    type: DataTypes.INTEGER,
    defaultValue: 0
  })
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('review', 'dislike')
};
