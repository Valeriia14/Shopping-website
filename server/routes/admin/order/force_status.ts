import { BadRequestError } from './../../../../core/errors/errors';
import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {

  const { order } = req.extras!;  
  const { status }  = req.body
  if(Object.values(Order.STATUS).indexOf(status) === -1)
    throw new BadRequestError('Invalid Order Status')
  await SvOrder.update_order_status({ status: status, order }, {});
  const updated_order = await Order.findByPk(order.id)
  res.result.model = updated_order
});
