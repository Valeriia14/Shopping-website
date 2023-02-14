import { controller, Request, Response } from "@kidztime/middlewares";
import { Inventory } from "@kidztime/models";
import SvInventory from "@kidztime/services/inventory";
import { model_utils } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { self, inventory } = req.extras!;
  const { name, description } = req.body;

  await SvInventory.update_inventory({ inventory, name, description, actor_id: self.id });

  res.result.model = await model_utils.scope(Inventory, "admin_detail").findByPk(inventory.id);
});
