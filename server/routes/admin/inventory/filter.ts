import { controller, Request, Response } from "@kidztime/middlewares";
import SvInventory from "@kidztime/services/inventory";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required(["product_ids", "inventory_ids"])
],
  async (req: Request, res: Response) => {
    const { product_ids, inventory_ids } = req.body!;
    const { self, crudscope = "admin" } = req.extras!;
    const inventory_items = await SvInventory.list_inventory_items({ product_ids, inventory_ids, crudscope, actor_id: self.id }, { ip_address: req.attr?.ip });

    res.result.model = inventory_items;
  });
