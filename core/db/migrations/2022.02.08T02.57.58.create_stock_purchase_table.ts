import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.createTable("stock_purchase", {
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
        deleted_at: {
            type: DataTypes.DATE,
        },
        sku: {
            type: DataTypes.STRING,
        },
        upc: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        category_id: {
            type: DataTypes.INTEGER,
        },
        character_id: {
            type: DataTypes.INTEGER,
        },
        product_type_id: {
            type: DataTypes.INTEGER,
        },
        qty: {
            type: DataTypes.INTEGER,
        },
        purchase_ref: {
            type: DataTypes.STRING,
        },
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.dropTable("stock_purchase");
};
