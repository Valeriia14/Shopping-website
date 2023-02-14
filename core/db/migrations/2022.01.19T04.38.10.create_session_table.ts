import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.createTable("session", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn("NOW"),
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn("NOW"),
        },
        ended_at: {
            type: DataTypes.DATE,
        },
        duration: {
            type: DataTypes.TIME,
        },
        account_id: {
            type: DataTypes.INTEGER,
        },
        status: {
            type: DataTypes.STRING(20)
        },
        pages: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
        addtocart: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        productpage: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
        deleted_at: {
            type: DataTypes.DATE,
        },
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.dropTable("session");
};
