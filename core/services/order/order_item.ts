import { Asset, Group, Order, OrderItem, Product, transact } from "@kidztime/models";
import { BN_ZERO, model_utils, slugify } from "@kidztime/utilities";
import BigNumber from "bignumber.js";
import moment from "moment";
import { create_product } from "../product/product";
import { GenericOpts } from "../types";

export type OrderItemAccessoryProps = {
  id: number;
  quantity: number;
};

export type UpdateOrderItem = {
  order: Order;
  product: Product;
  quantity: number;
  accessory_id?: number;
  gift_id?: number;
  crudscope: string;
};

export type DeleteOrderItemProps = {
  order: Order;
  orderItem: OrderItem;
};

export type UpdateOrderItemProps = {
  order: Order;
  orderItem: OrderItem;
  quantity: number;
  accessory_id?: number;
  gift_id?: number;
};

export type CreateOrderItemProps = {
  order_id: number;
  product_id: number;
  product_type: string;
  parent_id?: number;
  price:number;
  promo_price?:number;
  crudscope: string;
  status?: string;
};

const is_billable = (item: OrderItem): Boolean =>{
  const status = item.status
  const findBillable = OrderItem.non_billable_status.find((state)=>{
    return state === status
  })
  return findBillable? false: true
}

export const create_item_from_shopee = async (order: Order, shopee_items: any ) => {
  for (let i = 0; i < shopee_items.length; i++){
    const shopee_item = shopee_items[i]
    const findProd = await Product.findOne({
      where: {
        handle: slugify(shopee_item['item_name']),
        reference: `SHOPEE:${shopee_item['model_sku']}`,
      },
    })
    let prod: Product;
    if(findProd){
      prod = findProd;
    }else{
      prod = await Product.create({
        handle: slugify(shopee_item['item_name']),
        reference: `SHOPEE:${shopee_item['model_sku']}`,
        name: shopee_item['item_name'],
        alt_name: "",
        sku: shopee_item['model_sku'],
        upc: "",
        material: "",
        stock: 0,
        status: "published",
        price: shopee_item['model_original_price'],
      })
    }
    if(prod.PreviewImage){
      await prod.PreviewImage?.update({
        uri: shopee_item['image_info']['image_url']
      })
    }
    else{
      await Asset.create({
        owner_id: prod.id,
        assoc_type: Product.AssetPreviewImage,
        owner_type: Product.TABLENAME
      })
    }
    const findOrderItem = await OrderItem.findOne({
      where:{
        reference: `SHOPPE:${shopee_item['item_id']}`
      }
    })
    if(findOrderItem){
      await findOrderItem.update({
        order_id: order.id,
        product_id: prod.id,
        product_type: OrderItem.PRODUCT_TYPE.product,
        parent_id: null,
        quantity: shopee_item['model_quantity_purchased'],
        discount_value: shopee_item['model_original_price'] * (shopee_item['model_original_price'] - shopee_item['model_discounted_price']),
        discount_type: "amount",
        status: order.status
      })
    }else{
      await OrderItem.create({
        order_id: order.id,
        product_id: prod.id,
        reference: `SHOPPE:${shopee_item['item_id']}`,
        product_type: OrderItem.PRODUCT_TYPE.product,
        parent_id: null,
        quantity: shopee_item['model_quantity_purchased'],
        discount_value: shopee_item['model_original_price'] * (shopee_item['model_original_price'] - shopee_item['model_discounted_price']),
        discount_type: "amount",
        status: order.status
      });
    }

  }
}

//TODO needs to be updated to calculate the correct discount amount
export const discounted_price = async (total: number, discount: number) => {
  return (total * (1 - (discount / 100)));
};

export const recalculate_order = async (order: Order, opts: GenericOpts = {}) => {

  await transact(opts.transaction).run(async (transaction) => {
    const order_items = await OrderItem.findAll({
      where: { order_id: order.id },
      include: [Product],
      transaction: opts.transaction,
    });

    const {
      subtotal, items,
    } = order_items!.reduce((accum, item) => {
      const unit_price = item.product?.price ?? 0;
      let subtotal = new BigNumber(item.quantity!).times(unit_price).decimalPlaces(2);
      if (item.discount_type === Group.DISCOUNT_TYPE.percent) {
        subtotal = subtotal.times(100 - item.discount_value!).times(0.01).decimalPlaces(2);
      } else if (item.discount_type === Group.DISCOUNT_TYPE.amount) {
        subtotal = subtotal.minus(item.discount_value!).decimalPlaces(2);
      }
      item.unit_price = unit_price;
      item.subtotal = subtotal.toNumber();
      let quantity = item.quantity!;
      if( is_billable(item)){
        return {
          subtotal: accum.subtotal.plus(subtotal),
          items: accum.items.plus(quantity),
        };
      }
     else{
       return {
        subtotal: accum.subtotal.plus(0),
        items: accum.items.plus(quantity),
      };
     }
    }, {
      subtotal: BN_ZERO,
      items: BN_ZERO,
    });

    order.items = items.toNumber();
    order.subtotal = subtotal.toNumber();
    order.total = subtotal.toNumber();

    order.date = moment();

    order.order_items = order_items;

    await order.save({ transaction });
    for (const order_item of order.order_items)
      await order_item.save({ transaction });
  });

  return order;
};


export const add_order_item = async (props: UpdateOrderItem, opts: GenericOpts = {}) => {
  const { order, product, quantity, crudscope } = props;
  const order_id = order.id;
  const product_id = product.id;

  await transact(opts.transaction).run(async (transaction) => {
      const new_order_item = await create_orderitem({
        order_id,
        product_id,
        quantity,
        product_type: OrderItem.PRODUCT_TYPE.product,
        crudscope,
      }, { transaction });
      await recalculate_order(order, { transaction });
  });
  return order;
};

export const update_order_item = async (props: UpdateOrderItem, opts: GenericOpts = {}) => {
  const { order, product, quantity, accessory_id, gift_id, crudscope } = props;
  const order_id = order.id;
  const product_id = product.id;

  await transact(opts.transaction).run(async (transaction) => {

    const order_item = await OrderItem.findOne({
      where: { order_id, product_id },
      transaction,
    });

    const new_quantity = (order_item?.quantity ?? 0) + quantity;
    if (new_quantity <= 0) {
      // new qty <= 0, delete if present
      if (order_item) await OrderItem.destroy({ where: { order_id, parent_id: order_item.id }, transaction });
      await order_item?.destroy({ transaction });

    } else if (!order_item) {
      // new order item, create to cart
      const new_order_item = await create_orderitem({
        order_id,
        product_id,
        quantity,
        product_type: OrderItem.PRODUCT_TYPE.product,
        crudscope,
      }, { transaction });
      if (accessory_id) {
        await create_orderitem({
          order_id,
          product_id: accessory_id,
          parent_id: new_order_item.id,
          quantity,
          product_type: OrderItem.PRODUCT_TYPE.accessory,
          crudscope
        }, { transaction });
      }
      if (gift_id) {
        await create_orderitem({
          order_id,
          product_id: gift_id,
          parent_id: new_order_item.id,
          quantity,
          product_type: OrderItem.PRODUCT_TYPE.gift,
          crudscope
        }, { transaction });
      }
    } else {
      // existing order item, update quantity
      let updates: any = { quantity: new_quantity }
      await order_item.update(updates, { transaction });
      if (accessory_id) {
        const accessory_item = await OrderItem.findOne({
          where: {
            order_id, product_id: accessory_id, parent_id: order_item.id,
            product_type: OrderItem.PRODUCT_TYPE.accessory,
          },
          transaction
        });
        accessory_item ? await accessory_item.update(updates, { transaction })
          : await create_orderitem({
            order_id,
            product_id: accessory_id,
            parent_id: order_item.id,
            quantity: new_quantity,
            product_type: OrderItem.PRODUCT_TYPE.accessory,
            crudscope
          });
      }
      if (gift_id) {
        const gift_item = await OrderItem.findOne({
          where: {
            order_id, product_id: gift_id, parent_id: order_item.id,
            product_type: OrderItem.PRODUCT_TYPE.gift,
          },
          transaction
        });
        gift_item ? await gift_item.update(updates, { transaction })
          : await create_orderitem({
            order_id,
            product_id: gift_id,
            parent_id: order_item.id,
            quantity: new_quantity,
            product_type: OrderItem.PRODUCT_TYPE.gift,
            crudscope
          });
      }
    }

    await recalculate_order(order, { transaction });
  });

  return order;
};

export const create_orderitem = async (props: CreateOrderItemProps, opts: GenericOpts = {}) => {
  const created_order_item = await transact(opts.transaction).run<OrderItem>(async (transaction) => {
    const { order_id, product_id, parent_id, product_type, crudscope } = props;
    let discount_value = 0;
    let discount_type = 'percent';
    let unit_price = 0;
    let subtotal = 0;
    if (product_type === OrderItem.PRODUCT_TYPE.gift) {
      discount_value = 100;
      discount_type = 'percent';
    } else {
      const product_detail = await model_utils.scope(Product, crudscope).findByPk(product_id);
      const group = product_detail?.group_has_product?.group;
      const isPublished = product_detail?.group_has_product?.group.published;
      unit_price = product_detail?.promo_price || product_detail?.price;
      subtotal  = unit_price
      if ((product_type === OrderItem.PRODUCT_TYPE.product) && isPublished) {
        discount_value = group?.type === Group.TYPE.discount ? group?.discount_value ?? 0 : 0;
        discount_type = group?.type === Group.TYPE.discount ? group?.discount_type ?? "percent" : "percent";
      } else {
        discount_value = group?.discount_value ?? 0;
        discount_type = group?.discount_type ?? "percent";
      }
    }
    const order_item = await OrderItem.create({
      order_id,
      product_id,
      product_type,
      parent_id,
      unit_price,
      subtotal,
      discount_value,
      discount_type,
      status : OrderItem.STATUS.unprocessed
    }, { transaction });
    return order_item;
  });
  return created_order_item;
}

export const delete_orderitem = async (props: DeleteOrderItemProps, opts: GenericOpts = {}) => {
  const { order, orderItem } = props;

  const updated_order = await transact(opts.transaction).run<Order>(async (transaction) => {

    let order_subtotal = order.subtotal! - (orderItem.subtotal ?? 0);
    let order_items = order.items! - orderItem.quantity!;
    const child_items = await OrderItem.findAll({
      where: {
        order_id: order.id,
        parent_id: orderItem.id
      }
    });
    if (child_items && child_items.length) {
      const promises = child_items.map(async (item: OrderItem) => {
        order_subtotal = order_subtotal - (item.subtotal ?? 0);
        order_items = order_items - item.quantity!;
        await item.destroy({ transaction });
      });
      await Promise.all(promises);
    }

    await orderItem.destroy({
      transaction,
    });

    await order.update({
      date: moment(),
      subtotal: order_subtotal,
      total: order_subtotal,
      items: order_items,
    }, { transaction });

    return order;
  });
  return updated_order;
};
