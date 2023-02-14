import { DataTypes } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.removeColumn("order", "additional_shipping");
    await sequelize.removeColumn("order", "weight");
    await sequelize.removeColumn("order", "points_discount");
    await sequelize.removeColumn("order", "payment_method");
    await sequelize.removeColumn("order", "coupon_discount");
    await sequelize.removeColumn("order", "shipping");
    await sequelize.removeColumn("order", "date");
    await sequelize.addColumn("order", "net_sales", { type: DataTypes.DECIMAL(24, 2) });
    await sequelize.addColumn("order", "billing_address", { type: DataTypes.STRING });
    await sequelize.addColumn("order", "billing_postal", { type: DataTypes.STRING });
    await sequelize.renameColumn('order', 'subtotal', 'total_sales');
    await sequelize.renameColumn('order', 'total', 'total_discount');
    await sequelize.renameColumn('order', 'items', 'total_payment');
    await sequelize.changeColumn('order', 'total_payment', { type: DataTypes.DECIMAL(24, 2) });
    await sequelize.renameColumn('order', 'discount_code', 'total_shipping');
    await sequelize.changeColumn('order', 'total_shipping', { type: DataTypes.DECIMAL(24, 2) });
    await sequelize.renameColumn('order', 'postal_code', 'shipping_postal');
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn("order", "additional_shipping", { type: DataTypes.DECIMAL(10, 2) });
    await sequelize.addColumn("order", "weight", { type: DataTypes.DECIMAL(10, 2), });
    await sequelize.addColumn("order", "points_discount", { type: DataTypes.DECIMAL(10, 2) });
    await sequelize.addColumn("order", "payment_method", { type: DataTypes.STRING });
    await sequelize.addColumn("order", "coupon_discount", { type: DataTypes.DECIMAL(10, 2) });
    await sequelize.addColumn("order", "shipping", { type: DataTypes.DECIMAL(10, 2) });
    await sequelize.addColumn("order", "date", { type: DataTypes.DATE });
    await sequelize.removeColumn("order", "net_sales");
    await sequelize.removeColumn("order", "billing_address");
    await sequelize.removeColumn("order", "billing_postal");
    await sequelize.renameColumn('order', 'total_sales', 'subtotal');
    await sequelize.renameColumn('order', 'total_discount', 'total');
    await sequelize.renameColumn('order', 'total_payment', 'items');
    await sequelize.changeColumn('order', 'items', { type: DataTypes.INTEGER });
    await sequelize.renameColumn('order', 'total_shipping', 'discount_code');
    await sequelize.changeColumn('order', 'discount_code', { type: DataTypes.STRING });
    await sequelize.renameColumn('order', 'shipping_postal', 'postal_code');
};
