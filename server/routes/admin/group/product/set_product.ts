import { BadRequestError } from './../../../../../core/errors/errors';
import { controller, Request, Response } from "@kidztime/middlewares";
import { Group } from "@kidztime/models";
import { SvGroup } from "@kidztime/services";
import { model_utils, validator } from "@kidztime/utilities";

export default controller([
  validator.id_array("products"),
], async (req: Request, res: Response) => {
  const { self, group } = req.extras!;
  const { products } = req.body;
  const updated_group = await SvGroup.set_products_to_group({
    group, products, actor_id: self.id
  }, { ip_address: req.attr?.ip });

  res.result.model = await model_utils.scope(Group, "admin_detail").findByPk(updated_group.id);
});
