import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  
  await sequelize.addColumn('question_answer', 'qa_category', {
    type: DataTypes.STRING
  })
  await sequelize.addColumn('question_answer', 'is_public', {
    type: DataTypes.BOOLEAN
  })
  await sequelize.addColumn('question_answer', 'uses_email', {
    type: DataTypes.BOOLEAN
  })

};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn('question_answer', 'qa_category')
  await sequelize.removeColumn('question_answer', 'is_public')
  await sequelize.removeColumn('question_answer', 'uses_email')
};


