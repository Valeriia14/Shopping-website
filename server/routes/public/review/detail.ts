import { controller, Request, Response } from "@kidztime/middlewares";
import SvProduct from "@kidztime/services/product";

export default controller(async (req: Request, res: Response) => {
  const { review } = req.extras!;

  const detail = review

  res.result.model = detail;
});
