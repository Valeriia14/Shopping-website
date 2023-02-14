import { Op } from "sequelize";
import { controller, query_meta, Request, Response } from "@kidztime/middlewares";
import { Account,  Order, OrderItem, Payment, Note } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const { status, search, created_at, account_id } = req.query!;

  const options = req.parse_query!();
  let count;
  options.order = [["id", 'ASC']];
  options.where = {
    status: { [Op.and]: {
      [Op.not]: [Order.STATUS.void, Order.STATUS.open],
      ...(status && status !== "all") && { [Op.eq]: status }
    }}
  };

  if (account_id) {
    options.where.account_id = account_id;
  }

  // No include Order Item here because sequelize generates wrong query with order item
  options.include = [{
      model: Payment
    }, {
      model: Account
    },
    {
      model: Note,
      as: 'notes'
    }
  ];

  if (search) {
    options.search(<string>search, Order.crud.search || []);
  }

  if (created_at) { // seconds range. no miliseconds
    const [first_date, last_date]: any = created_at.toString().split(",");
    options.filter_date({ first_date, last_date }, "created_at");
  }

  const { primary_key = "id" } = Order;
  const count_col = options.include ? primary_key : `${Order.getTableName()}.${primary_key}`;
  count = await Order.count({
    ...options,
    distinct: true,
    col: count_col,
  });
  const orders = await Order.findAll({
    ...options,
  });

  res.result.models = orders;
  res.result.meta = query_meta(options, count);
});
