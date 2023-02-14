import { controller, Request, Response } from "@kidztime/middlewares";
import { Note } from "@kidztime/models";
import { SvOrder } from "@kidztime/services";
import { validator } from "@kidztime/utilities";


export default controller(async (req: Request, res: Response) => {
  const { note, owner_type, owner_id, assoc_type } = req.body;

  const tmp = await Note.create({
    note,
    owner_type,
    assoc_type,
    owner_id
  })

  res.result.model = tmp;
});