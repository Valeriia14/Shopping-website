import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
    await sequelize.addColumn("webpage", "meta_title", {
        type: DataTypes.STRING,
    });
    await sequelize.addColumn("webpage", "meta_keywords", {
        type: DataTypes.STRING,
    });
    await sequelize.addColumn("webpage", "published", {
        type: DataTypes.BOOLEAN,
    });
    await sequelize.addColumn("webpage", "published_at", {
        type: DataTypes.DATE,
    });
};

export const down: Migration = async ({ context: sequelize }) => {
    await sequelize.removeColumn("webpage", "meta_title");
    await sequelize.removeColumn("webpage", "meta_keywords");
    await sequelize.removeColumn("webpage", "published");
    await sequelize.removeColumn("webpage", "published_at");
};
