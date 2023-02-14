import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.addColumn("account", "date_of_birth", {
    type: DataTypes.STRING,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn("account", "date_of_birth");
};
