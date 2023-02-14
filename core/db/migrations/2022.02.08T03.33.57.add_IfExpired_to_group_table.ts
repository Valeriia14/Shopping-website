import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
 
  await sequelize.addColumn("group", "IfExpired", {
    type: DataTypes.STRING(45),
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn("group", "IfExpired");
};
