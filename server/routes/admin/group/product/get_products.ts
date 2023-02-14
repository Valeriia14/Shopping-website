import { controller, Request, Response } from "@kidztime/middlewares";
import { SvGroup } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { self, group } = req.extras!;

  const products = await SvGroup.get_products_of_group({
    group, actor_id: self.id
  }, { ip_address: req.attr?.ip });

  res.result = products;
});
