import { controller, Request, Response } from "@kidztime/middlewares";
import { SvMetadata } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { key1, key2, key3, key4, key5 } = req.body;

  const metadata = await SvMetadata.page_metadata({ key1, key2, key3, key4, key5 }, { ip_address: req.attr?.ip })

  res.result = metadata;
});
