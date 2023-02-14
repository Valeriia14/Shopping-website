import { controller, Request, Response } from "@kidztime/middlewares";
import { Note } from "@kidztime/models";
import { SvNote } from "@kidztime/services";
import { validator } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { notes } = req.body;
  const order_id = req.params.order_id;
  const tmp = await SvNote.update_notes(notes, order_id);

  res.result.model = tmp;
});
