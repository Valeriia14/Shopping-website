import { controller, Request, Response } from "@kidztime/middlewares";
import SvUGC from "@kidztime/services/ugc";

export default controller(async (req: Request, res: Response) => {
  const { review } = req.extras!;
  const updated_review = await SvUGC.update_review( review, req.body, { ip_address: req.attr?.ip });
  res.result.model = updated_review
});
