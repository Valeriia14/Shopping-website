import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.removeColumn('order', 'payment_id')
    return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn('order', 'payment_id',{
        type: DataTypes.INTEGER
    })
};