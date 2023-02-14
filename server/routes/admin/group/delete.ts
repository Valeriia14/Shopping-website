import { controller, Request, Response } from "@kidztime/middlewares";
import { SvGroup } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { group, self } = req.extras!;

  await SvGroup.delete_group({
    group,
    actor_id: self.id
  }, { ip_address: req.attr?.ip });

  res.result = { };
});
