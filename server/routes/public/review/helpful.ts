import { controller, Request, Response } from "@kidztime/middlewares";
import SvUGC from "@kidztime/services/ugc";
import { model_utils, validator } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { self, review } = req.extras!;
  const updated_review = await SvUGC.helpful_review(review, { ip_address: req.attr?.ip });
  res.result.model = updated_review
});
