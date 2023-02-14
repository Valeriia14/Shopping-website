import {
  create_item_from_shopee,
  create_orderitem,
  recalculate_order,
} from "./order_item";
import { Op } from "sequelize";
import XLSX, { WritingOptions, WorkBook, WorkSheet } from "xlsx";
import { UploadedFile } from "express-fileupload";
import {
  Account,
  Asset,
  Order,
  OrderItem,
  Product,
  Group,
  transact,
  Note,
  Session,
  CartItem,
  GroupProduct,
  RewardPoint,
  Voucher,
  ShippingOrder,
  Address,
  BillingAddress,
  Payment,
  CartItem,
} from "@kidztime/models";
import { SvMedia, SvOrder, SvPayment, SvRewardPoint, SvPayment } from "..";
import { BadRequestError } from "@kidztime/errors";
import SvInventory from "../inventory";
import { GenericOpts } from "../types";
import { make } from "@kidztime/middlewares";
import {
  OrderWorkSheetHeader,
  PackWorkSheetHeader,
  PickWorkSheetHeader,
  WorkSheetCell,
  WorkSheetNames,
} from "@kidztime/constants";
import { chirp, model_utils } from "@kidztime/utilities";
import validator from "validate.js";
import { ShopeeOrderStatusMap } from "../crontask/crontask";

export type CreateOrderProps = {
  account_id: number;
};

export type CheckoutOrderProps = {
  cart: Order;
  account: Account;
  stripeToken: String;
  crudscope: any;
  shippingAddress: Address;
  billingAddress: BillingAddress;
  note: string;
};

export type UpdateOrderProps = {
  account: Account;
  order: Order;
  discount_code: string;
};

export type UpdateOrderPointsProps = {
  account: Account;
  order: Order;
  points: number;
};

export type CustomerOrderProps = {
  account: Account;
};

export type UpdateOrderOwnerProps = {
  order_id: number;
  account_id: number;
};

type UpdateOrderStatusProps = {
  order: Order;
  status: string;
};
type OrderProcessProps = {
  orders: Order[];
  actor_id: number;
};
type OrderShipProps = {
  xlsx?: UploadedFile;
  actor_id: number;
};
export const sync_shopee_orders = async (
  shopee_list: any,
  opts: GenericOpts = {}
) => {
  for (let i = 0; i < shopee_list.length; i++) {
    const shopee_order = shopee_list[i];
    const account = (
      await Account.findOrCreate({
        where: {
          reference: `SHOPEE:${shopee_order["buyer_user_id"]}`,
        },
        defaults: {
          reference: `SHOPEE:${shopee_order["buyer_user_id"]}`,
          firstname: shopee_order["recipient_address"]["name"],
          lastname: "",
          email_address: "default@test-shopee.com",
          delivery_address: shopee_order["recipient_address"]["full_address"],
          postal_code: shopee_order["recipient_address"]["zipcode"],
          phone_number: shopee_order["recipient_address"]["phone"],
        },
      })
    )[0];
    let order: Order;
    const findOrder = await Order.findOne({
      where: {
        account_id: account.id,
        reference: `SHOPEE:${shopee_order["order_status"]}`,
      },
    });
    if (findOrder) {
      order = findOrder;
      await order.update({
        account_id: account.id,
        reference: `SHOPEE:${shopee_order["order_sn"]}`,
        currency: shopee_order["currency"],
        status: ShopeeOrderStatusMap[shopee_order["order_status"]],
      });
    } else {
      order = await Order.create({
        account_id: account.id,
        reference: `SHOPEE:${shopee_order["order_sn"]}`,
        currency: shopee_order["currency"],
        status: ShopeeOrderStatusMap[shopee_order["order_status"]],
      });
    }
    await create_item_from_shopee(order, shopee_order["item_list"]);
    await SvOrder.recalculate_order(order, opts);
  }
};

export const recalculate_order_discount = async (
  order: Order,
  opts: GenericOpts = {}
) => {
  const updated_order = await transact(opts.transaction).run<Order>(
    async (transaction) => {
      for (let order_item of order.order_items || []) {
        let discount_value = 0;
        let discount_type = "percent";
        if (order_item.product_type === OrderItem.PRODUCT_TYPE.gift) {
          discount_value = 100;
          discount_type = "percent";
        } else {
          const product_detail = await model_utils
            .scope(Product, "admin")
            .findByPk(order_item.product_id);
          const group = product_detail?.group_has_product?.group;
          const isPublished =
            product_detail?.group_has_product?.group.published;

          if (order_item.product_type === OrderItem.PRODUCT_TYPE.product) {
            discount_value =
              group?.type === Group.TYPE.discount
                ? group?.discount_value ?? 0
                : 0;
            discount_type =
              group?.type === Group.TYPE.discount
                ? group?.discount_type ?? "percent"
                : "percent";
          } else {
            discount_value = group?.discount_value ?? 0;
            discount_type = group?.discount_type ?? "percent";
          }
          if (!isPublished) {
            discount_value = 0;
            discount_type = group?.discount_type ?? "percent";
          }
        }
        await order_item.update(
          {
            discount_value,
            discount_type,
          },
          { transaction }
        );
      }
      return await recalculate_order(order, { transaction });
    }
  );
};
export const create_order = async (
  props: CreateOrderProps,
  opts: GenericOpts = {}
) => {
  const order = await transact(opts.transaction).run<Order>(
    async (transaction) => {
      const order = await Order.create(
        {
          account_id: props.account_id,
          currency: "SGD",
          subtotal: 0,
          total: 0,
          items: 0,
          status: Order.STATUS.open,
        },
        { transaction }
      );

      return order;
    }
  );
  return order;
};

export const update_order_owner = async (
  props: UpdateOrderOwnerProps,
  opts: GenericOpts = {}
) => {
  const order = await transact(opts.transaction).run<Order | null>(
    async (transaction) => {
      let order = await Order.findByPk(props.order_id!, { transaction });
      await order?.update(
        {
          account_id: props.account_id,
        },
        { transaction }
      );

      return order;
    }
  );
  return order;
};
export const setNameCustomer = (shippingAddress: Address) => {
  let firstName = shippingAddress?.firstname || "-";
  let lastName = shippingAddress?.lastname || "";
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
  return firstName + " " + lastName;
}

export const checkout = async (
  props: CheckoutOrderProps,
  opts: GenericOpts = {}
) => {
  const { cart, account, stripeToken, shippingAddress, billingAddress, crudscope, note } = props;

  const order_checkedout = await transact(opts.transaction).run<any>(
    async (transaction) => {
      //  Insert Record into kidztime_v2.order
      const createdOrder = await create_order(
        { account_id: account.id },
        { transaction, ip_address: opts.ip_address }
      );
      // Insert Record into kidztime_v2.note
      if(note) {
        await Note.create({
          note: note,
          owner_type: Order?.TABLENAME,
          assoc_type: Order?.NoteAssoc?.customerNote,
          owner_id: createdOrder?.id,
        });
      }

      //  Insert Record into kidztime_v2.orderitem
      await Promise.all(cart.cartItems.map(item => {
        return create_orderitem({
          order_id : createdOrder.id,
          ...item,
          crudscope,
        }, { transaction });
      }))
      await createdOrder.reload({ transaction });

      //  Update Record into kidztime_v2.Voucher
      if (cart.coupon){
        const couponUsed = await Voucher.findOne({
          where: { id: cart.coupon.id },
          transaction,
        })
        couponUsed.order_id = createdOrder.id;
        await couponUsed.save({ transaction });
      }

      await createdOrder.reload({ transaction });

      //  Insert Record into kidztime_v2.RewardPoint
      if (cart.pointsToUse){
        const pointAvailable = await SvRewardPoint.get_available_points(account.id);
        let totalLeft = createdOrder.net_sales - pointAvailable.value_sum;
        const amountUsed = totalLeft < 0 ? createdOrder.net_sales : pointAvailable.value_sum;
        if (amountUsed > 0){
          await RewardPoint.create({
            account_id: account.id,
            order_id: createdOrder.id,
            transaction_pts: -amountUsed*10,
            transaction_value: -amountUsed,
          }, { transaction });
        }
      }

      // Insert Record into kidztime_v2.ShippingOrder
      let shippingAddressData = {}
      let billingAddressData = {}

      if (shippingAddress && shippingAddress.id){
        shippingAddressData = await Address.findOne({
          where: { id: shippingAddress.id},
          transaction,
        })
      }

      if (billingAddress && billingAddress.id){
        billingAddressData = await BillingAddress.findOne({
          where: { id: billingAddress.id},
          transaction,
        })
      }

      if(shippingAddress && shippingAddress.id){
        await ShippingOrder.create({
          account_id: account.id,
          order_id: createdOrder.id,
          customer_name: setNameCustomer(shippingAddress),
          phone_number: shippingAddress?.contact_number,
          sender_address: billingAddressData.street_address,
          sender_postal: billingAddressData.postal_code,
          delivery_address: shippingAddressData.street_address,
          delivery_postal: shippingAddressData.postal_code,
          weight: null,
          width: null,
          length: null,
          height: null,
          collection_date: null,
          shipping_order_no: createdOrder.reference,
          awb_no: null,
          delivery_cost: null,
          delivery_price: createdOrder.net_sales >= 30 ? 0 : 3,
          status: OrderItem.STATUS.unprocessed,
          log_status: 0,
        }, { transaction })
      } else {
        await ShippingOrder.create({
          account_id: account.id,
          order_id: createdOrder.id,
          sender_address: billingAddressData.street_address,
          sender_postal: billingAddressData.postal_code,
          delivery_address: null,
          delivery_postal: null,
          weight: null,
          width: null,
          length: null,
          height: null,
          collection_date: null,
          shipping_order_no: createdOrder.reference,
          awb_no: null,
          delivery_cost: null,
          delivery_price: 0,
          status: OrderItem.STATUS.unprocessed,
          log_status: 0,
        }, { transaction })
      }

      // Query kidztime_v2.Order for Order.NetSales Data for Stripe Payment API, Post Stripe API request
      await createdOrder.reload({ transaction });

      await SvPayment.charge_card({
        order: createdOrder,
        account,
        stripe_token: stripeToken,
      }, {
        transaction,
        ip_address: opts.ip_address,
      });

      await createdOrder.update(
        { status: Order.STATUS.unprocessed },
        { transaction }
      );

      const cart_item_ids = cart?.cartItems.map((item) => item.id);
      await CartItem.update(
        {
          status: CartItem.STATUS.completed,
        },
        {
          where: {
            id: {
              [Op.in]: cart_item_ids,
            },
          },
        }
      );

      return {
        message: "Checkout successfull.",
        order_id: createdOrder.id
      }
    }
  );

  return order_checkedout;
};

export const update_order_points_discount = async (
  props: UpdateOrderPointsProps,
  opts: GenericOpts = {}
) => {
  const { account, order, points } = props;

  const updated_order = await transact(opts.transaction).run<any>(
    async (transaction) => {
      if (!account) {
        throw new BadRequestError("Unauthorized");
      }
      let new_total: any;
      if (order && order.subtotal) {
        new_total = Number(order.subtotal) - points;
      }

      if (order && order.discount) {
        new_total = new_total - Number(order.discount);
      }

      await order.update(
        {
          points_discount: points,
          total: new_total,
        },
        { transaction }
      );

      return order;
    }
  );
  return updated_order;
};

export const update_order_discount_code = async (
  props: UpdateOrderProps,
  opts: GenericOpts = {}
) => {
  const { account, order, discount_code } = props;

  const updated_order = await transact(opts.transaction).run<any>(
    async (transaction) => {
      let params: any;
      const discount = 0;
      await order.update(
        {
          discount_code,
          discount,
        },
        { transaction }
      );

      return order;
    }
  );
  return updated_order;
};

export const account_order_stats = async (
  props: CustomerOrderProps,
  opts: GenericOpts = {}
) => {
  const result = await transact(opts.transaction).run<any>(
    async (transaction) => {
      const total_order_value = await Order.sum("total", {
        where: {
          account_id: props.account.id,
          status: {
            [Op.not]: Order.STATUS.open,
          },
        },
      });
      let number_of_orders = await Order.count({
        where: {
          account_id: props.account.id,
          status: {
            [Op.not]: Order.STATUS.open,
          },
        },
      });
      return { total_order_value, number_of_orders };
    }
  );

  result.loyalty_points = 0;

  return result;
};

export const extend_cart = () => {
  return make(async (req, res) => {
    const cart = req.extras!.cart;
    if (!cart.account_id) {
      res.cookie("order_id", cart.id, {
        maxAge: 2629746000, // one month
        path: "/",
        httpOnly: false,
      });
    }
  });
};

export const load_cart = (should_create = false) => {
  return make(async (req, res) => {
    if (req.extras!.cart) return;
    const self = req.extras!.self;
    const order_id = req.cookies ? req.cookies["order_id"] : null;
    if (self) {
      // Active the current guest order if it exists
      if (order_id) {
        const cart = await SvOrder.update_order_owner({
          account_id: self.id,
          order_id,
        });
        req.extras!.cart = cart;
        res.clearCookie("order_id");
      } else if (self!.order) {
        const cart = await Order.findByPk(self!.order.id, {
          include: [
            {
              model: OrderItem,
              include: [
                {
                  model: Product,
                  include: [
                    {
                      model: Asset,
                      as: "PreviewImage",
                    },
                  ],
                },
              ],
            },
          ],
        });
        req.extras!.cart = cart;
      } else {
        // In case of no guest order, self.order
        const [cart] = await Order.findOrCreate({
          include: [
            {
              model: OrderItem,
              include: [
                {
                  model: Product,
                  include: [
                    {
                      model: Asset,
                      as: "PreviewImage",
                    },
                  ],
                },
              ],
            },
          ],
          where: {
            status: Order.STATUS.open,
            account_id: self.id,
          },
          defaults: {
            currency: "SGD",
            subtotal: 0,
            total: 0,
            items: 0,
          },
        });
        req.extras!.cart = cart;
      }
    } else if (order_id) {
      const cart = await Order.findByPk(order_id, {
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                include: [
                  {
                    model: Asset,
                    as: "PreviewImage",
                  },
                ],
              },
            ],
          },
        ],
      });
      req.extras!.cart = cart;
    }

    if (!req.extras!.cart && should_create) {
      const cart = await Order.create({
        include: [OrderItem],
        account_id: self?.id,
        currency: "SGD",
        subtotal: 0,
        total: 0,
        items: 0,
        status: Order.STATUS.open,
      });

      if (!self) {
        res.cookie("order_id", cart.id, {
          maxAge: 2629746000, // one month
          path: "/",
          httpOnly: false,
        });
      }
      req.extras!.cart = cart;
    }
  });
};

export const update_order_status = async (
  props: UpdateOrderStatusProps,
  opts: GenericOpts
) => {
  await transact(opts.transaction).run(async (transaction) => {
    const { order, status } = props;
    await order.update({ status });
    for (let order_item of order.order_items || []) {
      if (OrderItem.final_status.find((item) => item === order_item.status))
        continue;
      await order_item.update({ status });
    }
  });
};

const validate_uploaded_file = async (xlsx?: UploadedFile) => {
  // validate if file exists in request body
  if (!xlsx) throw new BadRequestError("file not found:xlsx");
  // validate if file extension is correct .xlsx
  if (xlsx.name.split(".").pop() !== "xlsx")
    throw new BadRequestError("incorrect file format!");

  const { filepath } = await SvMedia.store_file(xlsx, true);
  const wb: WorkBook = XLSX.readFile(filepath);
  try {
    await SvMedia.delete_file(filepath);
  } catch (error) {
    chirp("failed to delete temp xlsx file!");
  }
  let missing_sheets: string[] = [];
  Object.values(WorkSheetNames).map((sheet_name: string) => {
    if (!wb.SheetNames.includes(sheet_name)) missing_sheets.push(sheet_name);
  });
  // validate if there are required sheets.
  if (missing_sheets.length)
    throw new BadRequestError("missing sheets", { missing_sheets });

  let pick_json: any[] = XLSX.utils.sheet_to_json(
    wb.Sheets[WorkSheetNames.PICKING_LIST]
  );
  let pack_json: any[] = XLSX.utils.sheet_to_json(
    wb.Sheets[WorkSheetNames.PACKING_LIST]
  );
  let order_json: any[] = XLSX.utils.sheet_to_json(
    wb.Sheets[WorkSheetNames.ORDER_LIST]
  );
  if (!order_json.length) throw new BadRequestError("empty order sheet");
  const order_ids = order_json.map(
    (order_row: any) => order_row[WorkSheetCell.ORDER_ID]
  );
  const filterd_order_ids = order_ids.filter((id) => Boolean(+id));
  // validate if there are required sheets.
  if (!filterd_order_ids.length)
    throw new BadRequestError("all orders are incorrect in order sheet");

  if (order_ids.length !== filterd_order_ids.length)
    throw new BadRequestError("some orders are incorrect in order sheet");
  return { pick_json, pack_json, order_json };
};

export const order_process = async (
  props: OrderProcessProps,
  opts: GenericOpts
) => {
  const result = await transact(opts.transaction).run<File>(
    async (transaction) => {
      const { orders } = props;
      let pick_json: any[] = [];
      let pack_json: any[] = [];
      let order_json: any[] = [];

      for (let order of orders) {
        await SvOrder.update_order_status(
          { status: Order.STATUS.processed, order },
          {}
        );
        const item_count = order.order_items?.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        );
        order_json.push({
          [WorkSheetCell.ORDER_ID]: order.id,
          [WorkSheetCell.ITEM_COUNT]: item_count,
          [WorkSheetCell.DELIVERY_ADDRESS]: order.account?.delivery_address,
          [WorkSheetCell.POSTAL_CODE]: order.account?.postal_code,
          [WorkSheetCell.TRACKING_ID]: "",
        });
        for (let order_item of order.order_items || []) {
          pack_json.push({
            [WorkSheetCell.CUSTOMER]: `${order.account?.firstname} ${order.account?.lastname}`,
            [WorkSheetCell.ORDER_ID]: order.id,
            [WorkSheetCell.PRODUCT_CODE]: order_item?.product?.sku,
            [WorkSheetCell.BARCODE]: order_item?.product?.upc,
            [WorkSheetCell.QUANTITY]: order.items,
            [WorkSheetCell.PACKAGE_WEIGHT]: "",
            [WorkSheetCell.DELIVERY_ADDRESS]: order.account?.delivery_address,
            [WorkSheetCell.POSTAL_CODE]: order.account?.postal_code,
          });
          pick_json.push({
            [WorkSheetCell.IMAGE]: order_item?.product?.PreviewImage?.uri,
            [WorkSheetCell.PRODUCT_CODE]: order_item?.product?.sku,
            [WorkSheetCell.BARCODE]: order_item?.product?.upc,
            [WorkSheetCell.TOTOAL_QTY]: order_item?.quantity,
          });
        }
      }

      const wb: WorkBook = XLSX.utils.book_new();
      const ws_pick: WorkSheet = XLSX.utils.json_to_sheet(pick_json, {
        header: PickWorkSheetHeader,
      });
      const ws_pack: WorkSheet = XLSX.utils.json_to_sheet(pack_json, {
        header: PackWorkSheetHeader,
      });
      const ws_order: WorkSheet = XLSX.utils.json_to_sheet(order_json, {
        header: OrderWorkSheetHeader,
      });
      XLSX.utils.book_append_sheet(wb, ws_pick, WorkSheetNames.PICKING_LIST);
      XLSX.utils.book_append_sheet(wb, ws_pack, WorkSheetNames.PACKING_LIST);
      XLSX.utils.book_append_sheet(wb, ws_order, WorkSheetNames.ORDER_LIST);

      const wbopts: WritingOptions = {
        type: "base64",
        bookType: "xlsx",
      };

      const wbout = XLSX.write(wb, wbopts);
      return wbout;
    }
  );
  return result;
};

export const order_ship = async (props: OrderShipProps, opts: GenericOpts) => {
  const result = await transact(opts.transaction).run<any>(
    async (transaction) => {
      const { xlsx } = props;
      const { pick_json, pack_json, order_json } = await validate_uploaded_file(
        xlsx
      );
      let incorrect_ids: number[] = [];
      let incorrect_tracking_ids: string[] = [];
      // inject tracking id and change status to `shipped`
      for (let order_row of order_json) {
        const order_id = order_row[WorkSheetCell.ORDER_ID];
        const tracking_id = order_row[WorkSheetCell.TRACKING_ID];
        const order = await model_utils
          .scope(Order, "admin")
          .findByPk(order_id);
        if (!order || order.status !== Order.STATUS.processed) {
          incorrect_ids.push(order_id);
        } else if (!tracking_id) {
          incorrect_tracking_ids.push(order_id);
        } else {
          const order_weight = pack_json.find(
            (item: any) => item[WorkSheetCell.ORDER_ID] === order_id
          )[WorkSheetCell.PACKAGE_WEIGHT];
          await order.update({
            tracking_id,
            ...(order_weight && { weight: Number(order_weight).toFixed(2) }),
          });
          await SvOrder.update_order_status(
            { status: Order.STATUS.shipped, order },
            {}
          );
        }
      }
      const process_result =
        !incorrect_ids.length && !incorrect_tracking_ids.length;
      return {
        process_result,
        incorrect_ids,
        incorrect_tracking_ids,
      };
    }
  );
  return result;
};
