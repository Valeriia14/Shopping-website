import { Sequelize, DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn('payment', 'type', {
        type: DataTypes.STRING,
        defaultValue: 'main'
    });
    return Promise.resolve();
};

export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.removeColumn('payment', 'type');
};