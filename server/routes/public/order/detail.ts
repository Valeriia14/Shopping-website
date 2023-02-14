import { controller, Request, Response } from "@kidztime/middlewares";
import {
  Asset,
  Group,
  GroupProduct,
  Order,
  OrderItem,
  Product,
  RewardPoint,
  ShippingOrder,
  Voucher,
} from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const order_detail = await Order.findOne({
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
              {
                model: GroupProduct,
                include: [
                  {
                    model: Group,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: Voucher,
      },
      {
        model: RewardPoint,
      },
      {
        model: ShippingOrder,
      },
    ],
    where: {
      id: order_id,
    },
  });
  res.result.model = order_detail;
});
