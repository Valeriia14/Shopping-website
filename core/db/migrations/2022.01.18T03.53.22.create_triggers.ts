import { Migration } from "../umzug";

export const up: Migration = async ({ context: queryInterface }) => {
    //after_discount_transaction_insert
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_discount_transaction_insert AFTER INSERT ON discount_transaction FOR EACH ROW CALL  spComputeOrderTotalDiscount(NEW.order_id)`
    )
    //after_discount_transaction_update
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_discount_transaction_update AFTER UPDATE ON discount_transaction FOR EACH ROW CALL  spComputeOrderTotalDiscount(NEW.order_id)`
    )
    //after_discount_transaction_delete
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_discount_transaction_delete AFTER DELETE ON discount_transaction FOR EACH ROW CALL  spComputeOrderTotalDiscount(OLD.order_id)`
    )
    //after_order_item_insert
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_order_item_insert AFTER INSERT ON order_item FOR EACH ROW CALL spComputeOrderTotalSales(NEW.order_id)`
    )
    //after_order_item_update
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_order_item_update AFTER UPDATE ON order_item FOR EACH ROW CALL spComputeOrderTotalSales(NEW.order_id)`
    )
    //after_order_item_delete
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_order_item_delete AFTER DELETE ON order_item FOR EACH ROW CALL spComputeOrderTotalSales(OLD.order_id)`
    )
    //before_reward_points_insert
    await queryInterface.sequelize.query(
        `CREATE TRIGGER before_reward_points_insert  BEFORE INSERT ON reward_points FOR EACH ROW BEGIN
               if IFNULL(NEW.log_status, 0) = 0 AND NEW.order_id IS NOT NULL  THEN
                   CALL  spRewardPointsInserted(NEW.account_id,NEW.order_id,NEW.discount_ref_no,NEW.transaction_value);
                   SET NEW.log_status = 1;
               END IF;
           END 
           `)
    //after_shipping_orders_insert
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_shipping_orders_insert AFTER INSERT ON shipping_orders FOR EACH ROW CALL  spComputeOrderTotalShipping(NEW.order_id)`
    )
    //after_shipping_orders_update
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_shipping_orders_update AFTER UPDATE ON shipping_orders FOR EACH ROW CALL  spComputeOrderTotalShipping(NEW.order_id)`
    )
    //after_shipping_orders_delete
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_shipping_orders_delete AFTER DELETE ON shipping_orders FOR EACH ROW CALL  spComputeOrderTotalShipping(OLD.order_id)`
    )
    //before_vouchers_insert
    await queryInterface.sequelize.query(
        `CREATE TRIGGER before_vouchers_insert BEFORE INSERT ON vouchers FOR EACH ROW BEGIN
       if IFNULL(NEW.log_status, 0) = 0 AND NEW.order_id IS NOT NULL  THEN
           CALL  spVoucherInserted(NEW.order_id,NEW.account_id,NEW.voucher_type,NEW.discount_ref_no,NEW.voucher_value);
           SET NEW.log_status = 1;
       END IF;
   END
   `)
    //before_vouchers_update
    await queryInterface.sequelize.query(
        `CREATE TRIGGER before_vouchers_update BEFORE UPDATE ON vouchers FOR EACH ROW BEGIN
        if IFNULL(OLD.log_status, 0) = 0 AND NEW.order_id IS NOT NULL  THEN
            CALL  spVoucherInserted(NEW.order_id,NEW.account_id,NEW.voucher_type,NEW.discount_ref_no,NEW.voucher_value);
            SET NEW.log_status = 1;
        END IF;
    END
    `)

};

export const down: Migration = async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_discount_transaction_insert;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_discount_transaction_update;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_discount_transaction_delete;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_order_item_insert;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_order_item_update;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_order_item_delete;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS before_reward_points_insert;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_shipping_orders_insert;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_shipping_orders_update;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_shipping_orders_delete;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS before_vouchers_insert;`)
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS before_vouchers_update;`)
};
