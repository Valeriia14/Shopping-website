import { controller, Request, Response } from "@kidztime/middlewares";
import { InventoryItem } from "@kidztime/models";
import SvInventory from "@kidztime/services/inventory";
import { model_utils, validator } from "@kidztime/utilities";

export default controller([
  validator.required(["product_id", "count"])
],
  async (req: Request, res: Response) => {
    const { product_id, count } = req.body!;
    const { inventory, self } = req.extras!;

    const inventory_item = await SvInventory.add_inventory_item({ inventory_id: inventory.id, product_id, count, actor_id: self.id }, { ip_address: req.attr?.ip });

    res.result.model = await model_utils.scope(InventoryItem, "admin_detail").findByPk(inventory_item.id);
  });
