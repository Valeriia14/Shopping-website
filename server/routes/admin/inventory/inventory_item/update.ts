import { controller, Request, Response } from "@kidztime/middlewares";
import { model_utils } from "@kidztime/utilities";
import SvInventory from "@kidztime/services/inventory";
import { InventoryItem } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const { inventory_item, self } = req.extras!;
  const { count } = req.body;

  await SvInventory.update_inventory_item({ inventory_item, count, actor_id: self.id }, { ip_address: req.attr?.ip });

  res.result.model = await model_utils.scope(InventoryItem, "admin_detail").findByPk(inventory_item.id);
});
