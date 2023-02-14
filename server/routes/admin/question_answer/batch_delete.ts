import { controller, Request, Response } from "@kidztime/middlewares";
import { QuestionAnswer } from "@kidztime/models/ugc";
import { Op } from "sequelize";

export default controller(async (req: Request, res: Response) => {
  const { ids } = req.body!;
  const result = await QuestionAnswer.destroy({
    where:{
      id: { [Op.in]: ids },
    }
  })

  res.result = result;
});
