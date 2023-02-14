import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn("order_item", "discounted_amt", { type: DataTypes.DECIMAL(10, 2) });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.removeColumn("order_item", "discounted_amt");
};
