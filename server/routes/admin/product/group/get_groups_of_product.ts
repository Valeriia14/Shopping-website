import { controller, Request, Response } from "@kidztime/middlewares";

export default controller(async (req: Request, res: Response) => {
  const { product } = req.extras!;

  res.result.model = product.groups;
});
