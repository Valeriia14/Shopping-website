import { controller, Request, Response } from "@kidztime/middlewares";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { product_id, quantity } = req.body!;

  // const updated_order = await SvOrder.add_orderitem({ order: self!.order, product_id, quantity }, { ip_address: req.attr?.ip });

  // res.result = updated_order;
});
