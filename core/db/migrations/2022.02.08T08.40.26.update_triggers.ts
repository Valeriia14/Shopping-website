import { Migration } from "../umzug";

export const up: Migration = async ({ context: queryInterface }) => {
    const { database } = queryInterface.sequelize.config
    //category_to_webpage
    await queryInterface.sequelize.query(
        `CREATE TRIGGER category_to_webpage BEFORE INSERT ON category FOR EACH ROW BEGIN

        DECLARE setCategoryID INT;
        DECLARE setTitle VARCHAR(255);
        DECLARE setDescription VARCHAR(255);
        DECLARE setType VARCHAR(45);
        DECLARE setMetaTitle VARCHAR(255);
        DECLARE setMetaKeywords VARCHAR(255);
            DECLARE setWebPageID VARCHAR(255);
            
            
             SET setCategoryID = NEW.id;
            SET setTitle = NEW.name;
             SET setDescription = NEW.description;
              SET setType = NEW.type;
               SET setMetaTitle = NEW.meta_title;
                SET setMetaKeywords = NEW.meta_keywords;
            
            INSERT INTO webpage(title, description, type, meta_title, meta_keywords)
            VALUES (setTitle, setDescription, setType, setMetaTitle, setMetaKeywords);
            
             SET setWebPageID = (SELECT id FROM webpage ORDER BY id DESC LIMIT 1);
             
            IF NEW.webpage_id IS NULL THEN
               set NEW.webpage_id = (select id from webpage ORDER BY id DESC LIMIT 1 );
            END IF;
            
        END`
    )

    //character_to_webpage
    await queryInterface.sequelize.query(
        `CREATE TRIGGER character_to_webpage BEFORE INSERT ON ${database}.character FOR EACH ROW BEGIN

        DECLARE setCharacterID INT;
        DECLARE setTitle VARCHAR(255);
        DECLARE setDescription VARCHAR(255);
        DECLARE setType VARCHAR(45);
        DECLARE setMetaTitle VARCHAR(255);
        DECLARE setMetaKeywords VARCHAR(255);
            
            
            
             SET setCharacterID = NEW.id;
            SET setTitle = NEW.name;
             SET setDescription = NEW.description;
              SET setType = NEW.type;
               SET setMetaTitle = NEW.meta_title;
                SET setMetaKeywords = NEW.meta_keywords;
               
                
        
            INSERT INTO webpage(title, description, type, meta_title, meta_keywords)
            VALUES (setTitle, setDescription, setType, setMetaTitle, setMetaKeywords);
            
            IF NEW.webpage_id IS NULL THEN
                set NEW.webpage_id = (select id from webpage ORDER BY id DESC LIMIT 1 );
            END IF;
            
        END`
    )

    //after_payment_insert
    await queryInterface.sequelize.query(
        `CREATE  TRIGGER after_payment_insert AFTER INSERT ON payment FOR EACH ROW BEGIN
        if IFNULL(NEW.order_id, 0) <> 0 THEN
            CALL  spUpdateOrderPayment(NEW.order_id, NEW.id);
        END IF;
    END`
    )

    //before_product_update
    await queryInterface.sequelize.query(
        `CREATE  TRIGGER before_product_update BEFORE UPDATE ON product FOR EACH ROW BEGIN	
        DECLARE PromoPrice decimal(24,2);
        if (NEW.promo_id IS NOT NULL) then
            SELECT CASE
                WHEN discount_type = 'Percent' THEN NEW.price - ((discount_value/100) * NEW.price)
                WHEN discount_type = 'Value' THEN NEW.price - discount_value
                ELSE discount_value END INTO PromoPrice FROM ${database}.group 
                where id= NEW.promo_id and DATEDIFF(current_timestamp(), end_at) < 1 
                and published = 1 and IFNULL(IfExpired, '0') = '0';
            if (PromoPrice IS NULL) then
                SET NEW.promo_price = PromoPrice, NEW.promo_id = NULL;
            END IF;
            SET NEW.promo_price = PromoPrice;
        END IF;
    END`
    )

    //product_type_to_webpage
    await queryInterface.sequelize.query(
        `CREATE TRIGGER product_type_to_webpage BEFORE INSERT ON product_type FOR EACH ROW BEGIN

        DECLARE setProductTypeID INT;
        DECLARE setTitle VARCHAR(255);
        DECLARE setDescription VARCHAR(255);
        DECLARE setType VARCHAR(45);
        DECLARE setMetaTitle VARCHAR(255);
        DECLARE setMetaKeywords VARCHAR(255);
            DECLARE setWebPageID VARCHAR(255);
            
            
             SET setProductTypeID = NEW.id;
            SET setTitle = NEW.name;
             SET setDescription = NEW.description;
              SET setType = NEW.type;
               SET setMetaTitle = NEW.meta_title;
                SET setMetaKeywords = NEW.meta_keywords;
            
            INSERT INTO webpage(title, description, type, meta_title, meta_keywords)
            VALUES (setTitle, setDescription, setType, setMetaTitle, setMetaKeywords);
            
             SET setWebPageID = (SELECT id FROM webpage ORDER BY id DESC LIMIT 1);
             
            IF NEW.webpage_id IS NULL THEN
               set NEW.webpage_id = (select id from webpage ORDER BY id DESC LIMIT 1 );
            END IF;
            
        END`
    )

    //after_stock_purchase_delete
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_stock_purchase_delete AFTER DELETE ON stock_purchase FOR EACH ROW BEGIN	
        CALL  spUpdateStock(0,OLD.sku);
    END`
    )

    //after_stock_purchase_insert
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_stock_purchase_insert AFTER INSERT ON stock_purchase FOR EACH ROW BEGIN
        declare str_len int default 8;
        declare ready int default 0;
        declare rnd_str text;
        DECLARE productid int;
        
        if not exists (select * from product where sku = NEW.sku) then
            INSERT INTO product (sku, upc, name, category_id, character_id, product_type_id, stock, handle )
            SELECT NEW.sku, NEW.upc, NEW.name, NEW.category_id, NEW.character_id, NEW.product_type_id, NEW.qty, Replace(NEW.name, ' ', '-')	;	
            SET productid = LAST_INSERT_ID();
            while not ready do
                set rnd_str := lpad(conv(floor(rand()*pow(36,str_len)), 10, 36), str_len, 0);
                if not exists (select * from product where reference = concat('PDCT:', rnd_str) COLLATE utf8mb4_unicode_ci) then
                    update product
                        set reference = concat('PDCT:', rnd_str) COLLATE utf8mb4_unicode_ci
                    where id = productid;
                    set ready := 1;
                end if;
            end while;
        end if;
        CALL  spUpdateStock(0,NEW.sku);
    END`
    )

    //after_stock_purchase_update
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_stock_purchase_update AFTER UPDATE ON stock_purchase FOR EACH ROW BEGIN	
        CALL  spUpdateStock(0,NEW.sku);
    END`
    )

    //after_stock_return_delete
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_stock_return_delete AFTER DELETE ON stock_return FOR EACH ROW BEGIN	
        CALL  spUpdateStock(0,OLD.sku);
    END`
    )

    //after_stock_return_insert
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_stock_return_insert AFTER INSERT ON stock_return FOR EACH ROW BEGIN
        CALL spUpdateStock(0,NEW.sku);
    END`
    )
    //after_stock_return_update
    await queryInterface.sequelize.query(
        `CREATE TRIGGER after_stock_return_update AFTER UPDATE ON stock_return FOR EACH ROW BEGIN	
        CALL  spUpdateStock(0,NEW.sku);
    END`
    )
};

export const down: Migration = async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS category_to_webpage;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS character_to_webpage;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_payment_insert;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS before_product_update;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS product_type_to_webpage;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_stock_purchase_delete;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_stock_purchase_insert;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_stock_purchase_update;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_stock_return_delete;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_stock_return_insert;`);
    await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS after_stock_return_update;`);
};
