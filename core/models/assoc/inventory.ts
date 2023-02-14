import { InventoryItem } from "../inventory";
import { Product } from "../product";

InventoryItem.belongsTo(Product, {
  foreignKey: "product_id",
});

InventoryItem.addScope("admin", {
  include: [Product],
});

export default {};
