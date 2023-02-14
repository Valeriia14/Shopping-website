import { AuthError } from './../../../../core/errors/errors';
import { controller, Request, Response } from "@kidztime/middlewares";
import { Order } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const { self} = req.extras!;
  if(!self){
    throw new AuthError("account");
  }
  let options = req.parse_query!()
  options.where = {
      account_id: self.id
  }
  const orders = await Order.findAll({
      ...options
  })

  res.result = orders;
});
