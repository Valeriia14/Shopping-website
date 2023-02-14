import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
 
  await sequelize.addColumn("product", "promo_id", {
    type: DataTypes.INTEGER,
  });
  await sequelize.addColumn("product", "promo_price", {
    type: DataTypes.DECIMAL(10,2),
  });
  await sequelize.addColumn("product", "webpage_id", {
    type: DataTypes.INTEGER,
  });
  await sequelize.addColumn("product", "published", {
    type: DataTypes.BOOLEAN,
  });
  await sequelize.addColumn("product", "published_at", {
    type: DataTypes.DATE,
  });
  await sequelize.addColumn("product", "is_gift", {
    type: DataTypes.INTEGER,
  });
  await sequelize.addColumn("product", "is_accessory", {
    type: DataTypes.INTEGER,
  });
  await sequelize.addColumn("product", "has_accessory", {
    type: DataTypes.INTEGER,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn("product", "promo_id");
  await sequelize.removeColumn("product", "promo_price");
  await sequelize.removeColumn("product", "webpage_id");
  await sequelize.removeColumn("product", "published");
  await sequelize.removeColumn("product", "published_at");
  await sequelize.removeColumn("product", "is_gift");
  await sequelize.removeColumn("product", "is_accessory");
  await sequelize.removeColumn("product", "has_accessory");
};
