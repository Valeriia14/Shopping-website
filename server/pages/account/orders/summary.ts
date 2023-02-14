import { Paths } from "@kidztime/constants";
import { PageResponse, render_page, Request } from "@kidztime/middlewares";
import {
  Order,
  OrderItem,
  RewardPoint,
  ShippingOrder,
  Voucher,
} from "@kidztime/models";

import { Transaction } from "sequelize/types";

export type GenericOpts = {
  transaction?: Transaction;
  ip_address?: string;
};

export default render_page(
  Paths.Views.Account_Order_Summary,
  async (req: Request, res: PageResponse) => {
    const opts: GenericOpts = {};
    const { transaction } = opts;

    const { order } = req.extras!;
    const order_detail = await Order.findOne({
      include: [
        {
          model: OrderItem,
        },
        {
          model: Voucher,
        },
        { model: ShippingOrder },
        { model: RewardPoint },
      ],
      where: {
        id: order.id,
      },
      transaction,
    });
    console.log(order_detail);
    return { order: order_detail };
  }
);
