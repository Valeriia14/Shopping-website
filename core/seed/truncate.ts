require("@kidztime/utilities");
require("@kidztime/config").default.__configure(`./config`);
require("@kidztime/models");

import { Account, AccountPrivilege, Category, CategoryLink, CategoryProduct, Credential, EventLog, Inventory, InventoryItem, IPGeoCache, ObjectMeta, Order, OrderItem, PasswordRequest, Payment, Privilege, Product, ProductInfo, ServiceProfile, transact, VerifyRequest, Webpage, WebpageItem } from "@kidztime/models";
import { chirp } from "@kidztime/utilities";

(async () => {
  await transact().run(async (transaction) => {
    const force = true;
    const where = {};

    await EventLog.destroy({ where, transaction, force });
    await IPGeoCache.destroy({ where, transaction, force });
    await ObjectMeta.destroy({ where, transaction, force });
    await VerifyRequest.destroy({ where, transaction, force });

    await CategoryProduct.destroy({ where, transaction, force });
    await CategoryLink.destroy({ where, transaction, force });
    await Category.destroy({ where, transaction, force });
    await CategoryProduct.destroy({ where, transaction, force });

    await InventoryItem.destroy({ where, transaction, force });
    await Inventory.destroy({ where, transaction, force });

    await OrderItem.destroy({ where, transaction, force });
    await Payment.destroy({ where, transaction, force });
    await Order.destroy({ where, transaction, force });

    await ProductInfo.destroy({ where, transaction, force });
    await Product.destroy({ where, transaction, force });

    await WebpageItem.destroy({ where, transaction, force });
    await Webpage.destroy({ where, transaction, force });

    await PasswordRequest.destroy({ where, transaction, force });
    await ServiceProfile.destroy({ where, transaction, force });
    await Credential.destroy({ where, transaction, force });
    await AccountPrivilege.destroy({ where, transaction, force });
    await Account.destroy({ where, transaction, force });
    await Privilege.destroy({ where, transaction, force });
  });
})()
  .then(() => chirp("truncation complete"))
  .catch(console.error)
  .finally(() => process.exit(0));
