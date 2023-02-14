import { Session } from "../session";
import { CartItem } from "../cart_item";
import { Product } from "../product";

Session.hasMany(CartItem, {
  foreignKey: "session_id",
});

CartItem.belongsTo(Session, {
  foreignKey: "session_id",
});

CartItem.belongsTo(Product, {
  foreignKey: "product_id",
});
// CartItem.hasOne(Product, {
//   foreignKey: "product_id",
// });

export default {};
