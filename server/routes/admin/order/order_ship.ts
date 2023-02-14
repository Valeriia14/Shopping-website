import { controller, Request, Response } from "@kidztime/middlewares";
import { SvOrder } from "@kidztime/services";
import { UploadedFile } from "express-fileupload";

export default controller(async (req: Request, res: Response) => {
  const xlsx = req?.files?.xlsx as UploadedFile;
  const { self } = req.extras!;
  const result = await SvOrder.order_ship({ xlsx, actor_id: self.id }, {ip_address: req.attr?.ip});
  res.result = result;
});
