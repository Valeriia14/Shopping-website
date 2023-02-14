import { controller, Request, Response } from "@kidztime/middlewares";
import { Inventory } from "@kidztime/models";
import SvInventory from "@kidztime/services/inventory";
import { model_utils, validator } from "@kidztime/utilities";

export default controller([
  validator.required(["name", "description"])
], async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { name, description } = req.body;

  const inventory = await SvInventory.add_inventory({ name, description, actor_id: self.id }, { ip_address: req.attr?.ip });

  res.result.model = await model_utils.scope(Inventory, "admin_detail").findByPk(inventory.id);
});
