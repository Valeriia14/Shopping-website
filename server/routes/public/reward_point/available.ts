import { controller, Request, Response } from "@kidztime/middlewares";
import { SvRewardPoint } from "@kidztime/services";


export default controller(async (req: Request, res: Response) => {
  const { self } = req.extras!;
  const sum = await SvRewardPoint.get_available_points(self.id)
  res.result.models = sum;
});
