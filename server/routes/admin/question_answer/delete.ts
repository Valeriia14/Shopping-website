import { controller, Request, Response } from "@kidztime/middlewares";
import { QuestionAnswer } from "@kidztime/models/ugc";

export default controller(async (req: Request, res: Response) => {
  const { question_answer, self } = req.extras!;
  const result = await QuestionAnswer.destroy({
      where:{
          id: question_answer.id
      }
  })

  res.result = question_answer;
});
