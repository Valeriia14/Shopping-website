import { controller, Request, Response } from "@kidztime/middlewares";
import { Account,  Order, OrderItem, Payment, Product, GroupProduct, Group, Note, Asset, ShippingOrder, RewardPoint, Voucher } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  
  const options = req.parse_query!();
  const id = req.params.order_id
  options.where = {
    id
  };
  // No include Order Item here because sequelize generates wrong query with order item
  options.include = [{
      model: Payment
    }, {
      model: Account
    },
    {
      model: Note,
      as: 'notes'
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
    {
        model: OrderItem,
        include:[
            {
                model: Product,
                include:[
                  {
                    model: Asset,
                    as: "PreviewImage",
                  },
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
  const order = await Order.findOne({
    ...options,
  });

  res.result.model = order;
//   res.result.meta = query_meta(options, 0);
});
