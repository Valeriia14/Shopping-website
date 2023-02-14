import { controller, query_meta, Request, Response } from "@kidztime/middlewares";
import { Review } from "@kidztime/models/ugc";
import { Account, Product, Asset } from "@kidztime/models";
import { model_utils } from "@kidztime/utilities";


export default controller(async (req: Request, res: Response) => {
  const options = req.parse_query!();
  const { product_type_id, status, search, created_at, account_id, score } = req.query!;
  const { crudscope } = req.extras!;

  let count;
  if (product_type_id){
    options.where = {
      product_type_id,
    }
  }

  if (status){
    options.where.status = status;
  }

  if (score){
    options.where.score = score;
  }

  if (search) {
    options.search(<string>search, Review.crud.search || []);
  }

  if (created_at) { // seconds range. no miliseconds
    const [first_date, last_date]: any = created_at.toString().split(",");
    options.filter_date({ first_date, last_date }, "created_at");
  }

  options.include = [
    {
      model: Account
    },
    {
      model: Product
    },
    {
      model : Asset,
      as: "assets"
    }
  ];
  options.order = [["created_at", "DESC"]]
  const { primary_key = "id" } = Review;
  const count_col = options.include ? primary_key : `${Review.getTableName()}.${primary_key}`;


  count = await Review.count({
    ...options,
    distinct: true,
    col: count_col,
  });

  const {score: _score, ...count_by_score_where} = options.where;
  const count_by_score = await Review.count({
    where : count_by_score_where,
    group: ["score"],
  });

  const orders = await model_utils.scope(Review, crudscope).findAll({
    ...options,
  });

  res.result.models = orders;
  res.result.meta = query_meta(options, count);
  res.result.extra = count_by_score;

});
