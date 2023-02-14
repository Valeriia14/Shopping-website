import { controller, Request, Response } from "@kidztime/middlewares";
import SvUGC from "@kidztime/services/ugc";
import { validator } from "@kidztime/utilities";


export default controller([
  validator.required(["product_id", "question"])
], async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const review = await SvUGC.create_question_answer({
    ...req.body,
    account_id: self?.id
  }, { ip_address: req.attr?.ip });
  res.result.model = review
});
