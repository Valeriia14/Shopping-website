import { controller, Request, Response } from "@kidztime/middlewares";
import { RewardPoint } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;

  const history = await RewardPoint.findAll({
    where: {
      account_id: self.id,
    },
    order: [['id', 'DESC']]
  });

  res.result.models = history;
});
