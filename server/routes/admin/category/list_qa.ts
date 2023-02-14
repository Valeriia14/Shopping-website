import { controller, query_meta, Request, Response } from "@kidztime/middlewares";
import { QuestionAnswer } from "@kidztime/models/ugc";
import { Account, Product } from "@kidztime/models";


export default controller(async (req: Request, res: Response) => {
  const { category_id } = req.params;
  const options = req.parse_query!();
  const { status, search } = req.query!;

  let count;
  options.where = {
    category_id,
  }

  if (status){
    options.where.status = status;
  }
  if (search) {
    options.search(<string>search, QuestionAnswer.crud.search || []);
  }

  options.include = [{
    model: Account,
    },
    { 
      model: Product,
    }
  ];
  const { primary_key = "id" } = QuestionAnswer;
  const count_col = options.include ? primary_key : `${QuestionAnswer.getTableName()}.${primary_key}`;
  count = await QuestionAnswer.count({
    ...options,
    distinct: true,
    col: count_col,
  });
  const QA = await QuestionAnswer.findAll({
    ...options,
  });

  res.result.models = QA;
  res.result.meta = query_meta(options, count);
});
