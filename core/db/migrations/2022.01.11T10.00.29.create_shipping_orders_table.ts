import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.createTable('shipping_orders', {
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
        sender_address: {
            type: DataTypes.STRING
        },
        sender_postal: {
            type: DataTypes.STRING(45)
        },
        delivery_address: {
            type: DataTypes.STRING
        },
        delivery_postal: {
            type: DataTypes.STRING(45)
        },
        weight: {
            type: DataTypes.DECIMAL(10, 2)
        },
        width: {
            type: DataTypes.DECIMAL(10, 2)
        },
        length: {
            type: DataTypes.DECIMAL(10, 2)
        },
        height: {
            type: DataTypes.DECIMAL(10, 2)
        },
        collection_date: {
            type: DataTypes.DATE
        },
        shipping_order_no: {
            type: DataTypes.STRING(45)
        },
        awb_no: {
            type: DataTypes.STRING(45)
        },
        delivery_cost: {
            type: DataTypes.DECIMAL(10, 2)
        },
        delivery_price: {
            type: DataTypes.DECIMAL(10, 2)
        },
        status: {
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
    await sequelize.dropTable('shipping_orders');
};
