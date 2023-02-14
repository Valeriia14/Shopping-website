import { controller, Request, Response } from "@kidztime/middlewares";
import { Account } from "@kidztime/models";
import { model_utils } from "@kidztime/utilities";

export default controller(async (req: Request, res: Response) => {
  const { crudscope, self } = req.extras!;
  res.result = await model_utils.scope(Account, crudscope).findByPk(self.id);
});
