import { controller, Request, Response } from "@kidztime/middlewares";
import { Category } from "@kidztime/models";
import { SvClassification } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { ids } = req.query;

  const options = req.parse_query!();

  const { models, meta } = await SvClassification.find_by_category_link({
    exists: ids ? true : false,
    category_link_type_ids: ids ? ids : null,
    options
  });

  res.result.models = models;
  res.result.meta = meta;
});
