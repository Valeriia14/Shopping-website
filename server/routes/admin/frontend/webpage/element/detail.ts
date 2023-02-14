import { Asset, WebpageItem } from '@kidztime/models';
import { controller, Request, Response } from "@kidztime/middlewares";

export default controller([], async (req: Request, res: Response) => {
  const options = req.parse_query!();
  const id = req.params.webpage_item_id
  options.where = {
    id
  };
  options.include = [
    {
      model: Asset,
      as: "assets"
    },
  ];
  const webpageItem = await WebpageItem.findOne({
    ...options,
  });

  res.result.model = webpageItem;
});
