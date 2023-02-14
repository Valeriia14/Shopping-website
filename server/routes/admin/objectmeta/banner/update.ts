import { controller, cruder, Request, Response } from "@kidztime/middlewares";
import { ObjectMeta } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const { objectmeta } = req.extras!;
  const { ordering, title } = req.body;
  let { categories } = req.body;

  categories = JSON.stringify(categories);
  await cruder.processor(objectmeta, { value: title, extra0: ordering, extra1: categories }, ObjectMeta.crud.update);
  await objectmeta.save();

  res.result = objectmeta;
});
