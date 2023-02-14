import { controller, Request, Response } from "@kidztime/middlewares";
import frontend from "@kidztime/services/frontend";
import { validator } from "@kidztime/utilities";

export default controller(
  [validator.required(["name", "type"])],
  async (req: Request, res: Response) => {
    const { name, type } = req.body;
    const result = await frontend.update_webpage({ name, type });
    res.result = result;
  }
);
