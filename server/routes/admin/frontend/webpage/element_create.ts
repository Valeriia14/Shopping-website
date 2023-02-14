import { controller, Request, Response } from "@kidztime/middlewares";
import { WebpageItem } from "@kidztime/models";

export default controller([
  ...(WebpageItem.crud.validators.create ?? []),
], async (req: Request, res: Response) => {
  const webpage = req.extras!.webpage;

  const webpage_item = await WebpageItem.create({
    ...req.body,
    webpage_id: webpage.id,
  });

  res.result = webpage_item;
});
