import { Migration } from "../umzug";

export const up: Migration = async ({ context: queryInterface }) => {
    const { database } = queryInterface.sequelize.config
    //spPromoExpired
    await queryInterface.sequelize.query(
        `CREATE PROCEDURE spPromoExpired ()  BEGIN
        UPDATE product p
        INNER JOIN ${database}.group g ON p.promo_id = g.id
        SET p.promo_id = NULL, p.promo_price = NULL,g.IfExpired = 'Expired'
        WHERE g.published = 1 and   IFNULL( g.IfExpired, '0') = '0' AND
        DATEDIFF(current_timestamp(), g.end_at) > 0;  
        
        UPDATE product p
        INNER JOIN ${database}.group g ON p.promo_id = g.id
        SET p.promo_id = NULL, p.promo_price = NULL
        WHERE g.published = 0 or IFNULL( g.IfExpired, '0') = 'Expired' ;    
    END
    `)

    //spUpdateOrderPayment
    await queryInterface.sequelize.query(
        `CREATE PROCEDURE spUpdateOrderPayment (IN orderId INT, IN PaymentID INT)  BEGIN
        DECLARE Total_Amount decimal(24,2);
        DECLARE OrderReference varchar(255);
        select sum(transaction_amt) INTO Total_Amount from payment where order_id = orderId;
        
        update ${database}.order
        set total_payment = Total_Amount
        where id = orderId;
        
        SELECT reference INTO OrderReference from ${database}.order where id = orderId;
        
        INSERT INTO reward_points (account_id, order_id, payment_id, description, transaction_pts, created_at, updated_at)
        SELECT account_id, NULL, PaymentID, concat('Reward Points from ', OrderReference), 
            transaction_amt/10,        
            current_timestamp(), 
            current_timestamp()
        FROM payment where id = PaymentID;
        
    END
    `)

     //spUpdateStock
     await queryInterface.sequelize.query(
        `CREATE  PROCEDURE spUpdateStock (IN productid INT, IN productsku VARCHAR(255))  BEGIN
        DECLARE Total_Purchase INT;
        DECLARE Total_Order_Item INT;
        DECLARE Total_Return INT;
        
        if IFNULL(productid, 0) = 0 THEN
            select id into productid from product where sku = productsku COLLATE utf8mb4_unicode_ci;	
        END IF;
        if IFNULL(productsku, '0') = '0' THEN
            select sku into productsku from product where id = productid;
        END IF;
        
        select COUNT(*) INTO Total_Order_Item from order_item where product_id = productid;
        select IFNULL(SUM(qty),0)  INTO Total_Purchase from stock_purchase where sku = productsku COLLATE utf8mb4_unicode_ci;
        select IFNULL(SUM(return_qty),0) INTO Total_Return from stock_return where sku = productsku COLLATE utf8mb4_unicode_ci;
        
        update product
            set stock = Total_Purchase - Total_Order_Item + Total_Return
        where id = productid;
    END
    `)
     //promo_Expired_event
     await queryInterface.sequelize.query(
        `CREATE EVENT promo_Expired_event ON SCHEDULE EVERY 1 DAY STARTS '2022-01-22 00:00:00' ON COMPLETION PRESERVE ENABLE COMMENT 'Promo Expired at 00:00 daily!' DO CALL spPromoExpired()
    `)
};

export const down: Migration = async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS spPromoExpired;`);
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS spUpdateOrderPayment;`);
    await queryInterface.sequelize.query(`DROP PROCEDURE IF EXISTS spUpdateStock;`);
    await queryInterface.sequelize.query(`DROP EVENT IF EXISTS promo_Expired_event;`);
};
