import { controller, Request, Response } from "@kidztime/middlewares";
import { SvOrder } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { account } = req.extras!;

  const account_stats = await SvOrder.account_order_stats({ account: account }, { ip_address: req.attr?.ip });

  res.result = account_stats;
});
