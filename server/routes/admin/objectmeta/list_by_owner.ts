import { controller, Request, Response } from "@kidztime/middlewares";
import { ObjectMeta } from "@kidztime/models";
import { validator } from "@kidztime/utilities";

export default controller([
  validator.required(["owner_id", "owner_type"]),
  validator.number("owner_id"),
  validator.trim("owner_type"),
], async (req: Request, res: Response) => {
  const { owner_id, owner_type } = req.body;

  const metadata = await ObjectMeta.findAll({
    where: {
      owner_id,
      owner_type,
    },
  });

  res.result = metadata;
});
