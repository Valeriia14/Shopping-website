import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {

    await sequelize.removeColumn("question_answer", "category_id");
    await sequelize.addColumn("question_answer", "product_type_id", {
        type: DataTypes.INTEGER,
    });
    await sequelize.removeColumn("review", "category_id");
    await sequelize.addColumn("review", "product_type_id", {
        type: DataTypes.INTEGER,
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn("question_answer", "category_id", {
        type: DataTypes.INTEGER,
    });
    await sequelize.removeColumn("question_answer", "product_type_id");
    await sequelize.addColumn("review", "category_id", {
        type: DataTypes.INTEGER,
    });
    await sequelize.removeColumn("review", "product_type_id");
};
