import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
 
  await sequelize.addColumn("product_info", "product_type_id", {
    type: DataTypes.INTEGER,
  });
  await sequelize.addColumn("product_info", "sub_component_desc", {
    type: DataTypes.STRING,
  });
  await sequelize.addColumn("product_info", "sub_component_img", {
    type: DataTypes.STRING,
  });
  await sequelize.addColumn("product_info", "sub_component_link", {
    type: DataTypes.STRING,
  });
  await sequelize.addColumn("product_info", "component_type", {
    type: DataTypes.STRING(45),
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn("product_info", "product_type_id");
  await sequelize.removeColumn("product_info", "sub_component_desc");
  await sequelize.removeColumn("product_info", "sub_component_img");
  await sequelize.removeColumn("product_info", "sub_component_link");
  await sequelize.removeColumn("product_info", "component_type");
};
