import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  
  await sequelize.addColumn('question_answer', 'email', {
    type: DataTypes.STRING
  })
  await sequelize.addColumn('question_answer', 'first_name', {
    type: DataTypes.STRING
  })
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('question_answer', 'email')
  await sequelize.removeColumn('question_answer', 'first_name')
};


