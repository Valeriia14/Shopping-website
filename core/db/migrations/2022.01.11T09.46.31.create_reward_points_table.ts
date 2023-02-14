import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.createTable('reward_points', {
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
        transaction_pts: {
            type: DataTypes.DECIMAL(10, 2)
        },
        transaction_value: {
            type: DataTypes.DECIMAL(10, 2)
        },
        expiry_date: {
            type: DataTypes.DATE
        },
        discount_ref_no: {
            type: DataTypes.STRING(45)
        },
        log_status: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        deleted_at: {
            type: DataTypes.DATE,
        }
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.dropTable('reward_points');
};
