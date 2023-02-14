import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.createTable('discount_transaction', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn("NOW")
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn("NOW")
        },
        account_id: {
            type: DataTypes.INTEGER
        },
        order_id: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING
        },
        transaction_amt: {
            type: DataTypes.DECIMAL(10, 2)
        },
        discount_type: {
            type: DataTypes.STRING(45)
        },
        discount_ref_no: {
            type: DataTypes.STRING(45)
        },
        deleted_at: {
            type: DataTypes.DATE,
        }
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.dropTable('discount_transaction');
};
