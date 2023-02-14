import { controller, Request, Response } from "@kidztime/middlewares";
import { SvGroup } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { group, self } = req.extras!;
  const { name, description, discount_value, discount_type, start_at, end_at, published } = req.body;

  const updated_group = await SvGroup.update_group({
    group,
    name, description, discount_value, discount_type, start_at, end_at, published,
    actor_id: self.id
  }, { ip_address: req.attr?.ip });

  res.result = updated_group;
});
