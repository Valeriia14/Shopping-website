import { controller, Request, Response } from "@kidztime/middlewares";
import { Category, Product } from "@kidztime/models";
import { QuestionAnswer } from "@kidztime/models/ugc";
import { Op } from "sequelize";


export default controller(async (req: Request, res: Response) => {
  const { search } = req.query!;
  const id = req.params.category_id
  let options = req.parse_query!();
  
  if (search) {
    options.search(<string>search, QuestionAnswer.crud.search || []);
  }
  
  const search_qa = await QuestionAnswer.findAll({
      ...options
  })
  const my_qas = search_qa.filter((qa)=>{
      return (qa.category_id === +id)
  })
  res.result.models = my_qas;
});
