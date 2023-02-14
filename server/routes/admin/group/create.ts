import { controller, Request, Response } from "@kidztime/middlewares";
import {  SvGroup } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required(["type"]),
  validator.trim(["handle", "description"], { clean: true }),
], async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const { name, type, description, handle, discount_value, discount_type, start_at, end_at } = req.body;
  const accessory_group = await SvGroup.create_group({
    name, type, description, handle,
    discount_value, discount_type,
    start_at, end_at,
    actor_id: self.id
  }, { ip_address: req.attr?.ip });

  res.result.model = accessory_group;
});
