import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn("reward_points", "payment_id", {
        type: DataTypes.INTEGER,
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.removeColumn("reward_points", "payment_id");
};
