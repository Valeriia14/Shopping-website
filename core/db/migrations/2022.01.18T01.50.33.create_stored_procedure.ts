import { Migration } from "../umzug";

export const up: Migration = async ({ context: queryInterface }) => {
    const { database } = queryInterface.sequelize.config
    //spComputeOrderTotalDiscount
    await queryInterface.sequelize.query(
        `CREATE PROCEDURE spComputeOrderTotalDiscount (IN orderId INT)
        BEGIN
            DECLARE Total_Amount decimal(18,2);
            select sum(transaction_amt) INTO Total_Amount from discount_transaction where order_id = orderId;
            
            UPDATE ${database + '.order'}
            set total_discount = Total_Amount,
            net_sales = total_sales + IFNULL(total_shipping, 0.0) + IFNULL(Total_Amount,0.0)
            where id = orderId;
        END
    `)
    //spComputeOrderTotalSales
    await queryInterface.sequelize.query(
        `CREATE PROCEDURE spComputeOrderTotalSales(IN orderId INT)
         BEGIN
             DECLARE Total_Amount decimal(18,2);
             select sum(Subtotal) INTO Total_Amount from  ${database}.order_item where order_id = orderId;
             
             update  ${database}.order
             set total_sales = Total_Amount,
             net_sales = Total_Amount + IFNULL(total_shipping,0.0) + IFNULL(total_discount,0.0)
             where id = orderId;
             
         END
     `)
    //spComputeOrderTotalShipping
    await queryInterface.sequelize.query(
        `CREATE PROCEDURE spComputeOrderTotalShipping (IN orderId INT)
          BEGIN
              DECLARE Total_Amount decimal(18,2);
              select sum(delivery_price) INTO Total_Amount from  ${database}.shipping_orders where order_id = orderId;
              
              update  ${database}.order
              set total_shipping = Total_Amount,
              net_sales = total_sales + IFNULL(Total_Amount,0.0) + IFNULL(total_discount,0.0)
              where id = orderId;
          END
      `)
    //spRewardPointsInserted
    await queryInterface.sequelize.query(
        `CREATE PROCEDURE spRewardPointsInserted (IN accountid INT, IN orderid INT, IN discountrefno varchar(45), IN transactionvalue decimal(10,2))
           BEGIN
               INSERT INTO discount_transaction (account_id, order_id, description,discount_type,discount_ref_no,transaction_amt,created_at)
                   SELECT accountid, orderid,  concat('Reward Points used for', orderid), 'Reward Points',discountrefno, transactionvalue,current_timestamp() ;     
           END
       `)
    //spVoucherInserted
    await queryInterface.sequelize.query(
        `CREATE PROCEDURE spVoucherInserted(IN orderId INT, IN accountid INT, IN vouchertype varchar(45), IN discountrefno varchar(45), IN vouchervalue decimal(10,2))
             BEGIN
                 DECLARE Total_Amount decimal(24,2);
                 select total_sales INTO Total_Amount from  ${database}.order where Id = orderId;
                 
                 INSERT INTO discount_transaction (account_id, order_id, description,discount_type,discount_ref_no,transaction_amt,created_at)
                     SELECT accountid, orderId,  concat('Voucher used for', orderId), vouchertype,discountrefno, 
                     CASE
                         WHEN vouchertype = 'Percent' THEN 0.0 - ((vouchervalue/100) * Total_Amount)
                         WHEN vouchertype = 'Value' THEN 0.0 - vouchervalue
                         ELSE 0.0 - vouchervalue END,        
                     current_timestamp()  ;
             END
         `)
};

export const down: Migration = async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS spComputeOrderTotalDiscount;`);
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS spComputeOrderTotalSales;`)
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS spComputeOrderTotalShipping;`)
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS spRewardPointsInserted;`)
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS spVoucherInserted;`)
};
