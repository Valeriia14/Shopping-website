import { controller, query_meta, Request, Response } from "@kidztime/middlewares";
import { Asset, ObjectMeta } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const options = req.parse_query!();
  options.where = {
    key: ObjectMeta.KEY.page_content,
  };

  const metadata = await ObjectMeta.findAll({
    ...options,
    include: [{
      model: Asset,
      as: "page-images"
    }],
  });

  const { primary_key = "id" } = ObjectMeta;
  const count_col = options.include ? primary_key : `${ObjectMeta.getTableName()}.${primary_key}`;
  const count = await ObjectMeta.count({
    ...options,
    distinct: true,
    col: count_col,
  });

  const meta = query_meta(options, count);

  res.result.models = metadata;
  res.result.meta = meta;
});
