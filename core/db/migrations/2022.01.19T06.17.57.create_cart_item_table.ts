import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.createTable("cart_item", {
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
        session_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER
        },
        reference: {
            type: DataTypes.CHAR(8),
            allowNull: false
        },
        product_type: {
            type: DataTypes.STRING(20)
        },
        parent_id: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING(20),
            defaultValue: 'created',
        },

    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.dropTable("cart_item");
};
