import { controller, Request, Response } from "@kidztime/middlewares";
import { SvGroup } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.id_array("groups"),
], async (req: Request, res: Response) => {
  const { product, self } = req.extras!;
  const { groups } = req.body;

  const response = await SvGroup.set_group_to_product({
    groups,
    product,
    actor_id: self.id,
  }, { ip_address: req.attr?.ip });

  res.result.model = response;
});
