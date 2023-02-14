import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  // Create 3 columns foreign keys for product table
  await sequelize.addColumn("product", "category_id", {
    type: DataTypes.INTEGER,
  });

  await sequelize.addColumn("product", "character_id", {
    type: DataTypes.INTEGER,
  });

  await sequelize.addColumn("product", "product_type_id", {
    type: DataTypes.INTEGER,
  });
  // Create 2 table (character,product_type)
  await sequelize.createTable('character', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "character"
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    handle: {
      type: DataTypes.STRING
    },
    meta_keywords: {
      type: DataTypes.STRING
    },
    meta_title: {
      type: DataTypes.STRING
    },
    extras: {
      type: DataTypes.STRING
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
    deleted_at: {
      type: DataTypes.DATE,
    }
	});
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.removeColumn("product", "category_id");
  await sequelize.removeColumn("product", "character_id");
  await sequelize.removeColumn("product", "product_type_id");
};
