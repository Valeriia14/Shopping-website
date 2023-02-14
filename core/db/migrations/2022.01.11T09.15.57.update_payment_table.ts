import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.removeColumn("payment", "type");
    await sequelize.removeColumn("payment", "refund_amount");
    await sequelize.addColumn("payment", "account_id", { type: DataTypes.INTEGER('11') });
    await sequelize.addColumn("payment", "transaction_type", { type: DataTypes.STRING(45) });
    await sequelize.addColumn("payment", "transaction_description", { type: DataTypes.STRING });
    await sequelize.renameColumn('payment', 'amount', 'transaction_amt');
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn("payment", "type", { type: DataTypes.STRING });
    await sequelize.addColumn("payment", "refund_amount", { type: DataTypes.DECIMAL(10, 2), });
    await sequelize.removeColumn("payment", "account_id");
    await sequelize.removeColumn("payment", "transaction_type");
    await sequelize.removeColumn("payment", "transaction_description");
    await sequelize.renameColumn('payment', 'transaction_amt', 'amount');
};
