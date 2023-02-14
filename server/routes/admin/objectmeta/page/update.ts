import { controller, Request, Response } from "@kidztime/middlewares";
import { SvMetadata } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { handle, key1, key2, key3, key4, key5 } = req.body;

  const metadata = await SvMetadata.page_metadata({ handle, key1, key2, key3, key4, key5 }, { ip_address: req.attr?.ip })

  res.result = metadata;
});
