import { controller, query_meta, Request, Response } from "@kidztime/middlewares";
import { OrderItem } from "@kidztime/models";
import { model_utils } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { self, crudscope } = req.extras!;

  const options = req.parse_query!();
  const order_items = await model_utils.scope(OrderItem, crudscope).findAll({ ...options, where: { order_id: self!.order.id } });

  const { primary_key = "id" } = OrderItem;
  const count_col = options.include ? primary_key : `${OrderItem.getTableName()}.${primary_key}`;
  const count = await OrderItem.count({
    ...options,
    where: { order_id: self!.order.id },
    distinct: true,
    col: count_col,
  });

  res.result.models = order_items;
  res.result.meta = query_meta(options, count);
});
