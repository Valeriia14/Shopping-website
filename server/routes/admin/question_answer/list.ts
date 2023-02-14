import { controller, query_meta, Request, Response } from "@kidztime/middlewares";
import { QuestionAnswer } from "@kidztime/models/ugc";
import { Account, Product } from "@kidztime/models";
import { model_utils } from "@kidztime/utilities";


export default controller(async (req: Request, res: Response) => {
  const options = req.parse_query!();
  const { status, search, created_at } = req.query!;
  const { crudscope } = req.extras!;

  let count;

  if (status){
    options.where.status = status;
  }

  if (search) {
    options.search(<string>search, QuestionAnswer.crud.search || []);
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
    }
  ];
  const { primary_key = "id" } = QuestionAnswer;
  const count_col = options.include ? primary_key : `${QuestionAnswer.getTableName()}.${primary_key}`;

  count = await QuestionAnswer.count({
    ...options,
    distinct: true,
    col: count_col,
  });

  const qa = await model_utils.scope(QuestionAnswer, crudscope).findAll({
    ...options,
  });

  res.result.models = qa;
  res.result.meta = query_meta(options, count);
});
