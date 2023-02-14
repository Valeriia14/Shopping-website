import { controller, Request, Response } from "@kidztime/middlewares";
import SvInventory from "@kidztime/services/inventory";
import { validator } from "@kidztime/utilities";

export default controller([
    validator.required(["count"])
], async (req: Request, res: Response) => {
    const { self, product, inventory } = req.extras!;
    const { count } = req.body;

    const updated_inventory = await SvInventory.update_inventory_by_product({ inventory, count, product, actor_id: self.id });

    res.result.model = updated_inventory
});
