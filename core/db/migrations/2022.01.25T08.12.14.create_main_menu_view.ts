import { Migration } from "../umzug";

export const up: Migration = async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(
        `CREATE VIEW main_menu AS
            SELECT DISTINCT
                product_type.customer_segment AS customer_segment,
                product_type.customer_segment_dtl AS customer_segment_dtl
            FROM
                product_type`)
};

export const down: Migration = async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`DROP VIEW main_menu`);
};
