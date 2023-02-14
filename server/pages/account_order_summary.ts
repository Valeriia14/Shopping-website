import { Paths } from "@kidztime/constants";
import { render_page, Request, Response } from "@kidztime/middlewares";
import { Account, Order, OrderItem, Payment, Product, GroupProduct, Group, Note, Asset, ProductInfo, Voucher, RewardPoint } from "@kidztime/models";

export default render_page(Paths.Views.Account_Order_Summary,
  async (req: Request, res: Response) => {
    const { handle } = req.params

    const order = await Order.findByPk(handle, {
      include: [Account, Voucher, RewardPoint,
        {
          model: Note,
          as: 'notes'
        },
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
                  include: [{
                    model: Group
                  }]
                }]
            }
          ]
        }],
      order: [[OrderItem, 'id', 'DESC']]
    }).catch(err => null );
    return { order }
  },
);