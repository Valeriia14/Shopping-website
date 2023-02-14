import { Payment, Order, OrderItem } from "../billing"
import { Account } from "../identity";
import { Asset, Note } from "../misc";
import { Product } from "../product"
import { Voucher } from "../voucher"
import { RewardPoint } from "../reward_point"
import { ShippingOrder } from "../shipping_order";

Payment.belongsTo(Order, {
  foreignKey: "order_id",
});
// Payment.hasOne(Order, {
//   foreignKey: "payment_id",
// });
Voucher.belongsTo(Order, {
  foreignKey: "order_id",
});

RewardPoint.belongsTo(Order, {
  foreignKey: "order_id",
});

Order.hasMany(Note, {
  foreignKey: "owner_id",
  scope: {
    owner_type: Order.TABLENAME,
  },
  as: 'notes'
});

Order.hasMany(Payment, {
  foreignKey: "order_id",
});

Order.hasOne(Voucher,{
  foreignKey: "order_id",
});

Order.hasOne(RewardPoint,{
  foreignKey: "order_id",
});

Order.hasOne(ShippingOrder,{
  foreignKey: "order_id",
});


// Order.belongsTo(Payment, {
//   foreignKey: "payment_id",
// });
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
});
Order.belongsTo(Account, {
  foreignKey: "account_id",
});
Order.addScope("public", {
  include: [{
    model: OrderItem,
    include: [{
      model: Product,
      as: "product"
    }],
  }],
});
Order.addScope("account", {
  include: [{
    model: OrderItem,
    include: [ {
      model: Product,
      as: "product"
    }],
  }],
});
Order.addScope("admin", {
  include: [
    Account,
    Payment,
    {
      model: OrderItem,
      include: [{
          model: Product,
          include: [{
            model: Asset,
            as: "PreviewImage"
          }]
        }
      ]
    }
  ],
});

OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
});
OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
});


OrderItem.addScope("public", {
  include: [{
    model: Product,
    as: "product"
  }],
});
OrderItem.addScope("account", {
  include: [{
    model: Product,
    include: [{
      model: Asset,
      as: "PreviewImage",
    }],
  }],
});
OrderItem.addScope("admin", {
  include: [{
    model: Product,
    include: [{
      model: Asset,
      as: "PreviewImage",
    }],
  }],
});

export default {};
