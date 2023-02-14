import { controller, Request, Response } from "@kidztime/middlewares";
import { Account,  Order, OrderItem, Payment, Product, GroupProduct, Group } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const options = req.parse_query!();
  const reference = req.params.reference
  options.where = {
    reference : reference,
  };
  options.include = [
    {
      model: OrderItem,
      include:[{
        model: Product,
        include:[{
          model: GroupProduct,
          include:[{
            model: Group
          }]
        }]
      }]
    }
  ];
  const order = await Order.findOne({
    ...options,
  });

  res.result = {
    model: order,
  };
});
