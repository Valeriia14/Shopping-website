import { controller, Request, Response } from "@kidztime/middlewares";
import { SvMetadata } from "@kidztime/services";

export default controller(async (req: Request, res: Response) => {
  const { page_metas } = req.body;

  const metadata = await SvMetadata.bulk_update_page_metadata({ page_metas }, { ip_address: req.attr?.ip })

  res.result = metadata;
});
