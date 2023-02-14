import { controller, Request, Response } from "@kidztime/middlewares";
import SvUGC from "@kidztime/services/ugc";
import { model_utils, validator } from "@kidztime/utilities";
import { Review } from "@kidztime/models/ugc";

export default controller([
  validator.required(["score"])
], async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const review = await SvUGC.create_review({
    ...req.body,
    status: Review.STATUS.unpublished,
    account_id: self?.id
  }, { ip_address: req.attr?.ip });
  res.result.model = review
});
