import { controller, Request, Response } from "@kidztime/middlewares";
import { ObjectMeta } from "@kidztime/models";

export default controller(async (req: Request, res: Response) => {
  const handle = req.params["handle"];

  const metadata = await ObjectMeta.findOne({
    where: {
      value: handle,
    },
  })

  res.result = metadata;
});
