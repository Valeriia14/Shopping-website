import { controller, Request, Response } from "@kidztime/middlewares";

export default controller(async (req: Request, res: Response) => {
  const { question_answer } = req.extras!;

  const detail = question_answer
  res.result.model = detail;
});
