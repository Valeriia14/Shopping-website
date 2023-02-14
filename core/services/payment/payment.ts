import sequelize, { FindOptions } from "sequelize";
import { LogMessage } from "@kidztime/constants";
import { BadRequestError } from "@kidztime/errors";
import { Inventory, ObjectMeta, Order, OrderItem, Payment, Product, ServiceProfile, transact , Asset, GroupProduct, Group, Account } from "@kidztime/models";
import moment from "moment";
import { SvInventory, SvLog, SvPayment, SvOrder } from "..";
import { GenericOpts } from "../types";
import jwt, { SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import config from "@kidztime/config";
import { SvMail } from '@kidztime/services';
import { delete_orderitem, recalculate_order, update_order_item } from './../order/order_item';
export type ChargeCardProps = {
  order: Order;
  account?: Account;
  save?: boolean;
  stripe_token?: string;
  payment_method_id?: number;
  email?: string;
  loyalty_points?: number;
};

export type AdditionalChargeProps = {
  token: string;
  save?: boolean;
  stripe_token?: string;
  payment_method_id?: number;
  email?: string;
  loyalty_points?: number;
  account: Account;
}

export type FindPaymentProps = {
  account: Account;
};

export type RequestRefundOrderItemProps = {
  order: Order;
  order_items: OrderItem[];
  account?: Account;
  reason: string;
};

export type ApproveRefundOrderItemProps = {
  order: Order;
  order_items: OrderItem[];
  payment: Payment;
  account?: Account;
};

export type RefundOrderItemProps = {
  order_item: OrderItem;
  payment: Payment;
};

export type NewOrderItemRequest = {
  product_id: number,
  additional_shipping_fee: number
}
// export type NewOrderItemProps = 
export type ExchangeOrderItemProps = {
  order: Order,
  order_items_old: OrderItem[],
  order_items_new: NewOrderItemRequest[]
  payment: Payment,
  account: Account,
  additional_shipping: number
}

export const find_payment_method = async (props: FindPaymentProps, opts: GenericOpts = {}) => {
  const { account } = props;
  const res = await transact(opts.transaction).run(async (transaction) => {
    let stripe_profile = await ServiceProfile.findOne({
      where: {
        account_id: account.id,
        service: ServiceProfile.SERVICE.stripe,
      },
      transaction
    });

    let payment_info: any;

    if (!stripe_profile) {
      payment_info = [];
      return payment_info;
    }
    payment_info = await ObjectMeta.findAll({
      include: [
        {
          model : Account
        }
      ],
      where: {
        owner_id: stripe_profile.id,
        key: "stripe_source",
      },
      transaction,
    });

    return payment_info;
  });

  return res;
}

export const charge_card = async (props: ChargeCardProps, opts: GenericOpts = {}) => {
  const { order, save, stripe_token, account, email } = props;
  let { payment_method_id } = props;

  await transact(opts.transaction).run(async (transaction) => {
    let source = null;
    let card: any = {};
    let customer = null;
    let receipt_email = null;
    let stripe_profile = null;
    let payment_method = null;

    if (account) {
      stripe_profile = await ServiceProfile.findOne({
        where: {
          account_id: account.id,
          service: ServiceProfile.SERVICE.stripe,
        },
        transaction
      });
    }

    if (stripe_token && save === true) {
      payment_method = await SvPayment.create_stripe_source(stripe_profile!, stripe_token);
      payment_method_id = payment_method.id;
    }

    if (payment_method_id) {
      const stripe_card = account ? await ObjectMeta.findByPk(payment_method_id, { transaction }) : payment_method;
      source = stripe_card!.value;
      customer = stripe_profile?.key;
      card.brand = stripe_card!.extra0;
      card.last4 = stripe_card!.extra1;
      card.exp_month = stripe_card!.extra2;
      card.exp_year = stripe_card!.extra3;
    } else if (stripe_token) {
      let stripe_source = null;
      try {
        stripe_source = await SvPayment.stripe.tokens.retrieve(stripe_token);
        //customer = stripe_profile?.key; // TODO: use customer's saved payment method
      } catch (e) {
        throw new BadRequestError("cannot retrieve card");
      }

      source = stripe_source.id;
      receipt_email = account ? account.email_address : email;

      if (stripe_source.card) {
        card.brand = stripe_source.card.brand;
        card.last4 = stripe_source.card.last4;
        card.exp_month = stripe_source.card.exp_month;
        card.exp_year = stripe_source.card.exp_year;
      }
    } else {
      throw new BadRequestError("payment mode not provided");
    }

    const timestamp = moment();
    const payment = await Payment.create({
      order_id: order.id,
      date: timestamp,
    }, { transaction });

    let charge = null;

    if (order.net_sales && order.net_sales > 0) {
      try {
        charge = await SvPayment.stripe.charges.create({
          amount: toStripeAmount(order.net_sales!),
          currency: order.currency!,
          description: `Order Payment #${order.reference}`,
          ...customer && { customer },
          ...source && { source },
          ...receipt_email && { receipt_email },
        });

        await payment.update({
          description: charge.description,
          payment_method: charge.payment_method,
        }, { transaction });
      } catch (e) {
        await payment.update({ status: Payment.STATUS.failed }, { transaction });
        await SvLog.log_activity({
          actor_id: account ? account.id : 0,
          description: LogMessage.ChargeCardFailure,
          owner: order,
          category: Payment.name,
          ip_address: opts.ip_address,
        }, { transaction });
        console.log(`charge failed`, e);
        throw new BadRequestError(`charge failed:${e.message || "unknown error"}`)
      }
    }

    await payment.update({
      status: Payment.STATUS.success,
     	transaction_amt : order.net_sales!,
      charge_id: charge?.id,
    }, { transaction });

    await order.update({
      payment_method: Order.PAYMENT_METHOD.stripe,
    }, { transaction });

    await SvLog.log_activity({
      actor_id: account ? account.id : 0,
      description: LogMessage.ChargeCardSuccess,
      owner: order,
      category: Payment.name,
      ip_address: opts.ip_address,
    }, { transaction });
  });
};

export const toStripeAmount = (amount: number) => {
  const whole_number_amount = amount * Math.pow(10, 2);
  const stripe_amount: number = +whole_number_amount.toFixed(0);
  return stripe_amount;
};

export const request_refund_order_items = async (props: RequestRefundOrderItemProps, opts: GenericOpts = {}) => {
  const { order, order_items, account, reason } = props;
  const refunded_item = order_items.find(item => item.status === OrderItem.STATUS.refunded);
  if(refunded_item)
    throw new BadRequestError(`order_item ${refunded_item.reference} has already been refunded.`);
  
  const refunded_order = await transact(opts.transaction).run(async (transaction) => {
    if (order.status === Order.STATUS.request_refund)
      throw new BadRequestError("order has already been requested refund");
    OrderItem.update({
      status: OrderItem.STATUS.request_refund,
      refund_reason: reason
    }, {
      where:{
        id: {
          $in: order_items.map(item => item.id)
        }
      }
    })
    const unrefunded_items = await OrderItem.count({ where: { order_id: order.id, status: { [sequelize.Op.not]: OrderItem.STATUS.request_refund } }, transaction });

    await order.update({
      status: unrefunded_items > 0 ? Order.STATUS.request_partial_refund : Order.STATUS.request_refund,
    }, { transaction });

    await SvLog.log_activity({
      actor_id: account ? account.id : 0,
      description: LogMessage.RequestRefundOrderItem,
      owner: order,
      category: OrderItem.name,
      ip_address: opts.ip_address,
    }, { transaction });

    return await Order.findByPk(order.id, { include: [OrderItem, Payment], transaction });
  });
  return refunded_order;
};

export const refund_order_item = async (props: RefundOrderItemProps, opts: GenericOpts = {}) => {
  const { order_item, payment } = props;
  const refunded_amount = await transact(opts.transaction).run(async (transaction) => {

    if (OrderItem.non_billable_status.find((item)=>item === order_item.status))
      throw new BadRequestError("order item can't be refunded");
    const amount = order_item.subtotal!;
    if (amount > 0) {
      try {
        await SvPayment.stripe.refunds.create({
          charge: payment.charge_id!,
          amount: toStripeAmount(amount)
        });
      } catch (e) {
        throw new BadRequestError(`refund failed:${e.message || "unknown error"}`)
      }
    }

    const inventory = await Inventory.findOne({ where: { name: "kidztime" } });
    if (!inventory) throw new BadRequestError("inventory for this platform not found");
    await SvInventory.update_stock_by_order_item({ inventory, order_item, refund: true }, { transaction, ip_address: opts.ip_address });
    await order_item.update({
      status: OrderItem.STATUS.refunded,
    }, { transaction });
    return amount;
  });
  return refunded_amount;
}

export const approve_refund_order_items = async (props: ApproveRefundOrderItemProps, opts: GenericOpts = {}) => {
  const { order, order_items, payment, account } = props;
  if (order.status === Order.STATUS.refunded || payment.status === Payment.STATUS.refunded)
    throw new BadRequestError("order/payment has been refunded");
  const refunded_items = order_items.filter(item => item.status === OrderItem.STATUS.refunded);
  if(refunded_items.length > 0)
    throw new BadRequestError("some items has already been refunded");
  
  let refunded_order = null;
  for (let order_item of order_items) {
    const refunded_result = await transact(opts.transaction).run(async (transaction) => {
      let amount = await refund_order_item({ order_item, payment }, opts);
      const unrefunded_items = await OrderItem.count({ where: { order_id: order.id, status: { [sequelize.Op.not]: OrderItem.STATUS.refunded } }, transaction });
      const full_refunded = ( unrefunded_items === 0 )? true : false
      await payment.update({
        status: full_refunded ? Payment.STATUS.refunded : Payment.STATUS.partial_refunded,
        refund_amount: full_refunded ? (payment.refund_amount || 0 + amount) : payment.amount
      }, { transaction });
      await order.update({
        status: full_refunded ? Order.STATUS.refunded : Order.STATUS.partial_refunded,
      }, { transaction });
      await recalculate_order(order, { transaction })
      await SvLog.log_activity({
        actor_id: account ? account.id : 0,
        description: LogMessage.RefundOrderItem,
        owner: order,
        category: Payment.name,
        ip_address: opts.ip_address,
      }, { transaction });
      return await Order.findByPk(order.id, { include: [OrderItem, Payment], transaction });
    });
    refunded_order = refunded_result!
  }
  if (refunded_order === null)
    throw new BadRequestError("Unable to process refund on order_items")
  return refunded_order;
};

export const approve_cancel_order = async (order: Order, opts: GenericOpts = {}) => {
  const { payments, order_items, account } = order
  const payment = payments?.find((item) => item.type === Payment.TYPES.main)
  const inventory = await Inventory.findOne({ where: { name: "kidztime" } });
  if (!inventory) throw new BadRequestError("inventory for this platform not found");
  if(order.status === Order.STATUS.refunded)
    throw new BadRequestError("Order already refunded");
  if(order.status === Order.STATUS.open)
    throw new BadRequestError("Order is still opened");  
  const canceled_order = await transact(opts.transaction).run(async (transaction) => {
    try {
      let _amount = 0
      for (let order_item of order_items!) {
        await SvInventory.update_stock_by_order_item({ inventory, order_item, refund: true }, { transaction, ip_address: opts.ip_address });
        //if billable status, include it in calculation
        if (!OrderItem.non_billable_status.find((item)=>item === order_item.status)) {
          _amount += order_item.subtotal!
        }
        await order_item.update({
          status: OrderItem.STATUS.refunded,
        }, { transaction });
      }
      if(_amount !== 0){
        await SvPayment.stripe.refunds.create({
          charge: payment?.charge_id!,
          amount: toStripeAmount(_amount)
        });
  
        await payment?.update({
          status: Payment.STATUS.refunded,
          refund_amount: payment.refund_amount || 0 + (_amount)
        }, { transaction })
      }

      await order.update({
        status: Order.STATUS.void
      }, { transaction })

      await OrderItem.update({
        status: OrderItem.STATUS.refunded,
        refund_reason : 'order canceled'
      }, {
        where:{
          id:{
            $in: order_items?.map(item => item.id)
          }
        }, 
        transaction
      })

      return await Order.findByPk(order.id, { include: [OrderItem, Payment], transaction })
    } catch (e) {
      throw new BadRequestError(`order cancel failed:${e.message || "unknown error"}`)
    }
  });
  
  return canceled_order
}

/**
 * Create New Order Items from Product and Quantity
 * Remove Old Order Items
 * Recalculate Order
 * Resolve diff
 */
export const exchange_order_items = async (props: ExchangeOrderItemProps, opts: GenericOpts = {})=>{
  const {
    order, order_items_old, order_items_new, payment, account , additional_shipping
  } = props;
  
  if(order_items_old.length !== order_items_new.length){
    throw new BadRequestError(`invalid request"}`)
  }

  let old_subtotal = order.subtotal!

  let updated_order = await transact(opts.transaction).run<Order>(async (transaction) => {
    const new_order_items: OrderItem[] = []
    const promises_add = order_items_new.map(async (item, index)=>{
      const old_item = order_items_old[index]
      
      await old_item.update({
        quantity: old_item.quantity! - 1
      }, { transaction })

      const out_item = await SvOrder.create_orderitem({
        order_id: order.id,
        product_id: old_item.product_id,
        quantity: 1,
        product_type: old_item.product_type!,
        parent_id: old_item.parent_id!,
        crudscope: 'admin',
        status: OrderItem.STATUS.exchange_out
      }, { transaction })
      const new_item = await SvOrder.create_orderitem({
        order_id: order.id,
        product_id: item.product_id,
        quantity: 1,
        status: OrderItem.STATUS.exchange_in,
        product_type: 'product',
        crudscope: 'admin'
      }, { transaction })
      new_order_items.push(new_item)
      
      if(old_item.quantity === 0){
        await old_item.destroy({ transaction })
      }
    })
    await Promise.all(promises_add)

    
    const updatedOrder = await recalculate_order(order, { transaction })
    const amount_diff = old_subtotal - updatedOrder.subtotal! - additional_shipping
    if( amount_diff >= 0){
      try {

        if(amount_diff !== 0){
          await SvPayment.stripe.refunds.create({
            charge: payment.charge_id!,
            amount: toStripeAmount(amount_diff)
          });
          await payment.update({
            description: "exchange resolved",
          }, { transaction });  
        }
        for(let i = 0; i < order.order_items?.length!; i++){
          const item = order.order_items![i]
          if(item.status === OrderItem.STATUS.exchange_out)
            await item.update({ status: OrderItem.STATUS.exchanged_out}, { transaction })
          if(item.status === OrderItem.STATUS.exchange_in)  
            await item.update({ status: OrderItem.STATUS.exchanged_in}, { transaction })
        }
      } catch (e) {
        console.log(e)
        throw new BadRequestError(`refund failed:${e.message || "unknown error"}`)
      }
    }else{
      /**
       * send invoice for the diff amount
       * after sending invoice, order status will be changed to "PendingResolveExchange"
       * 
       **/
      const { token, expiry } = await create_jwt4resolve_exchange({ 
        order_id: order.id,
        order_ref: order.reference!,
        amount: -amount_diff,
        lastStatus: order.status!
      });
      let model: any = [];
      //add exchange out order item details for mailer
      for(let i = 0; i < order_items_old.length; i++ ){
        const item = order_items_old[i]
        const model_item = {
          product_name: item.product?.name,
          reference: item.product?.reference,
          product_image_url: item.product?.PreviewImage?.uri,
          price: item.product?.price , 
          qty: 1,
          status: OrderItem.STATUS.exchange_out,
          sub_total : item.subtotal
        }
        model.push(model_item)
      }
      //add exchange in order item details for mailer
      for(let i=0; i< new_order_items.length; i++){
        const item = new_order_items[i]
        const model_item = {
          product_name: item.product?.name,
          product_image_url: item.product?.PreviewImage?.uri,
          reference: item.product?.reference,
          price: item.product?.price , 
          qty: 1,
          status: OrderItem.STATUS.exchange_in,
          sub_total : item.subtotal
        }
        model.push(model_item)
      }
      let exchange_mail_data = {
        url: config.paths.exchange_payment_url + '?token=' + token,
        order_date: order.updated_at, 
        order_ref: order.reference!,
        total_diff: amount_diff.toFixed(2), 
        account, 
        receipt_diff: 0, 
        additional_shipping_fee: additional_shipping, 
        model,
        customer_phone_number: order.phone_number!,
        customer_name: order.customer_name!,
        customer_email: order.customer_email!,
        shipping_address: order.shipping_address!,
      }
      await SvMail.send_exchange_resolve_request({
        data: exchange_mail_data
      })
      
      await updatedOrder.update({
        status: Order.STATUS.pendingExchange,
        additional_shipping
      }, { transaction })

    }
    let options: FindOptions = {}
    options.include = [{
      model: Payment
    }, {
      model: Account
    },
    {
        model: OrderItem,
        include:[
            {
                model: Product,
                include:[
                    {
                        model: GroupProduct,
                        include:[{
                            model: Group
                        }]
                    }
                ]
            }
        ]
    }
  ];
  options.order = [[ OrderItem, 'id', 'DESC' ]]

  return await Order.findByPk(order.id, { transaction, ...options })
  });
  return updated_order!
}
export const create_jwt4resolve_exchange = async (props: { order_id: number, order_ref: string, amount: number, lastStatus: string }, opt: GenericOpts={})=>{
  const { order_id, amount, lastStatus, order_ref } = props;
  const AUTH_PRV_KEY = config.auth.prv_key;
  const issuer = config.auth.token_issuer;
  const issue_at = moment();
  const expires_in = 3600 * 24 * 30;
  const expiry = moment(issue_at).add(expires_in, "second");
  const payload = {
    iss: issuer,
    exp: expiry.unix(),
    iat: issue_at.unix(),
    order_id,
    order_ref,
    amount,
    lastStatus
  };
  const secret = AUTH_PRV_KEY;
  const options: SignOptions = { algorithm: "HS512" };
  const token = jwt.sign(payload, secret, options);
  return { token, expiry }
}
export const pay_exchange_diff = async(props: AdditionalChargeProps, opts: GenericOpts={}) =>{
  try{
    let {
      token,
      payment_method_id,
      stripe_token,
      save,
      account,
      email
    } = props
    const payload = await jwt.verify(token, config.auth.prv_key) as { order_id: number, amount: number, lastStatus: string};
    const { order_id, amount, lastStatus } = payload
    
    const resolved_order = await transact(opts.transaction).run(async (transaction) => {
      const order = await Order.findByPk(order_id, {
        include: [{
          model: OrderItem,
          include: [{
            model: Product,
            include: [{
              model: Asset,
              as: "PreviewImage",
            }],
          }],
        }],})
      if(order?.status !== Order.STATUS.pendingExchange)
        throw new BadRequestError(`Order status is invalid to resolve the pending exchange`)
      let source = null;
      let card: any = {};
      let customer = null;
      let receipt_email = null;
      let stripe_profile: any = null;
      let payment_method = null;
  
      if (account) {
        stripe_profile = await ServiceProfile.findOne({
          where: {
            account_id: account.id,
            service: ServiceProfile.SERVICE.stripe,
          },
          transaction
        });
      }
  
      if (stripe_token && save === true) {
        payment_method = await SvPayment.create_stripe_source(stripe_profile!, stripe_token);
        payment_method_id = payment_method.id;
      }
  
      if (payment_method_id) {
        const stripe_card = account ? await ObjectMeta.findByPk(payment_method_id, { transaction }) : payment_method;
        source = stripe_card!.value;
        customer = stripe_profile!.key;
        card.brand = stripe_card!.extra0;
        card.last4 = stripe_card!.extra1;
        card.exp_month = stripe_card!.extra2;
        card.exp_year = stripe_card!.extra3;
      } else if (stripe_token) {
        let stripe_source = null;
        try {
          stripe_source = await SvPayment.stripe.tokens.retrieve(stripe_token);
          customer = stripe_profile!.key;
        } catch (e) {
          throw new BadRequestError("cannot retrieve card");
        }
  
        source = stripe_source.id;
        receipt_email = account ? account.email_address : email;
  
        if (stripe_source.card) {
          card.brand = stripe_source.card.brand;
          card.last4 = stripe_source.card.last4;
          card.exp_month = stripe_source.card.exp_month;
          card.exp_year = stripe_source.card.exp_year;
        }
      } else {
        throw new BadRequestError("payment mode not provided");
      }
  
      const timestamp = moment();
      const payment = await Payment.create({
        order_id: order_id,
        date: timestamp,
        type: Payment.TYPES.additional
      }, { transaction });
  
      let charge = null;

      try {
        charge = await SvPayment.stripe.charges.create({
          amount: toStripeAmount(amount),
          currency: order?.currency!,
          description: `Additional Order Payment #${order?.reference}`,
          ...customer && { customer },
          ...source && { source },
          ...receipt_email && { receipt_email },
        });

        await payment.update({
          description: charge.description,
          payment_method: charge.payment_method,
        }, { transaction });
      } catch (e) {
        await payment.update({ status: Payment.STATUS.failed }, { transaction });
        await SvLog.log_activity({
          actor_id: account ? account.id : 0,
          description: LogMessage.ChargeCardFailure,
          owner: order!,
          category: Payment.name,
          ip_address: opts.ip_address,
        }, { transaction });
        console.log(`charge failed`, e);
        throw new BadRequestError(`charge failed:${e.message || "unknown error"}`)
      }

      await payment.update({
        status: Payment.STATUS.success,
        amount: amount,
        charge_id: charge?.id,
      }, { transaction });
  
      await order?.update({
        payment_method: Order.PAYMENT_METHOD.stripe,
        status: lastStatus,
        additional_shipping: 0
      }, { transaction });
      for(let i = 0; i< order.order_items?.length!; i++){
        const item = order.order_items![i]
        if(item.status === OrderItem.STATUS.exchange_out)
          await item.update({ status: OrderItem.STATUS.exchanged_out})
        if(item.status === OrderItem.STATUS.exchange_in)  
          await item.update({ status: OrderItem.STATUS.exchanged_in})
      }
  
      await SvLog.log_activity({
        actor_id: account ? account.id : 0,
        description: LogMessage.ChargeCardSuccess,
        owner: order!,
        category: Payment.name,
        ip_address: opts.ip_address,
      }, { transaction });
      return order
    });
    return resolved_order
  }catch(e){
    throw new BadRequestError(`token verification error:${e.message || "unknown error"}`)
  }
}
